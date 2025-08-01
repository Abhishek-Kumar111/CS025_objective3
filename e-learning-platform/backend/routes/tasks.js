const express = require('express');
const Task = require('../models/Task');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all tasks
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, classId, status } = req.query;
    const query = {};
    
    if (classId) query.class = classId;
    if (status) query.status = status;

    // If student, only show published tasks
    if (req.user.role === 'student') {
      query.status = 'published';
    }

    const tasks = await Task.find(query)
      .populate('instructor', 'name email')
      .populate('class', 'title')
      .sort({ dueDate: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('class', 'title')
      .populate('submissions.student', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If student, only show their own submission
    if (req.user.role === 'student') {
      task.submissions = task.submissions.filter(
        submission => submission.student._id.equals(req.user._id)
      );
    }

    res.json({ task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      class: classId,
      dueDate,
      maxPoints,
      instructions,
      allowLateSubmission
    } = req.body;

    const newTask = new Task({
      title,
      description,
      instructor: req.user._id,
      class: classId,
      dueDate,
      maxPoints,
      instructions,
      allowLateSubmission
    });

    await newTask.save();
    await newTask.populate(['instructor', 'class']);

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate(['instructor', 'class']);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit task (Students)
router.post('/:id/submit', auth, async (req, res) => {
  try {
    const { text, files } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if task is published
    if (task.status !== 'published') {
      return res.status(400).json({ message: 'Task is not available for submission' });
    }

    // Check if deadline has passed
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const isLate = now > dueDate;

    if (isLate && !task.allowLateSubmission) {
      return res.status(400).json({ message: 'Submission deadline has passed' });
    }

    // Check if student already submitted
    const existingSubmission = task.submissions.find(
      submission => submission.student.equals(req.user._id)
    );

    if (existingSubmission) {
      return res.status(400).json({ message: 'You have already submitted this task' });
    }

    // Create submission
    const submission = {
      student: req.user._id,
      text,
      files: files || [],
      status: isLate ? 'late' : 'submitted'
    };

    task.submissions.push(submission);
    await task.save();

    res.json({ message: 'Task submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Grade submission (Admin only)
router.post('/:taskId/submissions/:submissionId/grade', adminAuth, async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const submission = task.submissions.id(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = 'graded';

    await task.save();

    res.json({ message: 'Submission graded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Publish task (Admin only)
router.post('/:id/publish', adminAuth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'published' },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task published successfully', task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my submissions (Students)
router.get('/my/submissions', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tasks = await Task.find({
      'submissions.student': req.user._id,
      status: 'published'
    })
    .populate('class', 'title')
    .populate('instructor', 'name')
    .select('title dueDate maxPoints submissions class instructor');

    // Filter to show only user's submissions
    const mySubmissions = tasks.map(task => {
      const mySubmission = task.submissions.find(
        sub => sub.student.equals(req.user._id)
      );
      
      return {
        task: {
          _id: task._id,
          title: task.title,
          dueDate: task.dueDate,
          maxPoints: task.maxPoints,
          class: task.class,
          instructor: task.instructor
        },
        submission: mySubmission
      };
    });

    res.json({ submissions: mySubmissions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
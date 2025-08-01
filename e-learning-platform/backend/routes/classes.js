const express = require('express');
const Class = require('../models/Class');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all classes
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (category) query.category = category;

    const classes = await Class.find(query)
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email')
      .sort({ scheduledTime: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Class.countDocuments(query);

    res.json({
      classes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single class
router.get('/:id', auth, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate('instructor', 'name email avatar')
      .populate('enrolledStudents', 'name email avatar');

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ class: classItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new class (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      scheduledTime,
      duration,
      meetingLink,
      maxStudents,
      category,
      tags
    } = req.body;

    const newClass = new Class({
      title,
      description,
      instructor: req.user._id,
      scheduledTime,
      duration,
      meetingLink,
      maxStudents,
      category,
      tags
    });

    await newClass.save();
    await newClass.populate('instructor', 'name email');

    res.status(201).json({
      message: 'Class created successfully',
      class: newClass
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update class (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('instructor', 'name email');

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({
      message: 'Class updated successfully',
      class: classItem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete class (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const classItem = await Class.findByIdAndDelete(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in class
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if already enrolled
    if (classItem.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this class' });
    }

    // Check if class is full
    if (classItem.enrolledStudents.length >= classItem.maxStudents) {
      return res.status(400).json({ message: 'Class is full' });
    }

    // Enroll student
    classItem.enrolledStudents.push(req.user._id);
    await classItem.save();

    // Add class to user's enrolled classes
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enrolledClasses: classItem._id }
    });

    res.json({ message: 'Successfully enrolled in class' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unenroll from class
router.post('/:id/unenroll', auth, async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Remove student from class
    classItem.enrolledStudents = classItem.enrolledStudents.filter(
      studentId => !studentId.equals(req.user._id)
    );
    await classItem.save();

    // Remove class from user's enrolled classes
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { enrolledClasses: classItem._id }
    });

    res.json({ message: 'Successfully unenrolled from class' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start live class (Admin only)
router.post('/:id/start', adminAuth, async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(
      req.params.id,
      { status: 'live' },
      { new: true }
    );

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Emit to all enrolled students that class has started
    const { io } = require('../server');
    io.to(req.params.id).emit('class-started', {
      classId: classItem._id,
      title: classItem.title,
      meetingLink: classItem.meetingLink
    });

    res.json({ message: 'Class started successfully', class: classItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// End live class (Admin only)
router.post('/:id/end', adminAuth, async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Emit to all participants that class has ended
    const { io } = require('../server');
    io.to(req.params.id).emit('class-ended', {
      classId: classItem._id,
      title: classItem.title
    });

    res.json({ message: 'Class ended successfully', class: classItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
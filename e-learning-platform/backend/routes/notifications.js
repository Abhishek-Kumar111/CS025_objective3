const express = require('express');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all notifications for current user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const query = {
      'recipients.user': req.user._id,
      isActive: true
    };

    if (unreadOnly === 'true') {
      query['recipients.isRead'] = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name email avatar')
      .populate('relatedClass', 'title')
      .populate('relatedTask', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Transform to include user-specific read status
    const transformedNotifications = notifications.map(notif => {
      const userRecipient = notif.recipients.find(
        r => r.user.equals(req.user._id)
      );
      
      return {
        ...notif.toObject(),
        isRead: userRecipient?.isRead || false,
        readAt: userRecipient?.readAt
      };
    });

    const total = await Notification.countDocuments(query);

    res.json({
      notifications: transformedNotifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      'recipients.user': req.user._id,
      'recipients.isRead': false,
      isActive: true
    });

    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create notification (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const {
      title,
      message,
      recipients,
      type,
      priority,
      relatedClass,
      relatedTask,
      scheduledFor,
      expiresAt
    } = req.body;

    let recipientUsers = [];
    
    if (recipients === 'all') {
      // Send to all users
      const allUsers = await User.find({}, '_id');
      recipientUsers = allUsers.map(user => ({ user: user._id }));
    } else if (recipients === 'students') {
      // Send to all students
      const students = await User.find({ role: 'student' }, '_id');
      recipientUsers = students.map(user => ({ user: user._id }));
    } else if (recipients === 'admins') {
      // Send to all admins
      const admins = await User.find({ role: 'admin' }, '_id');
      recipientUsers = admins.map(user => ({ user: user._id }));
    } else if (Array.isArray(recipients)) {
      // Send to specific users
      recipientUsers = recipients.map(userId => ({ user: userId }));
    }

    const notification = new Notification({
      title,
      message,
      sender: req.user._id,
      recipients: recipientUsers,
      type,
      priority,
      relatedClass,
      relatedTask,
      scheduledFor,
      expiresAt
    });

    await notification.save();
    await notification.populate(['sender', 'relatedClass', 'relatedTask']);

    // Emit real-time notification to all recipients
    const { io } = require('../server');
    recipientUsers.forEach(recipient => {
      io.to(recipient.user.toString()).emit('new-notification', {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        createdAt: notification.createdAt
      });
    });

    res.status(201).json({
      message: 'Notification sent successfully',
      notification
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const recipient = notification.recipients.find(
      r => r.user.equals(req.user._id)
    );

    if (!recipient) {
      return res.status(404).json({ message: 'Notification not found for this user' });
    }

    recipient.isRead = true;
    recipient.readAt = new Date();

    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { 'recipients.user': req.user._id },
      {
        $set: {
          'recipients.$.isRead': true,
          'recipients.$.readAt': new Date()
        }
      }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete notification (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all notifications (Admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({})
      .populate('sender', 'name email')
      .populate('relatedClass', 'title')
      .populate('relatedTask', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments({});

    res.json({
      notifications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send class notification (Admin only)
router.post('/class/:classId', adminAuth, async (req, res) => {
  try {
    const { title, message, type = 'class', priority = 'medium' } = req.body;
    const classId = req.params.classId;

    // Get all students enrolled in the class
    const Class = require('../models/Class');
    const classItem = await Class.findById(classId).populate('enrolledStudents');
    
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const recipients = classItem.enrolledStudents.map(student => ({ user: student._id }));

    const notification = new Notification({
      title,
      message,
      sender: req.user._id,
      recipients,
      type,
      priority,
      relatedClass: classId
    });

    await notification.save();

    // Emit real-time notification
    const { io } = require('../server');
    recipients.forEach(recipient => {
      io.to(recipient.user.toString()).emit('new-notification', {
        id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        createdAt: notification.createdAt
      });
    });

    res.status(201).json({
      message: 'Class notification sent successfully',
      notification
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
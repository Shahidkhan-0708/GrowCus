const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Tasks');
const Notification = require('./models/Notification');
const Risk = require('./models/Riskscore');
const Report = require('./models/Report');
require('dotenv').config();

const MONGO_URI = "mongodb+srv://GrowCus:rhO3HF4x3hkn7tw4@growcus.mwml5pl.mongodb.net/?appName=GrowCus";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB.");

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    await Notification.deleteMany({});
    await Risk.deleteMany({});
    await Report.deleteMany({});
    console.log("Cleared existing data collections.");

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@growcus.com',
      password: hashedPassword,
      role: 'admin',
      instituteId: 'INST-001',
      isActive: true
    });

    // Create Teachers
    const teacher1 = await User.create({
      name: 'Dr. Jane Smith',
      email: 'jane@growcus.com',
      password: hashedPassword,
      role: 'teacher',
      instituteId: 'INST-001',
      subject: 'Physics',
      isActive: true
    });

    const teacher2 = await User.create({
      name: 'Prof. Alan Turing',
      email: 'alan@growcus.com',
      password: hashedPassword,
      role: 'teacher',
      instituteId: 'INST-001',
      subject: 'Mathematics',
      isActive: true
    });

    console.log("Created Admin and Teachers.");

    // Create Students with assignedTeacher
    const studentA1 = await User.create({
      name: 'Student A1',
      email: 'a1@growcus.com',
      password: hashedPassword,
      role: 'student',
      instituteId: 'INST-001',
      batch: 'Batch A - JEE 2026',
      subject: 'Physics',
      attendence: 80,
      marks: 85,
      xp: 1500,
      riskScore: 'low',
      assignedTeacher: teacher1._id,
      isActive: true
    });

    const studentA2 = await User.create({
      name: 'Student A2',
      email: 'a2@growcus.com',
      password: hashedPassword,
      role: 'student',
      instituteId: 'INST-001',
      batch: 'Batch A - JEE 2026',
      subject: 'Mathematics',
      attendence: 60,
      marks: 65,
      xp: 800,
      riskScore: 'medium',
      assignedTeacher: teacher2._id,
      isActive: true
    });

    const studentB1 = await User.create({
      name: 'Student B1',
      email: 'b1@growcus.com',
      password: hashedPassword,
      role: 'student',
      instituteId: 'INST-001',
      batch: 'Batch B - NEET 2026',
      subject: 'Biology',
      attendence: 95,
      marks: 90,
      xp: 3200,
      riskScore: 'low',
      assignedTeacher: teacher2._id,
      isActive: true
    });

    const studentB2 = await User.create({
      name: 'Student B2',
      email: 'b2@growcus.com',
      password: hashedPassword,
      role: 'student',
      instituteId: 'INST-001',
      batch: 'Batch B - NEET 2026',
      subject: 'Chemistry',
      attendence: 45,
      marks: 50,
      xp: 400,
      riskScore: 'high',
      assignedTeacher: teacher1._id,
      isActive: true
    });

    console.log("Created Students.");

    // Seed Tasks
    const tasks = [
      {
        title: 'Physics Mechanics Assignment',
        description: 'Complete the worksheets on rotational mechanics and angular momentum.',
        subject: 'Physics',
        xp: 200,
        status: 'completed',
        priority: 'high',
        assignedTo: studentA1._id,
        assignedBy: teacher1._id,
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Calculus Problem Set 1',
        description: 'Solve the limits and continuity problems in chapter 2.',
        subject: 'Mathematics',
        xp: 150,
        status: 'in-progress',
        priority: 'medium',
        assignedTo: studentA2._id,
        assignedBy: teacher2._id,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Biology Cell Structure Quiz',
        description: 'Take the online quiz on cell organelle functions.',
        subject: 'Biology',
        xp: 300,
        status: 'completed',
        priority: 'low',
        assignedTo: studentB1._id,
        assignedBy: teacher2._id,
        deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Organic Chemistry Practice',
        description: 'Draw the mechanisms for electrophilic aromatic substitution.',
        subject: 'Chemistry',
        xp: 100,
        status: 'pending',
        priority: 'high',
        assignedTo: studentB2._id,
        assignedBy: teacher1._id,
        deadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Thermodynamics Exercise',
        description: 'Complete the questions on first and second laws of thermodynamics.',
        subject: 'Physics',
        xp: 200,
        status: 'pending',
        priority: 'medium',
        assignedTo: studentA1._id,
        assignedBy: teacher1._id,
        deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      }
    ];

    await Task.insertMany(tasks);
    console.log("Created Tasks.");

    // Seed Risks
    const risks = [
      {
        studentId: studentA1._id,
        riskLevel: 20,
        level: 'low',
        riskFactors: [],
        calculatedAt: new Date()
      },
      {
        studentId: studentA2._id,
        riskLevel: 50,
        level: 'medium',
        riskFactors: ['low attendance'],
        calculatedAt: new Date()
      },
      {
        studentId: studentB1._id,
        riskLevel: 10,
        level: 'low',
        riskFactors: [],
        calculatedAt: new Date()
      },
      {
        studentId: studentB2._id,
        riskLevel: 85,
        level: 'high',
        riskFactors: ['low attendance', 'low marks'],
        calculatedAt: new Date()
      }
    ];

    await Risk.insertMany(risks);
    console.log("Created Risks.");

    // Seed Reports
    const reports = [
      {
        instituteId: admin._id, // using admin as placeholders for institute
        generatedBy: 'Super Admin',
        types: 'Academic Performance',
        data: { description: 'Batch A performance summary showing strong progress in physics and maths.' },
        generatedAt: new Date()
      },
      {
        instituteId: admin._id,
        generatedBy: 'Dr. Jane Smith',
        types: 'Attendance Report',
        data: { description: 'Physics batch attendance review indicating some low-attendance warnings.' },
        generatedAt: new Date()
      }
    ];

    await Report.insertMany(reports);
    console.log("Created Reports.");

    // Seed Notifications
    const notifications = [
      {
        message: 'New task assigned: Physics Mechanics Assignment',
        type: 'success',
        isRead: false,
        studentId: studentA1._id,
        userId: studentA1._id
      },
      {
        message: 'Your attendance is currently low! Please attend upcoming tutorials.',
        type: 'warning',
        isRead: false,
        studentId: studentB2._id,
        userId: studentB2._id
      },
      {
        message: 'Student B2 (Chemistry) is at high academic risk.',
        type: 'warning',
        isRead: false,
        studentId: studentB2._id,
        userId: teacher1._id
      },
      {
        message: 'A new student Student A2 has been enrolled in your Mathematics course.',
        type: 'info',
        isRead: false,
        studentId: studentA2._id,
        userId: teacher2._id
      }
    ];

    await Notification.insertMany(notifications);
    console.log("Created Notifications.");

    console.log("Seeding complete! Database is fully populated.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();

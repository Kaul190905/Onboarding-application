const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gradeflow');
        console.log('Connected to MongoDB for seeding...');

        await User.deleteMany();
        console.log('Cleared existing users.');

        // Create teachers first so we can reference their IDs for student assignedTo
        const teacher1 = await User.create({
            name: 'Prof. James Wilson',
            email: 'james.wilson@school.edu',
            password: 'teacher123',
            role: 'teacher',
            avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=10b981&color=fff',
        });

        const teacher2 = await User.create({
            name: 'Dr. Emily Chen',
            email: 'emily.chen@school.edu',
            password: 'teacher123',
            role: 'teacher',
            avatar: 'https://ui-avatars.com/api/?name=Emily+Chen&background=8b5cf6&color=fff',
        });

        const teacher3 = await User.create({
            name: 'Prof. Michael Brown',
            email: 'michael.brown@school.edu',
            password: 'teacher123',
            role: 'teacher',
            avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=f59e0b&color=fff',
        });

        console.log('Teachers created.');

        // Create admin
        await User.create({
            name: 'Dr. Sarah Mitchell',
            email: 'sarah.mitchell@school.edu',
            password: 'admin123',
            role: 'admin',
            avatar: 'https://ui-avatars.com/api/?name=Sarah+Mitchell&background=3b82f6&color=fff',
        });

        console.log('Admin created.');

        // Create students assigned to teachers by their MongoDB _id
        const teacher1Id = teacher1._id.toString();
        const teacher2Id = teacher2._id.toString();
        const teacher3Id = teacher3._id.toString();

        // Students assigned to Teacher 1 (Prof. James Wilson)
        await User.create({
            name: 'Alice Johnson',
            email: 'alice.johnson@student.edu',
            password: 'student123',
            role: 'student',
            assignedTo: teacher1Id,
            avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=ec4899&color=fff',
        });

        await User.create({
            name: 'Bob Smith',
            email: 'bob.smith@student.edu',
            password: 'student123',
            role: 'student',
            assignedTo: teacher1Id,
            avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&background=06b6d4&color=fff',
        });

        await User.create({
            name: 'Carol Davis',
            email: 'carol.davis@student.edu',
            password: 'student123',
            role: 'student',
            assignedTo: teacher1Id,
            avatar: 'https://ui-avatars.com/api/?name=Carol+Davis&background=84cc16&color=fff',
        });

        // Students assigned to Teacher 2 (Dr. Emily Chen)
        await User.create({
            name: 'Daniel Lee',
            email: 'daniel.lee@student.edu',
            password: 'student123',
            role: 'student',
            assignedTo: teacher2Id,
            avatar: 'https://ui-avatars.com/api/?name=Daniel+Lee&background=f97316&color=fff',
        });

        await User.create({
            name: 'Eva Martinez',
            email: 'eva.martinez@student.edu',
            password: 'student123',
            role: 'student',
            assignedTo: teacher2Id,
            avatar: 'https://ui-avatars.com/api/?name=Eva+Martinez&background=14b8a6&color=fff',
        });

        // Students assigned to Teacher 3 (Prof. Michael Brown)
        await User.create({
            name: 'Frank Garcia',
            email: 'frank.garcia@student.edu',
            password: 'student123',
            role: 'student',
            assignedTo: teacher3Id,
            avatar: 'https://ui-avatars.com/api/?name=Frank+Garcia&background=a855f7&color=fff',
        });

        await User.create({
            name: 'Grace Kim',
            email: 'grace.kim@student.edu',
            password: 'student123',
            role: 'student',
            assignedTo: teacher3Id,
            avatar: 'https://ui-avatars.com/api/?name=Grace+Kim&background=ef4444&color=fff',
        });

        await User.create({
            name: 'Henry Wang',
            email: 'henry.wang@student.edu',
            password: 'student123',
            role: 'student',
            assignedTo: teacher3Id,
            avatar: 'https://ui-avatars.com/api/?name=Henry+Wang&background=6366f1&color=fff',
        });

        console.log('Students created.');
        console.log('Seed data inserted successfully! (1 admin, 3 teachers, 8 students)');

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error.message);
        process.exit(1);
    }
};

seedDB();

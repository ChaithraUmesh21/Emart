const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected...');

        // Create admin user if it doesn't exist
        const adminEmail = 'admin@test.com';
        let admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            const adminPassword = '1234';
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt);

            admin = new User({
                username: 'admin',
                email: adminEmail,
                password: hashedPassword,
                phone: '1234567890',
                role: 'admin'
            });

            await admin.save();
            console.log('Admin user created');
        }
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;

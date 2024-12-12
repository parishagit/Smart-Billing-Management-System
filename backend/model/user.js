const mongoose = require('mongoose');

// Regular expression for validating email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        trim: true, // Trim whitespace
        minlength: 3, // Minimum length for username
        maxlength: 30 // Maximum length for username
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [emailRegex, 'Please fill a valid email address'], // Validate email format
        trim: true // Trim whitespace
    }, 
    password: { 
        type: String, 
        required: true,
        minlength: 6 // Minimum length for password
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create the User model
const UserModel = mongoose.model("User ", UserSchema);

module.exports = UserModel; 
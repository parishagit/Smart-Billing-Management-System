const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const UserModel = require('./model/user'); // User model
const InvoiceModel = require('./model/Invoice'); // Invoice model

dotenv.config();
const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
app.use(express.json());

// Check for required environment variables
const { MONGO_URI, JWT_SECRET } = process.env;
if (!MONGO_URI) {
    throw new Error("MONGO_URI environment variable is required");
}
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

// Database connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '1d' } 
    );
};

// User signup route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser  = await UserModel.findOne({ email });
        if (existingUser ) {
            return res.status(400).json({ message: 'User  already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser  = new UserModel({
            username,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        const savedUser  = await newUser .save();

        // Generate JWT token
        const token = generateToken(savedUser );

        // Send the user details and token back to the client
        res.status(201).json({ user: savedUser , token });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// User login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Send the user details and token back to the client
        res.status(200).json({ message: 'Success', token });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Invoice routes
app.post('/invoices', authenticateToken, async (req, res) => {
    const { amount, description } = req.body;
    try {
        const newInvoice = new InvoiceModel({
            userId: req.user.id, // Associate the invoice with the authenticated user
            amount,
            description
        });
        const savedInvoice = await newInvoice.save();
        res.status(201).json(savedInvoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.get('/invoices', authenticateToken, async (req, res) => {
    try {
        const invoices = await InvoiceModel.find({ userId: req.user.id }); // Fetch invoices for the authenticated user
        res.status(200).json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.put('/invoices/:id', authenticateToken, async (req, res) => {
    const { amount, description, status } = req.body;
    try {
        const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
            req.params.id,
            { amount, description, status },
            { new: true } // Return the updated document
        );
        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json(updatedInvoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

app.delete('/invoices/:id', authenticateToken, async (req, res) => {
    try {
        const deletedInvoice = await InvoiceModel.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Attach user info to request
        next();
    });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
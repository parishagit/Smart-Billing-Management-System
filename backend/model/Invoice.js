const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User ', // Reference to the User model (removed extra space)
        required: true 
    },
    amount: { 
        type: Number, 
        required: true,
        min: 0 // Ensure amount is a positive number
    },
    date: { 
        type: Date, 
        default: Date.now // Automatically set to current date
    },
    description: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Cancelled'], // Possible statuses for the invoice
        default: 'Pending' 
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create the Invoice model
const InvoiceModel = mongoose.model("Invoice", InvoiceSchema);

// Optionally, you can add an index for userId for better query performance
InvoiceSchema.index({ userId: 1 });

module.exports = InvoiceModel;
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    photo: {
        type: Buffer,
        required: false,
    },
    filename: {
        type: String,
        required: false
    },
    mimetype: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    category: {
        type: String,
    },
    price: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Order', OrderSchema);
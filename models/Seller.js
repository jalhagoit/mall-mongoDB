"use strict";

const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isSeller: { type: Boolean, default: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Seller', SellerSchema);
"use strict";

const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        buyerId: { type: String, required: true, unique: true },
        products: [
            {
                productId: {
                    type: String, unique: true
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
            { timestamps: true }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', CartSchema);
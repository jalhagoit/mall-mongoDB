"use strict";

const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        buyerId: { type: String, required: true },
        prooducts: [
            {
                productId: {
                    type: String
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                timestamps: true,
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', CartSchema);
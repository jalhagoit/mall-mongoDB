"use strict";

const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
    {
        buyerId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
            // { timestamps: true } 제품마다 카트에 넣고 수정한 일시 표기 어떻게 해? (스키마 분리?)
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Cart', CartSchema);
"use strict";

const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        sellerId: { type: mongoose.Schema.Types.ObjectId, required: true },
        title: { type: String, required: true },
        // desc: { type: Array, required: true },
        // img: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
        categories: { type: Array },
        price: { type: Number, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
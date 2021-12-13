"use strict";

const router = require('express').Router();
const Product = require('../models/Product');

// TODO
// 토큰(권한) (등록, 수정, 삭제에)
// 어느 판매자ID의 제품인지

// 제품 등록
router.post('/', async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch(err) {
        res.status(500).json(err);
    }
});

// 제품 수정
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true } // 수정 후 리턴
        );
        res.status(200).json(updatedProduct);
    } catch(err) {
        res.status(500).json(err);
    }
});

// 제품 삭제
router.delete('/:id', async (req, res) => {
    try {
        const prod = await Product.findByIdAndDelete(req.params.id);
        if(prod){
            res.status(200).json('제품 삭제 완료'); 
        }
        res.status(200).json('이미 삭제되었거나 없음'); // 몇 번 코드를 던져줘야 돼??
    } catch(err) {
        res.status(500).json(err);
    }
});



// 제품ID로 제품 조회
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product === null) {
            res.status(200).json('조회 제품 없음'); // 몇 번 코드를 던져줘야 돼??
        }
        res.status(200).json(product);
    } catch(err) {
        res.status(500).json(err);
    }
});

// 판매자별 제품 조회
router.get('/seller/:id', async (req, res) => {
    try {
        const products = await Product.find({sellerId: req.params.id});
        res.status(200).json(products);
    } catch(err) {
        res.status(500).json(err);
    }
});


// TODO 검색 조건 및 방식 조정 필요
// 모든 제품 조회
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;

        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(2);
        } else if(qCategory){
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch(err) {
        res.status(500).json(err);
    }
});


module.exports = router;
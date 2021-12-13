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
        await Product.findByIdAndDelete(req.params.id);
        // postman에서 이미 삭제된 제품 다시 삭제 요청 시
        // 왜 err가 아닌 삭제 완료 응답이 뜨는지?
        res.status(200).json('제품 삭제 완료'); 
    } catch(err) {
        res.status(500).json(err);
    }
});



// 제품ID로 제품 조회
// 판매자별 제품 조회
// 모든 제품 조회


module.exports = router;
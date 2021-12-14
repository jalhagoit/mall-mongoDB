"use strict";

const router = require('express').Router();
const Cart = require('../models/Cart');
const Buyer = require('../models/Buyer');

// TODO 조회 및 업데이트 시 토큰(권한) 확인

// 카트 생성(..회원가입 시 생성되게 해야 하나?)
router.post('/', async (req, res) => {
    const newCart = new Cart(req.body);

    try {
        // 구매자 존재 확인 -> 카트 생성(unique로 중복 방지. OneToOne)
        const buyer = await Buyer.findById(req.body.buyerId);
        if(buyer) {
            const savedCart = await newCart.save();
            res.status(201).json(savedCart);
            // 카트 생성은 됐는데 경고떠.. https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode
        }
        res.status(404).json('유저가 존재하지 않음');
            
    } catch(err) {
        res.status(500).json(err);
    }
});

// TODO 카트에 있는 제품들이 유효한가에 대한 확인
// 유저 카트 조회
router.get('/:buyerId', async (req, res) => {
    try {
        const cart = await Cart.find({buyerId: req.params.buyerId});
        if(cart[0]) {
            res.status(200).json(cart);
        }
        res.status(404).json('요청한 유저의 카트가 존재하지 않음');
    } catch(err) {
        res.status(500).json(err);
    }
});


// 업데이트
// 카트에 제품 추가(TODO 카트에 이미 제품이 존재한다면 수량만 추가)
// TODO 수량 수정
router.put('/:cartId', async (req, res) => {
    try {
        // products 배열 내부가 전체 수정됨
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.cartId,
            {products: req.body.products},
            {upsert:true, new: true}
            );
            
        res.status(200).json(updatedCart);
        
    } catch(err) {
        res.status(500).json(err);
    }
});

// 카트에서 제품 삭제
router.delete('/product/:cartId', async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.cartId,
            {
                $pull: {products:{productId: req.body.productId}},
            },
            {new: true}
            );
        res.status(200).json(updatedCart);
        
    } catch(err) {
        res.status(500).json(err);
    }
});




// 카트 삭제
router.delete('/:cartId', async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.cartId);
        res.status(200).json('카트 삭제됨');
    } catch(err) {
        res.status(500).json(err)
    }
});


module.exports = router;
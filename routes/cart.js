"use strict";

const router = require('express').Router();
const cartsController = require("../controllers/cartsController");

// TODO 조회 및 업데이트 시 토큰(권한) 확인

// 카트 생성(..회원가입 시 생성되게 해야 하나?)
router.post('/', cartsController.createCart);

// TODO 카트에 있는 제품들이 유효한가에 대한 확인
// 유저 카트 조회
router.get('/:buyerId', cartsController.findCart);

// 카트에 제품 추가(카트에 이미 제품이 존재한다면 수량 변경)
router.put('/:cartId', cartsController.addToCart);

// 카트에서 제품 삭제
router.delete('/product/:cartId', cartsController.deleteFromCart);

// 카트 삭제
router.delete('/:cartId', cartsController.deleteCart);


module.exports = router;
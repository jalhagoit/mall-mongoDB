"use strict";

const router = require('express').Router();
const Buyer = require('../models/Buyer');
const Seller = require('../models/Seller');
const bcrypt = require('bcryptjs');

// 비밀번호 bcrypt
const hashedPassword = async (req) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(req.body.password, salt); 
};

// TODO 회원가입 시
// 아이디 중복 확인
// 이메일 중복 확인
// 입력한 비번과 컨펌 비번 일치 확인


// 구매자 회원가입
router.post('/register/buyer', async (req, res) => {
    try {
        // 새 유저 생성
        const newBuyer = new Buyer({
            username: req.body.username,
            email: req.body.email,
            password: await hashedPassword(req),
        });

        // 유저 저장과 응답
        const savedBuyer = await newBuyer.save();
            // TODO 카트 생성
        res.status(201).json(savedBuyer);
    } catch(err) {
        res.status(500).json(err);
    }
});

// 판매자 회원가입
router.post('/register/seller', async (req, res) => {
    try {
        // 새 유저 생성
        const newSeller = new Seller({
            username: req.body.username,
            email: req.body.email,
            password: await hashedPassword(req),
        });

        // 유저 저장과 응답
        const savedSeller = await newSeller.save();
        res.status(201).json(savedSeller);
    } catch(err) {
        res.status(500).json(err);
    }
});



// 구매자 로그인
router.post('/login/buyer', async (req, res) => {
    try {
        const buyer = await Buyer.findOne({ username: req.body.username });
        !buyer && res.status(401).json('일치하는 유저네임 없음');
        
        const validPassword = await bcrypt.compare(req.body.password, buyer.password);
        !validPassword && res.status(401).json('비번 틀림');
        
        const { password, ...others } = buyer._doc;

        res.status(200).json(others);
    } catch(err) {
        res.status(500).json(err);
    }
});

// 판매자 로그인
router.post('/login/seller', async (req, res) => {
    try {
        const seller = await Seller.findOne({ username: req.body.username });
        !seller && res.status(401).json('일치하는 유저네임 없음');
        
        const validPassword = await bcrypt.compare(req.body.password, seller.password);
        !validPassword && res.status(401).json('비번 틀림');
        
        const { password, ...others } = seller._doc;

        res.status(200).json(others);
    } catch(err) {
        res.status(500).json(err);
    }
});



module.exports = router;
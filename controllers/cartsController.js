"use strict";

const Cart = require('../models/Cart');
const Buyer = require('../models/Buyer');

// TODO 조회 및 업데이트 시 토큰(권한) 확인

function runUpdate(condition, updateData) {
    return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, updateData, { new: true, upsert: true })
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
}

module.exports = {

    // 카트 생성(..회원가입 시 생성되게 해야 하나?)
    createCart: async (req, res) => {
        const newCart = new Cart(req.body);

        try {
            // 구매자 존재 확인 -> 카트 생성(unique로 중복 방지. OneToOne)
            const buyer = await Buyer.findById(req.body.buyerId);
            if(buyer) {
                const savedCart = await newCart.save();
                res.status(201).json(savedCart);
            }
            res.status(404).json('유저가 존재하지 않음');
                
        } catch(err) {
            res.status(500).json(err);
        }
    },

    // TODO 카트에 있는 제품들이 유효한가에 대한 확인
    // 유저 카트 조회
    findCart: async (req, res) => {
        try {
            const cart = await Cart.find({buyerId: req.params.buyerId});
            if(cart[0]) {
                res.status(200).json(cart);
            }
            res.status(404).json('요청한 유저의 카트가 존재하지 않음');
        } catch(err) {
            res.status(500).json(err);
        }
    },


    // 카트에 제품 추가(카트에 이미 제품이 존재한다면 수량 변경)
    addToCart: async (req, res) => {
        try {
            await Cart.findOne({ _id: req.params.cartId }).exec(async (err, cart) => {
                if (cart) {
                // 카트가 존재한다면 수량 업데이트
                let promiseArray = [];
            
                req.body.products.forEach(async (cartItem) => {
                    const productId = cartItem.productId;
                    const item = cart.products.find((c) => c.productId == productId);
                    let condition, update;
                    if (item) {
                    condition = { _id: req.params.cartId, "products.productId": productId };
                    update = {
                        $set: {
                        "products.$": cartItem,
                        },
                    };
                    } else {
                    condition = { _id: req.params.cartId };
                    update = {
                        $push: {
                        products: cartItem,
                        },
                    };
                    }
                    promiseArray.push(runUpdate(condition, update));
                });
                Promise.all(promiseArray)
                    .then((result) => res.status(201).json(result.pop()))
                    .catch((err) => res.status(400).json({ err }));
                } else {
                // 카트가 없다면 새 카트 생성
                return res.status(404).json('새 카트 생성 코드 없음');
                //   const cart = new Cart({
                //     _id: req.params.cartId,
                //     products: req.body.products,
                //   });
                //   cart.save((err, cart) => {
                //     if (err) return res.status(400).json({ err });
                //     if (cart) {
                //       return res.status(201).json({ cart });
                //     }
                //   });
                }
            });
            
        } catch(err) {
            res.status(500).json(err);
        }
    },


    // 카트에서 제품 삭제
    deleteFromCart: async (req, res) => {
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
    },
    

    // 카트 삭제
    deleteCart: async (req, res) => {
        try {
            await Cart.findByIdAndDelete(req.params.cartId);
            res.status(200).json('카트 삭제됨');
        } catch(err) {
            res.status(500).json(err)
        }
    }

};
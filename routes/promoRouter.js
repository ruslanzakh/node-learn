const express = require('express');
const bodyParser = require('body-parser');
const authentic = require('../authentic');

const Promotion = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .get((req, res, next) => {
        Promotion.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authentic.verifyUser, (req, res, next) => {
        Promotion.create(req.body)
            .then((promotion) => {
                console.log('Promotion created', promotion);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authentic.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.send('Put operation not supported on /promotions');
    }).delete(authentic.verifyUser, (req, res, next) => {
        Promotion.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

promoRouter.route('/:promoId')
    .get((req, res, next) => {
        Promotion.findById(req.params.promoId)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    }).post(authentic.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.send('POST operation not supported on /promotions/' + req.params.promoId);
    }).put(authentic.verifyUser, (req, res, next) => {
        Promotion.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion)
            }, (err) => next(err))
            .catch((err) => next(err));
    }).delete(authentic.verifyUser, (req, res, next) => {
        Promotion.findByIdAndRemove(req.params.promoId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

module.exports = promoRouter;
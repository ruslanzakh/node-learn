const express = require('express');
const bodyParser = require('body-parser');
const authentic = require('../authentic');
const cors = require('./cors');

const Promotion = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Promotion.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        Promotion.create(req.body)
            .then((promotion) => {
                console.log('Promotion created', promotion);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.send('Put operation not supported on /promotions');
    }).delete(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        Promotion.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

promoRouter.route('/:promoId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.corsWithOptions, cors.cors, (req, res, next) => {
        Promotion.findById(req.params.promoId)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    }).post(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.send('POST operation not supported on /promotions/' + req.params.promoId);
    }).put(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        Promotion.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion)
            }, (err) => next(err))
            .catch((err) => next(err));
    }).delete(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        Promotion.findByIdAndRemove(req.params.promoId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

module.exports = promoRouter;
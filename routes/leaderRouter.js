const express = require('express');
const bodyParser = require('body-parser');
const authentic = require('../authentic');
const cors = require('./cors');

const Leader = require('../models/leaders');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Leader.find({})
            .then((leaders) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        Leader.create(req.body)
            .then((leader) => {
                console.log('Leader created', leader);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.send('Put operation not supported on /leaders');
    }).delete(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        Leader.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })

leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {
        Leader.findById(req.params.leaderId)
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => next(err))
            .catch((err) => next(err));
    }).post(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.send('POST operation not supported on /leaders/' + req.params.leaderId);
    }).put(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        Leader.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, { new: true })
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader)
            }, (err) => next(err))
            .catch((err) => next(err));
    }).delete(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        Leader.findByIdAndRemove(req.params.leaderId)
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    })

module.exports = leaderRouter;
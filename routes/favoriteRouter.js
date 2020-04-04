const express = require('express');
const bodyParser = require('body-parser');

const authentic = require('../authentic');
const cors = require('./cors');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authentic.verifyUser, (req, res, next) => {
        Favorite.findOne({user: req.user._id})
            .populate(['user', 'dishes'])
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(favorite)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authentic.verifyUser, (req, res, next) => {
        if(!Array.isArray(req.body)|| req.body.length === 0) {
            res.statusCode = 400;
            next(new Error('Request query must be array'));
        }
        let dishes = req.body.map(obj => obj._id);
        Favorite.findOne({user: req.user._id})
            .then((favorite) => {
                if(favorite === null) {
                    favorite = new Favorite({
                        user: req.user._id,
                        dishes
                    });
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                } else {
                    dishes.forEach(id => {
                        if(favorite.dishes.indexOf(id) === -1) {
                            favorite.dishes.push(id)
                        }
                    })
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authentic.verifyUser, (req, res, next) => {
        Favorite.findOneAndRemove({user:req.user._id})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })


favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .post(cors.corsWithOptions, authentic.verifyUser, (req, res, next) => {
        Favorite.findOne({user: req.user._id})
            .then((favorite) => {
                if(favorite === null) {
                    favorite = new Favorite({
                        user: req.user._id,
                        dishes: [req.params.dishId]
                    });
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                } else {
                    if(favorite.dishes.indexOf(req.params.dishId) !== -1) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    } else {
                        favorite.dishes.push(req.params.dishId);
                        favorite.save()
                            .then((favorite) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                            .catch((err) => next(err));
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authentic.verifyUser, (req, res, next) => {
        Favorite.findOne({user: req.user._id})
            .then((favorite) => {
                if(favorite === null) {
                    err = new Error('Favorite dishes not fount for user' + req.user._id);
                    res.statusCode = 404;
                    return next(err);
                } else {
                    favorite.dishes.pull(req.params.dishId)
                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })

    
module.exports = favoriteRouter;
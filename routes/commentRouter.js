const express = require('express');
const bodyParser = require('body-parser');
const authentic = require('../authentic');
const cors = require('./cors');
const Comment = require('../models/comment');

const commentRouter = express.Router();
commentRouter.use(bodyParser.json());

commentRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Comment.find(req.query)
        .populate('author')
        .then((comments) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comments);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authentic.verifyUser, (req, res, next) => {
    if(req.body === null) {
        const err = new Error('Comment not found in request body');
        res.statusCode = 404;
        return next(err)
    }
    res.body.author = req.user._id;
    Comment.create(req.body)
        .then((comment) => {
            Comment.findById(comment._id)
                .populate('author')
                .then((comment) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comment);
                })
        }, (err) => next(err))
        .catch(err => next(err));
})
.put(cors.corsWithOptions, authentic.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.send('Put operation not supported on /comments');
})
.delete(cors.corsWithOptions, authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
    Comment.remove({})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
})

commentRouter.route('/:commentId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Comment.findById(req.params.commentId)
        .populate('author')
        .then((comment) => {
            if(comment === null)  {
                err = new Error('Comment ' + req.params.dishId + ' not found');
                res.statusCode = 404;
                return next(err);
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(comment);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authentic.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.send('POST operation not supported on /comments');
})
.put(cors.corsWithOptions, authentic.verifyUser, (req, res, next) => {
    Comment.findById(req.params.commentId)
        .then((comment) => {
            if(comment === null) {
                err = new Error('Comment ' + req.params.dishId + ' not found');
                res.statusCode = 404;
                return next(err);
            }
            if(!comment.author.equals(req.user._id)) {
                err = new Error('You cannot update not yours comment');
                res.statusCode = 401;
                return next(err);
            }
            req.body.author = req.user._id;
            Comment.findByIdAndUpdate(req.params.commentId,{$set: req.body}, {new: true})
                .then((comment) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comment);
                })
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authentic.verifyUser, (req, res, next) => {
    Comment.findById(req.params.commentId)
    .then((comment) => {
        if(comment === null) {
            err = new Error('Comment ' + req.params.dishId + ' not found');
            res.statusCode = 404;
            return next(err);
        }
        if(!comment.author.equals(req.user._id)) {
            err = new Error('You cannot update not yours comment');
            res.statusCode = 401;
            return next(err);
        }
        comment.remove()
            .then((comment) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(comment);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
})

module.exports = commentRouter;
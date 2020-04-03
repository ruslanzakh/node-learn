var express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport')
const User = require('../models/user');
const authentic = require('../authentic');

var router = express.Router();
router.use(bodyParser.json());


router.route('/')
    .get(authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
        User.find({})
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            }, (err) => next(err))
            .catch((err) => next(err));
	})

router.post('/signup', (req, res, next) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
			if(err) {
				res.statusCode = 500;
				res.setHeader('Content-Type', 'application/json');
				res.json({err})
			} else {
				if(req.body.firstname) {
					user.firstname = req.body.firstname;
				}
				if(req.body.lastname) {
					user.lastname = req.body.lastname;
				}
				user.save((err , user) => {
					if(err) {
						res.statusCode = 500;
						res.setHeader('Content-Type', 'application/json');
						res.json({err})
					} else {
						passport.authenticate('local')(req, res, () => {
							res.statusCode = 200;
							res.setHeader('Content-Type', 'application/json');
							res.json({success: true, status: 'Registration Successful!'});
						});
					}
				})
			}
		})
});

router.post('/login', passport.authenticate('local'), (req, res) => {

	const token = authentic.getToken({_id: req.user._id});

	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({status: 'Authenticate Succesfull!', success: true, token});
});

router.get('/logout', (req, res, next) => {
	if(req.session) {
		req.session.destroy();
		res.clearCookie('session-id');
		res.redirect('/');
	} else {
		const err = new Error('You are not loggin');
		res.statusCode = 403;
		next(err);
	}
})

module.exports = router;

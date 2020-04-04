const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const FacebookTokenStrategy = require('passport-facebook-token');

const config = require('./config');

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => jwt.sign(user, config.secretKey, { expiresIn: 3600});

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.secretKey,
}

exports.jwtPassport = passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
	console.log("JWT payload: ", jwt_payload);
	User.findOne({_id: jwt_payload._id}, (err, user) => {
		if(err) {
			return done(new Error(err, false));
		} else if(user) {
			return done(null, user)
		} else {
			return done(null, false);
		}
	})
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
	if(!req.user || req.user.admin === false) {
		res.statusCode = 403;
		const err = new Error('You are not authorized to perform ' + req.method + ' operation!');
		next(err);
	} else next();
}

exports.facebookPassport = passport.use(new FacebookTokenStrategy({
	clientID: config.facebook.clientId,
	clientSecret: config.facebook.clientSecret
}, (accessToken, refreshToken, profile, done) => {
	User.findOne({facebookId: profile.id}, (err, user) => {
		if(err) {
			return done(err, false);
		} else if(user !== null) {
			return done(null, user);
		} else {
			user = new User({
				username: profile.displayName,
				facebookId: profile.id,
				firstname: profile.name.givenName,
				lastname: profile.name.familyName,
			});
			user.save((err, user) => {
				if(err) return done(err, false);
				return done(null, user);
			})
		}
	})
}))
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

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
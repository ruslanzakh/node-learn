const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const authentic = require('../authentic');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}
})

const imageFileFilter = (req, file, cb) => {
	if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return cb(new Error('You can upload only image file'), false)
	} else {
		return cb(null, true);
	}
}

const upload = multer({storage, fileFilter: imageFileFilter})

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
	.get(authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.send('Get operation not allowed');
	})
	.post(authentic.verifyUser, authentic.verifyAdmin, upload.single('imageFile'), (req, res) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(req.file)
	})
	.put(authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.send('Put operation not allowed');
	})
	.delete(authentic.verifyUser, authentic.verifyAdmin, (req, res, next) => {
		res.statusCode = 403;
		res.send('Delete operation  not allowed');
	})



module.exports = uploadRouter;
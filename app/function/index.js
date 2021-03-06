let validator = require("validator");
let createError = require('http-errors');
let shortid = require('shortid');

let { invalidRes } = require('../config');
let i, flag;

flag = true;

//checking same origin of request and https protocol
const checkURLDetailsPage = (req, res, next)=>{
	invalidRes.data = "Invalid host OR Insecure protcols";
	console.log(req.protocol, req.hostname);
	if (process.env.NODE_ENV === 'PRODUCTION'){
		((req.protocol === "https") && (req.hostname === "www.mrnotes.me" || req.host === "mrnote.herokuapp.com")) ? next():next(createError(505));
	}else
		next();
};

//checking same origin of request and https protocol
const checkURLDetailsJSON = (req, res, next)=>{
	invalidRes.data = "Invalid host OR Insecure protcols";
	console.log(req.protocol, req.hostname);
	if (process.env.NODE_ENV === 'PRODUCTION'){
		((req.protocol === "https") && (req.hostname === "www.mrnotes.me" || req.host === "mrnote.herokuapp.com")) ? next():res.status(505).json(invalidRes);
	}else
		next();
};

//data validation of login or signup page 
const bodyDataValidCred = (req, res, next)=>{
	for (i in req.body){
		if (req.body[`${i}`] == ('' || null) || (i == "email" && !validator.isEmail(req.body[`${i}`]))) {
			res.status(302).redirect(`${req.path}/?q=Invalid User Details`);
			flag = false;
			break;
		} 
	}
	if(flag){
		flag = true;
		next();
	}
}; 

//data validation 
const bodyDataValidJSON = (req, res, next)=>{
	//console.log(req.path);
	invalidRes.data = "Invalid Data";
	for (i in req.body){
		if (req.body[`${i}`] == ('' || null) || (i == "email" && !validator.isEmail(req.body[`${i}`]))){
			res.json(invalidRes);
			flag = false;
			break;
		}
	} 
	if(flag){
		flag = true;
		next();
	}
}; 

//uid validation generated by shortid
const validId = (req, res, next) => {
	flag = true;
	//console.log(req.params);
	for(i in req.params){
		//console.log(shortid.isValid(req.params[`${i}`]), req.params[`${i}`]);
		flag = (shortid.isValid(req.params[`${i}`])) ? true: false;
	}
	//console.log(flag);
	flag ? next():res.json(invalidRes);
};


module.exports = { bodyDataValidCred, bodyDataValidJSON, validId, checkURLDetailsPage,
	 checkURLDetailsJSON };
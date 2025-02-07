const express=require('express');

const passport=require('passport');

const routes=express.Router();

const userCtl=require('../controller/userController');

const Comment=require('../models/CommentModel');

routes.get('/',userCtl.home);

// register

routes.get('/userRegister',userCtl.userRegister);

routes.post('/userregisterdata',userCtl.userregisterdata);

routes.get('/userLogin',userCtl.userLogin);

routes.post('/userlogindata',passport.authenticate('userAuth',{failureRedirect:'/userLogin',failureMessage:"invelid email"}),userCtl.userlogindata);

routes.get('/userlogout',userCtl.userlogout);

// likes

routes.get('/setuserlike/:commentId',userCtl.setuserlike);

routes.get('/setuserdislike/:commentId',userCtl.setuserdislike);

// readMore

routes.get('/readMore/:id',userCtl.readMore);

routes.get('/sortings',userCtl.sortings);

routes.post('/insertComment', Comment.uploadImageFile, userCtl.insertComment);

routes.get('/commentView',userCtl.commentView);

routes.get('/changeStatusTrue',userCtl.changeStatusTrue);

routes.get('/changeStatusFalse',userCtl.changeStatusFalse);

module.exports=routes;
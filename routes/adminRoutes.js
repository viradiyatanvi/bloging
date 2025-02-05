const express=require('express');

const Admin=require('../models/adminModel');

const passport=require('passport');

const {check}=require('express-validator');

const routes=express.Router();

const adminCtl=require('../controller/adminController');

routes.get('/signin',[
    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage("invelid email").custom(async(value)=>{
        let checkEmail=await Admin.find({email:value}).countDocuments();
        if(checkEmail>0){
            throw new Error("admin email allredy exits")
        }
    }),

    check('password','...')
    .notEmpty()
    .withMessage('password is required')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
    .withMessage('1 lowercase 1 upercase and 8 char'),
],adminCtl.signin);

routes.post('/checksignin',passport.authenticate('local',{failureRedirect:'/signin'}),adminCtl.checksignin);

routes.get('/logout',adminCtl.logout);

routes.get('/myprofile',passport.checkAuthUser,adminCtl.myprofile);

routes.get('/changepassword',passport.checkAuthUser,adminCtl.changepassword);

routes.post('/changenewpassword',adminCtl.changenewpassword);

routes.get('/checkemail',adminCtl.checkemail);

routes.post('/verifyemail',adminCtl.verifyemail);

routes.get('/checkotp',adminCtl.checkotp);

routes.post('/verifyotp',adminCtl.verifyotp);

routes.get('/forgotpass',adminCtl.forgotpass);

routes.post('/verifypass',adminCtl.verifypass);

routes.get('/dashboard',passport.checkAuthUser,adminCtl.dashboard);

routes.get('/addadmin',passport.checkAuthUser,adminCtl.addadmin);

routes.get('/viewadmin',passport.checkAuthUser,adminCtl.viewadmin);

routes.post('/insertadmin',Admin.uploadImageFile,[
    check('fname')
    .notEmpty()
    .withMessage('First Name Is Required')
    .isLength({min:2})
    .withMessage("min 2 charecter is required"),

    check('lname')
    .notEmpty()
    .withMessage('Lirst Name Is Required')
    .isLength({min:2})
    .withMessage("min 2 charecter is required"),

    check('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage("invelid email").custom(async(value)=>{
        let checkEmail=await Admin.find({email:value}).countDocuments();
        if(checkEmail>0){
            throw new Error("admin email allredy exits")
        }
    }),

    check('password','...')
    .notEmpty()
    .withMessage('password is required')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
    .withMessage('1 lowercase 1 upercase and 8 char'),

    check('hobby')
    .notEmpty()
    .withMessage('Hobby Name Is Required'),

    check('state')
    .notEmpty()
    .withMessage('State Name Is Required'),

    check('gender')
    .notEmpty()
    .withMessage('Gender Name Is Required'),

],adminCtl.insertadmin);

routes.get('/viewadmin',passport.checkAuthUser,adminCtl.viewadmin);

routes.get('/deletedata',adminCtl.deletedata);

routes.get('/updatedata/:id', adminCtl.updatedata);

routes.post('/editdata',Admin.uploadImageFile,adminCtl.editdata);

routes.post('/deleteMultipleDelete',adminCtl.deleteMultipleDelete);

routes.get('/sorting',adminCtl.sorting);

routes.use('/',require('../routes/userRoutes'));

module.exports=routes;
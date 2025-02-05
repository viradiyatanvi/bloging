const express=require('express');

const Blog=require("../models/blogModels");

const {check}=require('express-validator');

const routes=express.Router();

const blogController=require('../controller/blogController');

routes.get('/',blogController.addblog);

routes.post('/insertblog',Blog.uploadImageFile,[

    check("categoryId").notEmpty().withMessage("category name is not define..."),

    check('title')
    .notEmpty()
    .withMessage('Title Is Required')
    .isLength({min:2})
    .withMessage("min 2 charecter is required"),

    check('discription')
    .notEmpty()
    .withMessage('discription Is Required')
    .isLength({min:2})
    .withMessage("min 2 charecter is required"),

],blogController.insertblog);

routes.get('/view_blog',blogController.view_blog);

routes.get('/deletedata/:id',blogController.deletedata);

routes.get('/updatedata',blogController.updatedata);

routes.post('/editblog',Blog.uploadImageFile,blogController.editblog);

routes.post('/deleteMultipleDelete',blogController.deleteMultipleDelete);

routes.get('/changeStatusTrue',blogController.changeStatusTrue);

routes.get('/changeStatusFalse',blogController.changeStatusFalse);

routes.get('/sorting',blogController.sorting);

module.exports=routes;
const express=require('express');

const routes=express.Router();

const {check}=require('express-validator');

const categortctl=require('../controller/categoryController');

routes.get('/',categortctl.addcategory);

routes.post('/insertcategory',[
    check('categoryname')
    .notEmpty()
    .withMessage('Name Is Required')
    .isLength({min:2})
    .withMessage("min 2 charecter is required")
   ],categortctl.insertcategory);

routes.get('/view_category',categortctl.view_category);

routes.post('/deleteMultipleDelete',categortctl.deleteMultipleDelete);

routes.get('/changeStatusTrue',categortctl.changeStatusTrue);

routes.get('/changeStatusFalse',categortctl.changeStatusFalse);

routes.get('/sorting',categortctl.sorting);

module.exports=routes;
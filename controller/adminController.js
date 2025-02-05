const Admin=require('../models/adminModel');

const Category=require("../models/categoryModel");

const Blog=require("../models/blogModels");

const Comment=require('../models/CommentModel');

const {validationResult}=require('express-validator');

const path=require('path');

const fs=require('fs');

const nodemailer = require("nodemailer");

module.exports.dashboard = async (req, res) => {
    try {
        const categorytotal = await Category.find();
        const blogtotal = await Blog.find().populate('categoryId').exec();
        const commenttotal = await Comment.find().populate('PostId').exec();

        const total = blogtotal.length;
        const categoryT = categorytotal.length;
        const Commenttotal=commenttotal.length;

        const lableN = categorytotal.map(v => v.categoryname);
        const lableB = categorytotal.map(v =>
            blogtotal.filter(b => b.categoryId?.equals(v._id)).length
        );
        
        const lableB3 = categorytotal.map(v =>
            commenttotal.filter(b => b.PostId?.categoryId?.equals(v._id)).length
        );

        return res.render('dashboard', {
            total,
            categoryT,
            lableN,
            lableB,
            lableB3,
            Commenttotal
        });
    } catch (err) {
        console.error("Error details:", err);
        return res.status(500).send('An error occurred while fetching data.');
    }
};



module.exports.addadmin=(req,res)=>{
    try{  
        return res.render('addadmin',{
            errorsData:[],
            old:[],
        });  
    }
    catch(err){
        console.log(err);
    }
}

module.exports.viewadmin=async(req,res)=>{
    try{

        var search='';
        if(req.query.search){
            search=req.query.search;
        }

        let per_page=2;
        let page=0;

        if(req.query.page){
            page=req.query.page;
        }  

      
        let viewadmin=await Admin.find({
            $or:[
                {name:{$regex:search}},
            ]
        }).skip(page*per_page).limit(per_page);

        let totalpage=await Admin.find({
            $or:[
                {name:{$regex:search}},
            ]
        }).countDocuments();

        totalCount=Math.ceil(totalpage/per_page);


        return res.render('viewadmin',{
            viewadmin,
            search,
            page,
            totalCount,
        });
      
    }
    catch(err){
        console.log(err);
    }
}

module.exports.deletedata = async (req, res) => {
    try {
        let id = req.query.id;
        let singledata = await Admin.findById(id);

        if (singledata && singledata.image) {
            const deletePath = path.join(__dirname, '..', singledata.image);

            try {
                fs.unlinkSync(deletePath); 
            } catch (err) {
                req.flash('success',"something is wrong");
                return res.redirect('back'); 
            }
        }

        await Admin.findByIdAndDelete(id); 
        return res.redirect('back');       
    } catch (error) {
        console.error("Error deleting data:", error);
        return res.redirect("back"); 
    }
};


module.exports.insertadmin=async(req,res)=>{
    try{

        const errors=validationResult(req);
        console.log(errors.mapped());
        if(!errors.isEmpty()){
            return res.render('addadmin',{
                errorsData:errors.mapped(),
                old:req.body
            })
        }


        console.log(req.body);
        console.log(req.file);
        let imagePath='';
        if(req.file){
            imagePath=await Admin.imgPath+'/'+req.file.filename;
        }
        req.body.image=imagePath;
        req.body.name=req.body.fname+' '+req.body.lname;
        const admins=await Admin.create(req.body);
        if(admins){
            // console.log("data added successfully");
            req.flash('success',"data insert successfully");
            return res.redirect('/addadmin');
        }
        else{
            // console.log("data is not added");
            req.flash('success',"data not insert")
            return res.redirect('back');
        }
        return res.redirect('back');
    }
    catch(err){
        console.log("something is wrong");
        return res.redirect("back");
    }
}

module.exports.updatedata = async (req, res) => {
    try{
            let singleObj = await Admin.findById(req.params.id);
            return res.render('updatedata',{
                singleObj
            });
        }
    catch(err){
        console.log("something is wrong");
        return res.redirect("back");
    }
};

module.exports.editdata=async(req,res)=>{
    if(req.file){
        let singledata=await Admin.findById(req.body.empid);
        try{
            let oldpath=path.join(__dirname,'..',singledata.image);
            fs.unlinkSync(oldpath);
        }
        catch(err){
            console.log("image is not found");
            return res.redirect('back');
        }

        newimagepath=await Admin.imgPath+'/'+req.file.filename;
        req.body.image=newimagepath;
        req.body.name = req.body.fname + ' ' + req.body.lname;
        await Admin.findByIdAndUpdate(req.body.empid,req.body);
        return res.redirect('/viewadmin');
    }
    else{
        let singledata=await Admin.findById(req.body.empid);
        req.body.name = req.body.fname + ' ' + req.body.lname;
        req.body.image=singledata.image;
        await Admin.findByIdAndUpdate(req.body.empid,req.body);
        return res.redirect('/viewadmin');
    }
}

module.exports.signin=async(req,res)=>{
    try{
        const errors=validationResult(req);
        console.log(errors.mapped());
        if(!errors.isEmpty()){
            return res.render('signin',{
                errorsData:errors.mapped(),
                old:req.body
            })
        }
            return res.render('signin');
      
       
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.checksignin=async(req,res)=>{
    try{
        req.flash('success',"seccussefully signin");
        return res.redirect("/dashboard");
    }
    catch(err){
        // console.log(err);
        req.flash('success',"not signin")
        return res.redirect('back');
    }
}

module.exports.logout=async(req,res)=>{
    try{
        req.session.destroy(function(err){
            if(err){
                return false
            }
            else{
                // req.flash('success',"logout successfully");
                return res.redirect('/');
            }
        })     
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.myprofile=async(req,res)=>{
    try{
        return res.render('myprofile');
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.changepassword=async(req,res)=>{
    try{
        return res.render('changepassword');
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.changenewpassword=async(req,res)=>{
    try{
        console.log(req.body);
        // let oldpassword=req.cookies.admindata;
        let oldpassword=req.user;
        if(oldpassword.password==req.body.currentpassword){
            if(req.body.currentpassword!=req.body.newpassword){
                if(req.body.newpassword==req.body.confirmpassword){
                    await Admin.findByIdAndUpdate(oldpassword._id,{
                        password:req.body.newpassword
                    });
                    req.flash('success',"successfully change password")
                    return res.redirect('/logout');
                }
                else{
                    // console.log("newpassword and confirm password  is not match");
                    req.flash('success',"newpassword and confirm password  is not match")
                    return res.redirect('back');
                }
            }
            else{
                req.flash('success',"current password and newpassword are match!! try another")
                // console.log("current password and newpassword are match!! try another");
                return res.redirect('back');
            }
        }else{
            req.flash('success',"currentpassword and newpassword is not match")
            // console.log("currentpassword and newpassword is not match");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.checkemail=async(req,res)=>{
    try{
        return res.render('checkemail');
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.verifyemail = async (req, res) => {
    try {
        console.log(req.body);
        let singleObj = await Admin.find({ email: req.body.email }).countDocuments();

        if (singleObj === 1) {
            let singleAdminData = await Admin.findOne({ email: req.body.email });

            let OTP = Math.floor(Math.random() * 100000);
            console.log(OTP);
            res.cookie('otp', OTP);
            res.cookie('email', singleAdminData.email);

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: "viradiyatanvi028@gmail.com",
                    pass: "ftvgfnqyivfdmyyv",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const info = await transporter.sendMail({
                from: "viradiyatanvi028@gmail.com",
                to: "viradiyatanvi028@gmail.com",
                subject: "OTP",
                html: `<b>otp here ${OTP}</b>`,
            });

            console.log("Message sent: %s", info.messageId);
        } else {
            // console.log("invalid email");
            req.flash('success',"invelid email");
            return res.redirect('back');
        }
        return res.redirect('/checkotp');
    } catch (err) {
        console.log(err); 
        return res.redirect('back');
    }
};

module.exports.checkotp=async(req,res)=>{
    try{
        return res.render('checkotp');
    }
    catch{
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.verifyotp=async(req,res)=>{
    try{
        console.log(req.body);
        console.log(req.cookies.otp);
        if(req.body.otp==req.cookies.otp){
            res.clearCookie('otp');
            req.flash('success',"varify otp");
            return res.redirect('/forgotpass');
        }
        else{
            // console.log("invelid otp");
            req.flash('success',"invelid otp");
            return res.redirect('back');
        }
    }
    catch{
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.forgotpass=async(req,res)=>{
    try{
        return res.render('forgotpass');
    }
    catch{
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.verifypass=async(req,res)=>{
    try{
        console.log(req.body);
        console.log(req.cookies.otp);
        if(req.body.newpassword==req.body.confirmpassword){
            let checklastpassword=await Admin.find({email:req.cookies.email}).countDocuments();
            if(checklastpassword==1){
                let adminnewdata=await Admin.findOne({email:req.cookies.email});
                let updatepass=await Admin.findByIdAndUpdate(adminnewdata.id,{
                    password:req.body.newpassword
                })
                if(updatepass){
                    res.clearCookie('email');
                    req.flash('success',"varifypassword successfully");
                    return res.redirect('/');
                }
                else{
                    req.flash('success',"logout successfully");
                    console.log("something is wrong")
                }
            }
            else{
                // console.log("invelid email");
                req.flash('success',"inveld email");
                return res.redirect('back');
            }
        }
        else{
            // console.log("NewPassword and ConfirmPassword are not match");
            req.flash('success',"new password and conform password are not match");
            return res.redirect('back');
        }
    }
    catch{
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.deleteMultipleDelete=async(req,res)=>{
    try{
        let deleteAll=await Admin.deleteMany({_id:{$in:req.body.Ids}});
        if(deleteAll){
            req.flash('success',"multiple delete successfully");
            return res.redirect('back');
        }
        else{
            // console.log(err);
            req.flash('success',"not a multiple delete successfully");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log("data is not found");
        return res.redirect('back');
    }
}

module.exports.sorting=async(req,res)=>{
    try{
        if(req.query.sorting=='Asc'){
            var search='';
        if(req.query.search){
            search=req.query.search;
        }

        let per_page=2;
        let page=0;

        if(req.query.page){
            page=req.query.page;
        }  

      
        let viewadmin=await Admin.find({
            $or:[
                {name:{$regex:search}},
            ]
        }).skip(page*per_page).limit(per_page).sort({name:1});

        let totalpage=await Admin.find({
            $or:[
                {name:{$regex:search}},
            ]
        }).countDocuments();

        totalCount=Math.ceil(totalpage/per_page);


        return res.render('viewadmin',{
            viewadmin,
            search,
            page,
            totalCount,
        });
        }

        else{
            var search='';
        if(req.query.search){
            search=req.query.search;
        }

        let per_page=2;
        let page=0;

        if(req.query.page){
            page=req.query.page;
        }  

      
        let viewadmin=await Admin.find({
            $or:[
                {name:{$regex:search}},
            ]
        }).skip(page*per_page).limit(per_page).sort({name:-1});

        let totalpage=await Admin.find({
            $or:[
                {name:{$regex:search}},
            ]
        }).countDocuments();

        totalCount=Math.ceil(totalpage/per_page);


        return res.render('viewadmin',{
            viewadmin,
            search,
            page,
            totalCount,
        });
        }
    }
    catch(err){
        console.log("data is not found");
        return res.redirect('back');
    }
}
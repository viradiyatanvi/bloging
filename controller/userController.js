const Category = require('../models/categoryModel');
const Blog = require('../models/blogModels');
const Comment=require('../models/CommentModel');
const User=require('../models/UserModel');

module.exports.home = async (req, res) => {
    try {
        var search = '';
        if (req.query.search) {
            search = req.query.search;
        }

        let per_page = 5;
        let page = 0;

        if (req.query.page) {
            page = req.query.page;
        }

        let blogall;
        let findBlogId=await Blog.find({
            blogstatus: true,}).countDocuments();

        let sorting='';
        if(req.query.sorting){
            sorting=req.query.sorting
        }

        let catId='';
        if(req.query.catId){
            sorting=req.query.sorting
        }

        if (req.query.catId) {
            if(req.query.sorting=='Asc'){
                blogall = await Blog.find({
                    blogstatus: true, categoryId: req.query.catId,
                    $or: [
                        { title: { $regex: search } },
                    ]
                }).skip(page * per_page).limit(per_page).sort({_id:1});
            }
            else{
                blogall = await Blog.find({
                    blogstatus: true, categoryId: req.query.catId,
                    $or: [
                        { title: { $regex: search } },
                    ]
                }).skip(page * per_page).limit(per_page).sort({_id:-1});
            }
        }

        else {
            
            if(req.query.sorting=='Asc'){
                blogall = await Blog.find({
                    blogstatus: true,
                    $or: [
                        { title: { $regex: search } },
                    ]
                }).skip(page * per_page).limit(per_page).sort({_id:1});
            }
            else{
                blogall = await Blog.find({
                    blogstatus: true, 
                    $or: [
                        { title: { $regex: search } },
                    ]
                }).skip(page * per_page).limit(per_page).sort({_id:-1});
            }
        }

        let totalpage = await Blog.find({
            blogstatus: true,
            $or: [
                { title: { $regex: search } },
            ]
        }).countDocuments();

        totalCount = Math.ceil(totalpage / per_page);

        let categoryAll = await Category.find({ categorystatus: true })
        return res.render('userPanel/home', {
            categoryAll,
            blogall,
            search,
            page,
            totalCount,
            findBlogId,
            sorting,
            catId,
        })
    }
    catch (err) {
        console.log('something is wrong');
        return res.redirect('back');
    }
}

module.exports.readMore = async (req, res) => {
    try {
        let PostId=req.params.id;

        let viewCommentpage=await Comment.find({blogstatus:true,PostId:req.params.id});

        id = req.params.id;
        let blogall = await Blog.find({
            blogstatus: true,
        }).sort({ _id: -1 }).limit(5);

        let UserDetails = await Blog.findById(req.params.id);
        return res.render('userPanel/readMore', {
            UserDetails,
            blogall,
            PostId,
            viewCommentpage
        })
    }
    catch (err) {
        console.log('something is wrong');
        return res.redirect('back');
    }
}

module.exports.sortings = async (req, res) => {
    try {

        if (req.query.sortings == 'Asc') {
            var search = '';
            if (req.query.search) {
                search = req.query.search;
            }

            let per_page = 3;
            let page = 0;

            if (req.query.page) {
                page = req.query.page;
            }

            id = req.params.id;
            let blogall = await Blog.find({
                blogstatus: true,
                $or: [
                    { title: { $regex: search } },
                ]
            }).skip(page * per_page).sort({ _id: 1 }).limit(5);

            let totalpage = await Blog.find({
                blogstatus: true,
                $or: [
                    { title: { $regex: search } },
                ]
            }).countDocuments();

            totalCount = Math.ceil(totalpage / per_page);

            let UserDetails = null;
            if (blogall.length > 0) {
                let firstBlogId = blogall[0]._id;
                UserDetails = await Blog.findById(firstBlogId);
            }
            // let UserDetails=await Blog.findById(id);
            return res.render('userPanel/readMore', {
                UserDetails,
                blogall,
                search,
                page,
                totalCount,
            })
        }
        else {
            var search = '';
            if (req.query.search) {
                search = req.query.search;
            }

            let per_page = 3;
            let page = 0;

            if (req.query.page) {
                page = req.query.page;
            }

            id = req.params.id;
            let blogall = await Blog.find({
                blogstatus: true,
                $or: [
                    { title: { $regex: search } },
                ]
            }).skip(page * per_page).sort({ _id: -1 }).limit(5);

            let totalpage = await Blog.find({
                blogstatus: true,
                $or: [
                    { title: { $regex: search } },
                ]
            }).countDocuments();

            totalCount = Math.ceil(totalpage / per_page);

            let UserDetails = null;
            if (blogall.length > 0) {
                let firstBlogId = blogall[0]._id;
                UserDetails = await Blog.findById(firstBlogId);
            }

            // let UserDetails=await Blog.findById(id);
            return res.render('userPanel/readMore', {
                UserDetails,
                blogall,
                search,
                page,
                totalCount,
            })
        }
    }
    catch (err) {
        console.log('something is wrong');
        return res.redirect('back');
    }
}

module.exports.insertComment=async(req,res)=>{
    try{
        // console.log(req.body);
        // console.log(req.file);

        let commentImage='';
        if(req.file){
            commentImage=await Comment.imgPath+'/'+req.file.filename;
        }
        req.body.image=commentImage;

        let commentAdd = await Comment.create(req.body);

        if (commentAdd) {
            let findComment = await Blog.findById(req.body.PostId);
            if (findComment) {
                findComment.commentId.push(commentAdd._id);
                await Blog.findByIdAndUpdate(req.body.PostId, findComment);
            } else {
                console.error('Comment not found');
            }
        }
        return res.redirect('back');
    }
    catch(err){
        console.log('something is wrong');
        return res.redirect('back');
    }
}

module.exports.commentView=async(req,res)=>{
    try{
        let viewComment=await Comment.find();
        return res.render('userPanel/commentView',{
            viewComment
        })
    }
    catch(err){
        console.log('something is wrong');
        return res.redirect('back');
    }
}

module.exports.changeStatusTrue=async(req,res)=>{
    try{
        // console.log(req.query);
        let commentUpdate=await Comment.findByIdAndUpdate(req.query.camId,{'blogstatus':false});
        if(commentUpdate){
            return res.redirect('back');
        }
        else{
            console.log("data is not update");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.changeStatusFalse=async(req,res)=>{
    try{
        // console.log(req.query);
        let commentUpdate=await Comment.findByIdAndUpdate(req.query.camId,{'blogstatus':true});
        if(commentUpdate){
            req.flash('success',"status change successfully");
            return res.redirect('back');
        }
        else{
            req.flash('success',"status not change successfully");
            console.log("data is not update");
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.userRegister=async(req,res)=>{
    try{
        return res.render('userpanel/userRegister')
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.userregisterdata = async (req, res) => {
    try {
        if (req.body.password !== req.body.confirmpassword) {
            console.log("Passwords do not match");
            return res.redirect('back');
        }

        let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        await newUser.save();
        console.log("User registered successfully");
        return res.redirect('/userLogin');

    } catch (err) {
        console.error("🔥 Error in user registration:", err);
        return res.status(500).send("Internal Server Error: " + err.message);
    }
};


module.exports.userLogin=async(req,res)=>{
    try{
        return res.render('userpanel/userLogin')
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.userlogindata=async(req,res)=>{
    try{
        return res.redirect('/');
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
module.exports.userlogout=async(req,res)=>{
    try{
        req.session.destroy(function(err){
            if(err){
                return false
            }
            else{
            return res.redirect("/");
            }
        })
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.setuserlike=async(req,res)=>{
    try{
        console.log(req.params.commentId);
        let singlelikedata=await Comment.findById(req.params.commentId);

        if(singlelikedata){
            // console.log(req.user._id);

            let userLikesExistData=singlelikedata.likes.includes(req.user._id);

            if(userLikesExistData){
                let userLikesRemove= await singlelikedata.likes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                })
                singlelikedata.likes=userLikesRemove;
            }
            else{
                singlelikedata.likes.push(req.user._id);
            }
            await Comment.findByIdAndUpdate(req.params.commentId,singlelikedata);

            let userlikesexistdata=singlelikedata.dislikes.includes(req.user._id);
            if(userlikesexistdata){
                let userLikesRemove= await singlelikedata.dislikes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                })
                singlelikedata.dislikes=userLikesRemove;
                await Comment.findByIdAndUpdate(req.params.commentId,singlelikedata);
            }

            return res.redirect('back');
        }

    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.setuserdislike=async(req,res)=>{
    try{
        console.log(req.params.commentId);
        let singlelikedata=await Comment.findById(req.params.commentId);

        if(singlelikedata){
            let userLikesExistData=singlelikedata.dislikes.includes(req.user._id);

            if(userLikesExistData){
                let userLikesRemove= await singlelikedata.dislikes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                })
                singlelikedata.dislikes=userLikesRemove;
            }
            else{
                singlelikedata.dislikes.push(req.user._id);
            }
            await Comment.findByIdAndUpdate(req.params.commentId,singlelikedata);

            let LikesExistData=singlelikedata.likes.includes(req.user._id);
            if(LikesExistData){
                let userLikesRemove= await singlelikedata.likes.filter((v,i)=>{
                    if(!v.equals(req.user._id)){
                        return v;
                    }
                })
                singlelikedata.likes=userLikesRemove;
                await Comment.findByIdAndUpdate(req.params.commentId,singlelikedata);
            }
            return res.redirect('back');
        }

    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
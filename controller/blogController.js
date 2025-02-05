
const Blog = require("../models/blogModels");

const Category = require('../models/categoryModel');

const { validationResult } = require('express-validator');

const path = require("path");

const fs = require('fs');

module.exports.addblog = async (req, res) => {
    try {
        let categorydata = await Category.find();
        return res.render('blog/addblog', {
            categorydata,
            errorsData: [],
            old: [],
        });
    }
    catch (err) {
        console.log(err);
        return res.redirect("back");
    }
}

module.exports.insertblog = async (req, res) => {

    const errors = validationResult(req);
    console.log(errors.mapped());
    let categorydata = await Category.find();
    if (!errors.isEmpty()) {
        return res.render('blog/addblog', {
            categorydata,
            errorsData: errors.mapped(),
            old: req.body,
        })
    }

    else {
        let imagePath = '';
        if (req.file) {
            imagePath = await Blog.imgPath + '/' + req.file.filename;
        }
        req.body.image = imagePath;
        let blogdata = await Blog.create(req.body);
        if (blogdata) {

            let findCategory = await Category.findById(req.body.categoryId);

            findCategory.blogid.push(blogdata._id);
            await Category.findByIdAndUpdate(req.body.categoryId, findCategory);

            // console.log("successfully");
            req.flash('success', "data added successfully")
            return res.redirect("/blog");
        }
        else {
            // console.log("not successfully");
            req.flash('success', "data not added")
            return res.redirect("back");
        }
    }
}

module.exports.view_blog = async (req, res) => {
    var search = '';
    if (req.query.search) {
        search = req.query.search;
    }

    let pre_page = 3;
    let page = 0;

    if (req.query.page) {
        page = req.query.page;
    }

    let blogData = await Blog.find({
        $or: [
            { title: { $regex: search } },
        ]
    }).skip(page * pre_page).limit(pre_page).populate('categoryId').exec();

    let totalpage = await Blog.find({
        $or: [
            { title: { $regex: search } },
        ]
    }).countDocuments();
    totalcount = Math.ceil(totalpage / pre_page);

    return res.render("blog/view_blog", {
        blogData,
        search,
        totalcount,
        page,
    })
}

module.exports.deletedata = async (req, res) => {
    let id = req.params.id;
    let singledata = await Blog.findById(id);

    const deletePath = path.join(__dirname, singledata.image);
    if (deletePath) {
        try {
            fs.unlinkSync(deletePath);
        }
        catch (err) {
            console.log("image is not found");
        }
    }
    await Blog.findByIdAndDelete(id);
    req.flash('success', "data delete successfully")
    return res.redirect("back");
}

module.exports.updatedata = async (req, res) => {
    const categorydata = await Category.find();
    let singleobj = await Blog.findById(req.query.blogid);
    return res.render("blog/updatedata", {
        singleobj,
        categorydata
    })
}



module.exports.editblog = async (req, res) => {
    try {
        if (req.file) {
            let singledata = await Blog.findById(req.body.bid);

            if (!singledata) {
                console.log("blog is not found");
                return res.redirect("back");
            }

            try {
                const oldimagePath = path.join(__dirname, '..', singledata.image);
                fs.unlinkSync(oldimagePath);
            }
            catch (err) {
                console.log("image is not found");
            }

            newImagePath = Blog.imgPath + '/' + req.file.filename;
            req.body.image = newImagePath;
            await Blog.findByIdAndUpdate(req.body.bid, req.body);
            req.flash('success', "data update successfully")
            return res.redirect('/blog/view_blog')
        }
        else {
            let singledata = await Blog.findById(req.body.bid);
            req.body.image = singledata.image;
            await Blog.findByIdAndUpdate(req.body.bid, req.body);
            req.flash('success', "data not update")
            return res.redirect('/blog/view_blog')
        }
    }
    catch (err) {
        console.log("error", err);
        return res.redirect("back");
    }
}

module.exports.deleteMultipleDelete = async (req, res) => {
    try {
        // console.log(req.body.Ids);
        let categoryDelete = await Blog.deleteMany({ _id: { $in: req.body.Ids } });
        if (categoryDelete) {
            req.flash('success', "multiple data delete successfully")
            return res.redirect('back');
        }
        else {
            // console.log("data not found");
            req.flash('success', "multiple data not delete")
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}


module.exports.changeStatusTrue = async (req, res) => {
    try {
        // console.log(req.query);
        let blogUpdate = await Blog.findByIdAndUpdate(req.query.catId, { 'blogstatus': false });
        if (blogUpdate) {
            req.flash('success', "successfulley Truestatus change");
            return res.redirect('back');
        }
        else {
            // console.log("data is not update");
            req.flash('success', "Truestatus not change")
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.changeStatusFalse = async (req, res) => {
    try {
        // console.log(req.query);
        let blogUpdate = await Blog.findByIdAndUpdate(req.query.catId, { 'blogstatus': true });
        if (blogUpdate) {
            req.flash('success', "successfulley FalseStatus change");
            return res.redirect('back');
        }
        else {
            // console.log("data is not update");
            req.flash('success', "successfulley FalseStatus change");
            return res.redirect('back');
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.sorting = async (req, res) => {
    try {
        if (req.query.sorting == 'Asc') {
            var search = '';
            if (req.query.search) {
                search = req.query.search;
            }

            let pre_page = 3;
            let page = 0;

            if (req.query.page) {
                page = req.query.page;
            }

            let blogData = await Blog.find({
                $or: [
                    { title: { $regex: search } },
                ]
            }).skip(page * pre_page).limit(pre_page).sort({ title: 1 }).populate('categoryId').exec();

            let totalpage = await Blog.find({
                $or: [
                    { title: { $regex: search } },
                ]
            }).countDocuments();
            totalcount = Math.ceil(totalpage / pre_page);

            return res.render("blog/view_blog", {
                blogData,
                search,
                totalcount,
                page,
            })
        }

        else {
            var search = '';
            if (req.query.search) {
                search = req.query.search;
            }

            let pre_page = 3;
            let page = 0;

            if (req.query.page) {
                page = req.query.page;
            }

            let blogData = await Blog.find({
                $or: [
                    { title: { $regex: search } },
                ]
            }).skip(page * pre_page).limit(pre_page).sort({ title: -1 }).populate('categoryId').exec();

            let totalpage = await Blog.find({
                $or: [
                    { title: { $regex: search } },
                ]
            }).countDocuments();
            totalcount = Math.ceil(totalpage / pre_page);

            return res.render("blog/view_blog", {
                blogData,
                search,
                totalcount,
                page,
            })
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect('back');
    }
}
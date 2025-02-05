const Category=require("../models/categoryModel");

const {validationResult}=require('express-validator');


module.exports.addcategory=(req,res)=>{
    return res.render('category/addcategory',{
        errorsData:[],
            old:[],
    });
}

module.exports.insertcategory=async(req,res)=>{
    try{

        const errors=validationResult(req);
                console.log(errors.mapped());
                if(!errors.isEmpty()){
                    return res.render('category/addcategory',{
                        errorsData:errors.mapped(),
                        old:req.body
                    })
                }

    let categorydata=await Category.create(req.body);
    if(categorydata){
        // console.log("data added successfully");
        req.flash('success',"data insert successfully")
        return res.redirect('/category');
    }
    else{
        console.log("data is not added");
        return res.redirect("back")
    }
    
    }
    catch(err){
        console.log(err);
        return res.redirect("back")
    }
}

module.exports.view_category=async(req,res)=>{
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

        let viewCategory=await Category.find({
            $or:[
                {categoryname:{$regex:search}},
            ]
        }).skip(page*per_page).limit(per_page);

        

        let totalpage=await Category.find({
            $or:[
                {categoryname:{$regex:search}},
            ]
        }).countDocuments();

        totalCount=Math.ceil(totalpage/per_page);

        return res.render('category/view_category',{
            viewCategory,
            search,
            page,
            totalCount,
        })
    }
    catch(err){
        // console.log(err);
        req.flash('error',"something is wrong")
        return res.redirect('back');
    }
}

module.exports.deleteMultipleDelete=async(req,res)=>{
    try{
        // console.log(req.body.Ids);
        let categoryDelete=await Category.deleteMany({_id:{$in:req.body.Ids}});
        if(categoryDelete){
            req.flash('success',"data deleted successfully")
            return res.redirect('back');
        }
        else{
            // console.log("data not found");
            req.flash('success',"data is not delete")
            return res.redirect('back');
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}

module.exports.changeStatusTrue=async(req,res)=>{
    try{
        // console.log(req.query);
        let categoryUpdate=await Category.findByIdAndUpdate(req.query.catId,{'categorystatus':false});
        if(categoryUpdate){
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
        let categoryUpdate=await Category.findByIdAndUpdate(req.query.catId,{'categorystatus':true});
        if(categoryUpdate){
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

        let viewCategory=await Category.find({
            $or:[
                {categoryname:{$regex:search}},
            ]
        }).skip(page*per_page).limit(per_page).sort({categoryname:1});

        

        let totalpage=await Category.find({
            $or:[
                {categoryname:{$regex:search}},
            ]
        }).countDocuments();

        totalCount=Math.ceil(totalpage/per_page);

        return res.render('category/view_category',{
            viewCategory,
            search,
            page,
            totalCount,
        })
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

        let viewCategory=await Category.find({
            $or:[
                {categoryname:{$regex:search}},
            ]
        }).skip(page*per_page).limit(per_page).sort({categoryname:-1});

        

        let totalpage=await Category.find({
            $or:[
                {categoryname:{$regex:search}},
            ]
        }).countDocuments();

        totalCount=Math.ceil(totalpage/per_page);

        return res.render('category/view_category',{
            viewCategory,
            search,
            page,
            totalCount,
        })
        }
    }
    catch(err){
        console.log(err);
        return res.redirect('back');
    }
}
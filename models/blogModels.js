const mongoose=require('mongoose');

const imagePath='/uploads/admin';

const path=require('path');

const multer=require('multer');

const BlogSchema=mongoose.Schema({
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    discription:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    blogstatus:{
        type:Boolean,
        default:true,
    },
    blogdate:{
        type:String,
        default:true
    },
    commentId:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment",
        }
    ]
});

const Storageblog=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..',imagePath));
    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+'-'+Date.now());
    }
})

BlogSchema.statics.uploadImageFile=multer({storage:Storageblog}).single('image');
BlogSchema.statics.imgPath=imagePath;

const Blog=mongoose.model("Blog",BlogSchema);

module.exports=Blog;
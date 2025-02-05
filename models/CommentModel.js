const mongoose=require('mongoose');

const imagePath='/uploads/comment';

const path=require('path');

const multer=require('multer');
const { type } = require('os');

const CommentSchema=mongoose.Schema({
    PostId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    blogstatus:{
        type:Boolean,
        default:true
    },
    likes:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        }
    ],
    dislikes:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        }
    ],
},{
    timeStamp:true
});

const Storagecomment = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', imagePath));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()); 
    }
});

CommentSchema.statics.uploadImageFile = multer({ storage: Storagecomment }).single('image');  
CommentSchema.statics.imgPath = imagePath;


const Comment=mongoose.model("Comment",CommentSchema);

module.exports=Comment;
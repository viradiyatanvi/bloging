    const mongoose=require('mongoose');

    const path=require('path');

    const multer=require('multer');

    const imagePath='/uploads/admin'

    const AdminSchema=mongoose.Schema({
        name:{
            type:String,
            require:true,
        },
        email:{
            type:String,
            require:true,
        },
        password:{
            type:String,
            require:true,
        },
        gender:{
            type:String,
            require:true,
        },
        hobby:{
            type:Array,
            require:true,
        },
        state:{
            type:String,
            require:true,
        },
        image:{
            type:String,
            require:true,
        }
    },{
        timestamps:true
    })

    const storageimage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,path.join(__dirname,'..',imagePath));
        },
        filename:(req,file,cb)=>{
            cb(null,file.fieldname+'-'+Date.now())
        }
    })

    AdminSchema.statics.uploadImageFile=multer({storage:storageimage}).single('image');
    AdminSchema.statics.imgPath=imagePath;

    const Admin=mongoose.model("Admin",AdminSchema);

    module.exports=Admin;
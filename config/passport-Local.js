const passport=require('passport');

const LocalStrategy=require('passport-local').Strategy;

const Admin=require('../models/adminModel');
const User = require('../models/UserModel');

passport.use( new LocalStrategy({
    usernameField:'email'
    },async function(email,password,done){
    console.log("middleware");
    console.log(email,password);
    let admindata=await Admin.findOne({email:email});

    if(admindata){
        if(admindata.password==password){
            return done(null,admindata);
        }
        else{
            return done(null,false);
        }
    }
    else{
        return done(null,false);
    }
}))

passport.use('userAuth',new LocalStrategy({
    usernameField:'email'
    },async function(email,password,done){
    console.log("middleware");
    console.log(email,password);
    let admindatas=await User.findOne({email:email});

    if(admindatas){
        if(admindatas.password==password){
            return done(null,admindatas);
        }
        else{
            return done(null,false);
        }
    }
    else{
        return done(null,false);
    }
}))

passport.serializeUser(function(user,done){
    return done(null,user.id);
})

passport.deserializeUser(async function(id,done){
    let adminRecord=await Admin.findById(id);
    if(adminRecord){
        return done(null,adminRecord);
    }
    else{
        let userData=await User.findById(id);
        if(userData){
            return done(null,userData);
        }
        else{
            return done(null,false)
        }
    }
})

passport.setAuthUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user
    }
    next();
}

passport.checkAuthUser=function(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        return res.redirect('/signin');
    }
}

module.exports=passport;
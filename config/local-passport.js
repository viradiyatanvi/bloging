const passport=require('passport');
const Admin=require('../models/adminModel');

const LocalStrategy=require('passport-local').Strategy

passport.use('local',new LocalStrategy({
    usernameField:'email'
},async function(email,password,done) {
    console.log("middleware");
    console.log(email,password);
    let adminData=await Admin.findOne({email:email});
    if(adminData){
        return done(null,adminData);
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
        return done(null,false);
    }
})
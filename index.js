const express=require('express');
const path=require('path');

const port=8001;

const app=express();

// const db=require('./config/mongoose');

const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://tanviViradiya28:Tanvi123@cluster0.sk3ly.mongodb.net/adminpanelsetup", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => console.log("DB is connected"))
.catch((err) => console.log(err));

const cookieparser=require('cookie-parser');

const flash=require('connect-flash');
const flashMessage=require('./config/flashMessag');

const session=require('express-session');
const passport=require('passport');
const LocalStrategy=require('./config/passport-Local');



app.use(cookieparser());

app.use(express.urlencoded());

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use('/uploads/admin',express.static(path.join(__dirname,'uploads/admin')));
app.use('/uploads/comment',express.static(path.join(__dirname,'uploads/comment')));

app.use(express.static(path.join(__dirname,'assets')));
app.use(express.static(path.join(__dirname,'users')));

app.use(session({
    name:'RNW',
    secret:"rnw key",
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:1000*60*60
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthUser);

app.use(flash());
app.use(flashMessage.setFlash);

app.use('/',require('./routes/adminRoutes'));
app.use('/category',require('./routes/categoryRoutes'));
app.use('/blog',require('./routes/blogRoutes'));

app.listen(port,(err)=>{
    if(err){
        console.log(err);
        return false;
    }
    console.log("server is start:"+port);
})
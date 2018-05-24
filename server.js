var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
//var mongoose = require('mongoose');
var morgan = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
//const schemaJoi = require('/models/joi');
var User = require('./models/user');
var app = express();
//const Joi = require('joi');

//render engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true
}));
app.use(flash());

//Global vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use(express.static(path.join(__dirname,'public')));




var users = [
    {
        id:1,
        name:'Thulani'
    },
    {
        id:2,
        name:'Bongani'
    }
];
app.get('/', (req, res)=>{
    var title = 'home';
    res.render('index',{ title:'home'});
    if(req.body.username && req.body.password){
        User.authenticate(req.body.username, req.body.password, (error, user)=>{
            if(error || !user){
                var err = new Erro('Wrong username or password');
                err.status(401);
                return next(err);
            }else{
                req.session.userId =user._id;
                return redirect('/dashboard');
            }
        });
    }else{
        var err = new Error('All fields are required');
        err.status(400);
        return networkInterfaces(err);
    }
});

app.get('/register', (req, res)=>{
    var title = 'register';
    res.render('registr',{ title:'register'});
    
});

app.post('/register', (req, res)=>{
    var title = 'register';
    res.render('registr',{ title:'register'});
    if(req.body.password !== req.body.passwordConf){
        var err = new Error('Password does not match');
        err.status(400).send('passwords do not match!');
        return;
    }
    var newUser = new User({
        username:req.body.username,
        biography:req.body.biography,
        gender:req.body.optradio,
        password:req.body.password,
        passwordConf:req.body.passwordConf
    });
    User.createUser(newUser, function(err, user){
        if(err) throw err;
         console.log(newUser);
    });
    res.flash('success_msg', 'You are registered and can now login');//
    res.redirect('/dashboard');
    res.redirect('/register');
    console.log('registerd');
});

app.get('/users/:id', (req, res)=>{
    //console.log(req.params.id);
    const user = users.find(c => c.id == parseInt(req.params.id));
    if(!user){
        console.log('User not found');
    }else{
        res.send(user);
    }
});

app.post('/',(req, res) =>{
    const user = {
        id: users.length + 1,
        name: req.body.name
    };
    users.push(user);
    res.send(user);
});

app.delete('/users/user/:id',(req,res)=>{
    const user = users.find(c => c.id == parseInt(req.params.id));
    if(!user){
        res.status(400).send('this user does not exist!');
        return;
    }else{
        var index = users.indexOf(user);
        users.splice(index, 1);
        res.send(user);
    }
});

var port = process.env.PORT || 2000;
app.listen(port, ()=>{console.log(`server listening on port:${port}`);
});


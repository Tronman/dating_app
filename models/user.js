var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost:27017/db');
db = mongoose.connection;
db.once('error', console.error.bind(console, 'connection error: '));
db.once('open', ()=>{
    console.log('Database connection success!!');
});
var UserSchema = new mongoose.Schema({

    username:{
        type: String,
        unique:true,
        required: true,
        trim:true
    },
    biography:{
        type:String
    },
    gender:{
        type:String
    },
    password:{
        type: String,
        required: true
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
UserSchema.statics.authenticate = (username, password, callback)=>{
    User.findById({username: username}).exec((err, user)=>{
        if(err){
            return callback(err);
        }else if(!user){
            var err = new Error('User not found');
            err.status = 400;
            return callback(err);
        }

        bcrypt.compare(password.user.password, (err,result)=>{
            if(result == true){
                return callback(user);
            }else{
                return callback();
            }
        })
    })
}

UserSchema.pre('save', (next)=>{
    if(this.password){
        var salt = bcrypt.hashSync(this.password, salt)
    }
    next();
});

// router.post('/', (req, res, next)=>{
//     if(req.body.password !== req.body.passwordConf){
//        var err = new Error('Password do not match');
//        err.status = 400;
//        res.send("password dont match");
//        return next(err);
//    }

//    if(req.body.email &&
//    req.body.username &&
//    req.body.password &&
//    req.body.passwordConf){
//        var UserData = {
//            email: req.body.email,
//            username: req.body.username,
//            password: req.body.password,
//            passwordConf:req.body.passwordConf
//        }
//        User.createUser(UserData, (error, user)=>{
//            if(error){
//                return next(error);
//            }else{
//                req.session.userId = user._id;
//                return res.redirect('/profile');
//            }
//        });   
//    } else {
//        var err = new Error(' All field are required.');
//        err.status = 400;
//        return next(err);
//    }
// })

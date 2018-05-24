var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = mongoose.Schema({
    email:{
        type: String,
        unique:true,
        required: true,
        trim:true
    },
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


module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser,password, salt, function(err, hash){
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
// UserSchema.statics.authenticate = (email, password, callback)=>{
//     User.findById({email: email}).exec((err, user)=>{
//         if(err){
//             return callback(err);
//         }else if(!user){
//             var err = new Error('User not found');
//             err.status = 400;
//             return callback(err);
//         }

//         bcrypt.compare(password.user.password, (err,result)=>{
//             if(result == true){
//                 return callback(user);
//             }else{
//                 return callback();
//             }
//         })
//     })
// }

// User.pre('save', (next)=>{
//     if(this.password){
//         var salt = bcrypt.hashSync(this.password, salt)
//     }
//     next();
// });
var User = module.exports = mongoose.model('User', UserSchema);

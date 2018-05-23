var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
//const Joi = require('joi');

//render engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

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
    res.render('index',{ title:'Home'});
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

app.post('/users/user',(req, res) =>{
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

var port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log(`server listening on port:${port}`);
});


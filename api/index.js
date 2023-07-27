const express = require('express');
const cors =require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);
const secret = 'ydybcdvcdcv5byby3b2yb2ybyb8bbh';
const app =express();
const cookieParser = require('cookie-parser');
const multer  = require('multer');
const uploadMiddleware = multer({ 
    dest: 'uploads/',
    limits: { fieldSize: 5 * 1024 * 1024 }, // 5MB
 });
const fs = require('fs');
const Post = require('./models/Post');
const dotenv = require('dotenv');
dotenv.config();


app.use(cors({credentials:true, origin:'https://mishlyblog-client.vercel.app/'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
mongoose.connect(process.env.MONGODB_URL);

app.post('/register', async (req, res) =>{
    const {userName, password} = req.body;
    try{
        const userDoc = await User.create({
            userName, 
            password:bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch(e){
        res.status(400).json(e);
    }
});

app.post('/login', async (req, res) =>{
    const {userName, password} = req.body;
    const userDoc = await User.findOne({userName});
    if (!userDoc) {
        return res.status(404).json({ error: "User not found" });
    }
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        //user logged in
        jwt.sign({userName,id:userDoc._id}, secret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                userName,
            });
        })

        //res.json();
    }else{
        res.status(400).json('username or password is incorrect');
    }
});

app.get('/profile', (req, res) =>{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) =>{
        if(err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req, res) =>{
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) =>{
    //res.json({files:req.file}); 
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) =>{
        if(err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
          title,
          summary,
          content,
          cover:newPath,
          author:info.id,
    });
          res.json(postDoc);
    });
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if(req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) =>{
        if(err) throw err;
        const {id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id)
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
        if (!isAuthor){
            return res.status(400).json('you are not the author');
        }
        await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath ? newPath : postDoc.cover,
        });

        res.json(postDoc);
    });
});

app.get('/post', async (req, res) =>{
    res.json(await Post.find()
    .populate('author', ['userName'])
    .sort({createdAt: -1})
    .limit(20));
});

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['userName']);
    res.json(postDoc);
});

if (process.env.API_PORT) {
    app.listen(process.env.API_PORT);
}
module.exports = app;
//mongodb+srv://blog:7oxrMWodDyRiteAI@cluster0.8st4wdh.mongodb.net/?retryWrites=true&w=majority

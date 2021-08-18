if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

//require all the dependencies needed
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./AppError');
const Meme = require('./models/post');

//set url for local db
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/memeStream";

//connect to local db
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        console.log("Database Connection Successful!!");
    }).catch(err => {
        console.log("Database Connection Failed!!");
        console.log(err);
    })

//set the template engine used (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//define middlewares
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//i have defined frontend and backend requests seperately because my web app will render from single js file 
//and it will call the templates from frontend by sperate requests, But it works the same way!!

/*++++++Frontend requests++++++*/

//get request for home page
app.get('/', (req, res) => {
    res.render("memes/index");
})

//get request for all posts page
app.get('/posts', async (req, res, next) => {
    const memesArray = await Meme.find({});
    if (!memesArray) {
        return next(new AppError(404, 'Not Found!!'));
    }
    const memes = memesArray.slice(Math.max(memesArray.length - 100, 0));
    memes.reverse();
    res.render("memes/posts", { memes });
})

//post request when submit the form
app.post('/posts', async (req, res, next) => {
    const newMeme = new Meme(req.body);
    if (!newMeme.name || !newMeme.caption || !newMeme.url) {
        next(new AppError(402, 'All fields required!!'));
    }else {
        await newMeme.save();
        res.redirect('/posts');
    }
})

//get request for a specific meme by id
app.get('/posts/:id', async (req, res, next) => {
    const { id } = req.params;
    const meme = await Meme.findById(id);
    if (!meme) {
        return next(new AppError(404, 'Not Found!!'));
    }
    res.render("memes/show", { meme });
})

//get request for rendering edit page
app.get('/posts/:id/edit', async (req, res, next) => {
    const { id } = req.params;
    const meme = await Meme.findById(id);
    if (!meme) {
        return next(new AppError(404, 'Not Found!!'));
    }
    res.render("memes/edit", { meme });
})

//patch request when submit edit form
app.patch('/posts/:id', async (req, res, next) => {
    const { id } = req.params;
    const updatedMeme = await Meme.findByIdAndUpdate(id, req.body , { runValidators: true, new: true });
    if (!updatedMeme) {
        return next(new AppError(404, 'Not Found!!'));
    }
    res.redirect('/posts');
})

/*++++++Backend requests++++++*/
//for assessment purpose

//get request for getting latest 100 memes
app.get('/memes', async (req, res, next) => {
    const memesArray = await Meme.find({});
    if (!memesArray) {
        res.send([]);
    } else {
        const memes = memesArray.slice(Math.max(memesArray.length - 100, 0));
        memes.reverse();
        res.json(memes);
    }
})

//post request to post memes
app.post('/memes', async (req, res, next) => {
    const newMeme = new Meme(req.body);
    if (!newMeme.name || !newMeme.caption || !newMeme.url) {
        next(new AppError(402, 'All fields Required!!'));
    }else {
        await newMeme.save();
        const meme = {
            id: newMeme.id
        }
        res.json(meme);
    }
})

//get request to find a specific meme by id
app.get('/memes/:id', async (req, res, next) => {
    const { id } = req.params;
    const meme = await Meme.findById(id);
    if (!meme) {
        return next(new AppError(404, 'Not Found!!'));
    }
    res.json(meme);
})

//patch request to edit the memes
app.patch('/memes/:id', async function (req, res, next) {
    const { id } = req.params;
    const meme = {
        caption: req.body.caption,
        url: req.body.url
    }
    const updatedMeme = await Meme.findByIdAndUpdate(id, { $set: meme } , { runValidators: true, new: true })
    if (!updatedMeme) {
        return next(new AppError(404, 'Not Found!!'));
    } else {
        res.json({ "message": "updated successfully!!" });
    }
})

//Error handeling function
app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong!'} = err;
    res.status(status).send(message);
})

//method to listen all the request on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on Port ${port}!`);
})
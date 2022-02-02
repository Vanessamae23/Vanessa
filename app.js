const express = require("express");
const bodyParser = require("body-parser");
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const P6Question = require('./models/psle-qns.js');

const app = express();

//mongoose database
mongoose.connect('mongodb://localhost:27017/madeeasy', { useNewUrlParser: true, useUnifiedTopology: true })


//To check whether connected to the database
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected")
})

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))

// ejs
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



// home page
app.get('/', (req, res) => {
    res.render('index')
})

// courses page
app.get('/courses/primary', (req, res) => {
    res.render('courses/primarycourse')
})

// 
app.get('/challenges/primary', async (req, res) => {
    const P6Questions = await P6Question.find({})
    res.render('challenges/primarychallenge', { P6Questions })
})

app.listen(3000, function() {
    console.log("Server running")
})


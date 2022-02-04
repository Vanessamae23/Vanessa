if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require("express");
const bodyParser = require("body-parser");
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const P6Question = require('./models/psle-qns.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Forum = require("./models/forum.js");
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/CatchAsync');
const Comment = require('./models/comment.js')
const { forumSchema, commentSchema } = require('./schemas.js');
const session = require('express-session')
const flash = require('connect-flash')
const User = require('./models/user');
const { isLoggedIn, isAuthor, validateComment, validateForum, isCommentAuthor } = require('./middleware')



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

const sessionConfig = {
    name: 'session', // not using the default name
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    //cookie not accessible by javascript
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}
app.use(session(sessionConfig));
app.use(flash())


// authentication method
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})



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

app.get('/courses/juniorcollege', (req, res) => {
    res.render('courses/juniorcollegecourse')
})

// 
app.get('/challenges/primary', async (req, res) => {
    const P6Questions = await P6Question.find({})
    const admin = process.env.ADMIN;
    res.render('challenges/primarychallenge', { P6Questions, admin })
})

app.get('/login', (req, res) => {
    
    res.render('users/login')
})

app.get('/resources', (req, res) => {
    res.render('resources')
})

app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), async(req, res) => {
    const redirectUrl = req.session.returnTo || '/forum';
    //delete sth from an object cos don want it to be in the session
    delete req.session.returnTo;
    res.redirect(redirectUrl)
    req.flash('success', "Welcome back")
})

app.get('/register', (req, res) => {
    res.render('users/register')
})

app.post('/register', async(req, res) => {
    try {
        // basic user model instance
        const { email, username, password} = req.body;
        const user = new User({ email, username });
        //use the password, store the salt and the hash
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => { //from passport
            if(err) return next(err);
            req.flash('success', 'Welcome');
            res.redirect('forum')
        });
        } catch(e) {
            req.flash('error', e.message)
            res.redirect('register')
        }
    });

app.get("/logout", (req, res) => {
    req.logout();
    req.flash('success', "You are successfully logged out")
    res.redirect('/forum')
})



app.get('/forum/new', isLoggedIn, (req, res) => {
    res.render('users/new')
})

app.post('/challenges/primary', async (req, res, next) => {
    const P6Questions = new P6Question(req.body.P6Questions);
    await P6Questions.save();
    console.log(P6Questions)
    req.flash('success', 'successfully made a new question')
    res.redirect(`/challenges/primary`)
    
})

app.post('/forum', isLoggedIn, validateForum, catchAsync(async (req, res, next) => {
    const forum = new Forum(req.body.forum);
    forum.author = req.user._id
    await forum.save();
    req.flash('success', "Successfuly made a new forum")
    res.redirect(`/forum/${forum._id}`)
}));

app.get('/forum', async (req, res) => {
    const forums = await Forum.find({});
    res.render('users/forum', { forums })
})

app.delete('/forum/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const forum = await Forum.findByIdAndDelete(id);
    if(!forum.author.equals(req.user._id)) {
        req.flash("error", "You do not have the permission to do that");
        return res.redirect(`/campground/${id}`)
    }
    req.flash('success', "Successfully deleted a forum!")
    res.redirect('/forum')
}));

app.post('/forum/:id/comments', isLoggedIn, validateComment, catchAsync(async(req, res) => {
    const forum = await Forum.findById(req.params.id);
    const comment = new Comment(req.body.comment)
    comment.author = req.user._id;
    forum.comments.push(comment);
    await comment.save();
    await forum.save();
    req.flash('success', 'Created a new comment')
    res.redirect(`/forum/${forum._id}`)
}))

app.get('/forum/:id', catchAsync(async (req, res) => {
    const forum = await Forum.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if(!forum) {
        req.flash('error', 'Cannot find that forum')
        return res.redirect('/forum')
    }
    const admin = process.env.ADMIN;
    res.render('users/show', { forum, admin })
}))

app.delete('/forum/:id/comments/:commentId', isLoggedIn, isCommentAuthor, catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Forum.findByIdAndUpdate(id, {$pull: { comments: commentId}});
    await Comment.findByIdAndDelete(commentId);
    
    req.flash('success', 'Successfully deleted a comment')
    res.redirect(`/forum/${id}`)
}))

app.all('*', (req, res,next) => {
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).render('error', {err}) //passing through the entire error using err to the template
})

app.listen(3000, function() {
    console.log("Server running")
})


const { forumSchema, commentSchema } = require('./schemas.js') //must acquire the JOI schema
const ExpressError = require('./utils/ExpressError');
const Forum = require('./models/forum')
const Comment = require('./models/comment')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        //store the url they are requesting so put it in the session
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in')
        return res.redirect('/login')
    }
    next(); // ure good to go
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const forum = await Forum.findById(id)
    if(!forum.author.equals(req.user._id)) {
        req.flash("error", "You do not have the permission to do that");
        return res.redirect(`/forum/${id}`)
    }
    next();
}

module.exports.isCommentAuthor = async(req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId)
    if(!comment.author.equals(req.user._id)) {
        req.flash("error", "You do not have the permission to do that");
        return res.redirect(`/forum/${id}`)
    }
    next();
}

module.exports.validateForum = (req, res, next) => {
    const { error } = forumSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
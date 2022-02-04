const Joi = require('joi')

module.exports.forumSchema = Joi.object({
    forum: Joi.object({
        title: Joi.string().required().min(5),
        body: Joi.string().required().min(10),
        grade: Joi.string().required()
    }).required()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required(),
    }).required()
})
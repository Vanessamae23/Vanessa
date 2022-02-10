const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const JCQuestionSchema = new Schema ({
    question: String,
    answer: Number,
    youtube_id: String
})

module.exports = mongoose.model("JCQuestion", JCQuestionSchema)
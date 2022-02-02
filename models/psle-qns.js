const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const P6QuestionSchema = new Schema ({
    question: String,
    answer: Number,
    youtube_id: String
})

module.exports = mongoose.model("P6Question", P6QuestionSchema)
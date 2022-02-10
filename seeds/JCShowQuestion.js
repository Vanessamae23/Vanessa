const path = require('path');
const mongoose = require('mongoose')
const JCQuestions = require('./JCQuestion')
const JCQuestion = require('../models/jc-qns');

mongoose.connect('mongodb://localhost:27017/madeeasy', { useNewUrlParser: true, useUnifiedTopology: true })


//To check whether connected to the database
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected")
})

const questionDB = async () => {
    await JCQuestion.deleteMany({});
    for( let i = 0; i < JCQuestions.length; i++) {
        const qn = new JCQuestion({
            question: JCQuestions[i].question,
            answer: JCQuestions[i].answer,
            youtube_id: JCQuestions[i].youtube_id,
        })
        await qn.save();

    }
} 

questionDB().then(() => {
    mongoose.connection.close();
})
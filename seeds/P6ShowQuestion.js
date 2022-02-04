const path = require('path');
const mongoose = require('mongoose')
const P6Questions = require('./P6Question')
const P6Question = require('../models/psle-qns');

mongoose.connect('mongodb://localhost:27017/madeeasy', { useNewUrlParser: true, useUnifiedTopology: true })


//To check whether connected to the database
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected")
})

const questionDB = async () => {
    await P6Question.deleteMany({});
    for( let i = 0; i < P6Questions.length; i++) {
        const qn = new P6Question({
            question: P6Questions[i].question,
            answer: P6Questions[i].answer,
            youtube_id: P6Questions[i].youtube_id,
        })
        await qn.save();

    }
} 

questionDB().then(() => {
    mongoose.connection.close();
})
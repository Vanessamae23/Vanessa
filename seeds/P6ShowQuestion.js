const path = require('path');
const mongoose = require('mongoose')
const P6Question = require('./P6Question')
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
    for( let i = 0; i < P6Question.length; i++) {
        const qn = new PSLEQn({
            question: P6Question[i].question,
            answer: P6Question[i].answer,
            youtube_id: P6Question[i].youtube_id,
        })
        await qn.save();

    }
} 

questionDB().then(() => {
    mongoose.connection.close();
})
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment')

const ForumSchema = new Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    body: {
        type: String,
        minLength: 10,
        maxLength: 2000,
        required: true,
    },
    grade: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
        type: Schema.Types.ObjectId,
        ref: "Comment" //Comment model object id
    }
    ]
},
)

// cant use ES6 function format
ForumSchema.post('findOneAndDelete', async function(doc){
    //doc is the removed data from the findOneAndDelete
    if(doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

const Forum = mongoose.model("Forum", ForumSchema)
module.exports = Forum;
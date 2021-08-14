// require mongoose
const mongoose = require('mongoose');

//define schema
const memeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true 
    }
})

//plugin to convert "_id" to "id" and remove "__v" field on runtime
memeSchema.plugin(require('meanie-mongoose-to-json'));

//define the model
const Meme = mongoose.model('meme', memeSchema);

module.exports = Meme;
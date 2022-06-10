const mongoose = require('mongoose');


const Task = mongoose.model("task", mongoose.Schema({
    title: String,
    description: String
},{versionKey : false}))

module.exports = Task
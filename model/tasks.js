const mongoose = require('mongoose')
const {Schema} =  mongoose

const taskSchema = new mongoose.Schema({
    user: {
      type: String,
      required: false,
      unique: false
    },
    name: {
      type: String,
      required: [true, 'must provide name'],
      trim: true,
      maxlength: [5000, 'name can not be more than 20 characters'],
      unique: true
    },
    completed: {
      type: Boolean,
      default: false,
    }
})

module.exports = mongoose.model('Task', taskSchema)
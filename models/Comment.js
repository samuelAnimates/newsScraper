// Require mongoose
const mongoose = require("mongoose");
// Create a schema class
const Schema = mongoose.Schema;

// Create the Comment schema
var CommentSchema = new Schema({
  // Just a string
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    default: "Anonymous"
  },
  // Just a string
  body: {
    type: String,
    required: true
  }
});


// Create the Comment model with the NoteSchema
const Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;
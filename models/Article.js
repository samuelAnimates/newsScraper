// Require mongoose
const mongoose = require("mongoose");
// Create Schema class
const Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: "N/A"
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// Create the Article model with the ArticleSchema
const Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
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
  },
  // array of comment ids
  comments: [{
    // array of comment ObjectIds
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the Comment model
    ref: "Comment"
  }],
});

ArticleSchema.pre('save', function (next) {
  var self = this;
  Article.find({title : self.title}, function (err, docs) {
      if (!docs.length){
          next();
      }else{                
          console.log('article exists: ',self.title);
          next(new Error("article exists!"));
      }
  });
}) ;

// Create the Article model with the ArticleSchema
const Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
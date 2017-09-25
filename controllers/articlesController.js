/* Showing Mongoose's "Populated" Method
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();
const router = express.Router();;

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

//Set up default mongoose connection
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});

//Get the default connection
const db = mongoose.connection;

const newsSite = "http://www.chicagotribune.com/news/";

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
  });

//=======================================================
// Routes
// ======================================================

router.get("/", function(req, res) {
    Article.find({}, function(error, data){
        // Log any errors
        if (error) {
            console.log(error);
        }
        else {
            var hbsObject = {
                articles: data
            };
            res.render("index", hbsObject);
        }
    });
});

router.get("/scrape", function(req, res) {
    // Make a request for the chicagotribune news page html
    request(newsSite, function(error, response, html) {

        if (error){
            console.log("ERROR: " + error);
        }

        else {

            // Load the HTML into the $ variable
            var $ = cheerio.load(html);

            // Use Cheerio to find each news article title heading on the page, with children elements containing the additional data we want to store
            $("section.trb_outfit_group_list_item_body").each(function(i, element) {

                var result = {};

                // Save the title of the news article by accessing the text of the current element
                result.title = $(element).children("h3.trb_outfit_relatedListTitle").text();

                // Save the summary of the news article by accessing the text of the correponding sibling element of our current title
                result.summary = $(element).children("p.trb_outfit_group_list_item_brief").text();

                // Save the values for any "href" attributes of the current title's children, which correspond to the article links on the Tribune website
                result.link = "http://www.chicagotribune.com" + $(element).children("h3.trb_outfit_relatedListTitle").children("a").attr("href");

                // Using our Article model, create a new entry
                var entry = new Article({summary: result.summary, link: result.link, title: result.title});

                if (entry.link && entry.summary && entry.title){
                    // Save these results in an object that we'll push into the results array we defined earlier
                    entry.save(function(err, insertedArticle){
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(`SAVE ERROR: ${err}`);
                            }
                        else {
                            // Otherwise, log the inserted data
                            console.log(insertedArticle);
                        }
                    });
                }
            });
        }
    }); 
});

// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({ "_id": req.params.id })
    // ..and populate all of the notes associated with it
    .populate("comments")
    // now, execute our query
    .exec(function(error, doc) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Otherwise, send the doc to the browser as a json object
      else {
        res.json(doc);
      }
    });
  });

router.post("/commentsbyarticle/:id", function(req, res) {

        console.log("We're in the post route");

        // Use our Note model to make a new note from the req.body
        let commentId = req.body.deleteCommentId;

        // Use the article id to find and update it's note
        Article.findOneAndUpdate({ "_id": req.params.id }, {$pull: { "comments": commentId }})
        // Execute the above query
        .exec(function(err, doc) {
            console.log(`"We're executing...`);
            // Log any errors
            if (err) {
                console.log(`Error in updating the database: ${err}`);
            }
            else {
                // Or send the document to the browser
                console.log(`Suces`);
            }
        });
});

router.post("/articles/:id", function(req, res) {
    
            console.log("We're in the post route");
    
            // Use our Note model to make a new note from the req.body
            let newComment = new Comment(req.body);
            console.log(newComment);
    
            // Save the new note to mongoose
            newComment.save(function(error, doc) {
                console.log(`we're trying to save...`);
                // Log any errors
                if (error) {
                    console.log(`Error in saving the newComment: ${error}`);
                }
                // Otherwise
                else {
                    // Use the article id to find and update it's note
                    Article.findOneAndUpdate({ "_id": req.params.id }, {$push: { "comments": doc }})
                    // Execute the above query
                    .exec(function(err, doc) {
                        console.log(`"We're executing...`);
                        // Log any errors
                        if (err) {
                            console.log(`Error in updating the database: ${err}`);
                        }
                        else {
                            // Or send the document to the browser
                            console.log(`New comment: ${doc}`);
                        }
                    });
                }
            });
    
    });

// Export routes for use by our server (server.js)
module.exports = router;
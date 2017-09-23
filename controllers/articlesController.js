// Dependencies
const express = require("express");
const router = express.Router();

const mongojs = require("mongojs");
const request = require("request");
const cheerio = require("cheerio");
const mongoose = require("mongoose");



// Requiring our Comment and Article models
const Comment = require("../models/Comment.js");
const Article = require("../models/Article.js");

// Initialize Express
const app = express();

// Database configuration
const databaseUrl = "mongodb://localhost/scraper";
const collections = ["scrapedData"];
const newsSite = "http://www.chicagotribune.com/news/";

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

router.get("/", function(req, res) {
    db.scrapedData.find({}, function(error, data){
        var hbsObject = {
            articles: data
        };
        res.render("index", hbsObject);
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
                // This effectively passes the result object to the entry (and the title and link)
                var entry = new Article(result);

                //if (entry.link && entry.summary && entry.title){
                    // Save these results in an object that we'll push into the results array we defined earlier
                    db.scrapedData.save({entry}, function(err, insertedArticle){
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                            }
                        else {
                            // Otherwise, log the inserted data
                            console.log(insertedArticle);
                            return
                        }
                    });
                //}
            });
        }
    }); 
});

// Export routes for use by our server (server.js)
module.exports = router;
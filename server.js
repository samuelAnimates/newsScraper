// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];
var newsSite = "http://www.chicagotribune.com/news/";

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/all", function(req, res) {
    db.scrapedData.find({}, function(data){
      res.json(data);
    });
});

app.get("/scrape", function(req, res) {
    // Make a request for the chicagotribune news page html
    request(newsSite, function(error, response, html) {

        if (error){
            console.log("ERROR: " + error);
        }

        else {

            // Load the HTML into the $ variable
            var $ = cheerio.load(html);

            // Use Cheerio to find each news article title heading on the page, with children elements containing the additional data we want to store
            $("h3.trb_outfit_relatedListTitle").each(function(i, element) {

                // Save the title of the news article by accessing the text of the current element
                var title = $(element).text();

                // Save the summary of the news article by accessing the text of the correponding sibling element of our current title
                var summary = $(element).siblings('p.trb_outfit_group_list_item_brief').text();

                // Save the values for any "href" attributes of the current title's children, which correspond to the article links on the Tribune website
                var link = "http://www.chicagotribune.com/" + $(element).children().attr("href");

                // Save these results in an object that we'll push into the results array we defined earlier
                db.scrapedData.insert({title: title, summary: summary, link: link}, function(result){
                    res.json(result);
                });
            });
        }
    }); 
});

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});
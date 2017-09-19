var cheerio = require("cheerio");
var request = require("request");

// Make a request for the bbc.com homepage html
request("http://www.chicagotribune.com/news/", function(error, response, html) {

    if (error){
        console.log("ERROR: " + error);
    }

    else {

        // Load the HTML into the $ variable
        var $ = cheerio.load(html);
        // Declare an empty array to hold the data we will scrape from bbc.com
        var results = [];

        // Use Cheerio to find each news article title heading on the page, with children elements containing the additional data we want to store
        $("h3.trb_outfit_relatedListTitle").each(function(i, element) {

            // Save the title of the news article by accessing the text of the current element
            var title = $(element).text();

            // Save the summary of the news article by accessing the text of the correponding sibling element of our current title
            var summary = $(element).siblings('p.trb_outfit_group_list_item_brief').text();

            // Save the values for any "href" attributes of the current title's children, which correspond to the article links on the Tribune website
            var link = "http://www.chicagotribune.com/" + $(element).children().attr("href");

            // Save these results in an object that we'll push into the results array we defined earlier
            results.push({
                title: title,
                summary: summary,
                link: link
            });
        });
    }
  // Log the results once you've looped through each of the elements found with cheerio
  //console.log(results);
});
 // submit
 $('.JS-comment-form').submit(function(event) {

    // stop the form from refreshing the page
    event.preventDefault();

    // get the form data
    let articleId = $(this).attr("id");

    // process the form
    $.ajax({
        type: "POST",
        url: `/articles/${articleId}`,
        data: {
            // Value taken from title input
            title: $(`input[name=comment-title-${articleId}]`).val(),
            // Value taken from note textarea
            body: $(`textarea.${articleId}`).val(),
            author: $(`input[name=comment-author-name-${articleId}]`).val(),
        }
    })
        // using the done promise callback
        .done(function(data) {

            // log data to the console so we can see
            console.log(data); 
            
            // here we will handle errors and validation messages
        });

    
});


$(".JS-comment-btn").click(function() {
    // get the form data
    let articleId = $(this).attr("data-id");
    console.log(articleId);

    // process the form
    $.ajax({
        type: "GET",
        url: `/articles/${articleId}`
    })
        // using the done promise callback
        .done(function(data) {
            console.log(`here's the data: ${data}`);
            // log data to the console so we can see
            for (let obj of data.comments) {
                let newDiv = `<div class='panel panel-info'><h4 class='panel-title'>${obj.title}</h4><span>By: ${obj.author}</span><div class='panel-body'>${obj.body}</div></div>`;
                console.log(newDiv);
                $(`.comments-container.${articleId}`).append(newDiv);
            }
            
        });
  });
function michael() {
    // test
}

function stuart() {
    // This is what I 'm adding
}

function adrian() {
    // This is my test 1
    // This is my test 2
    // This is my test 3
}

$(document).ready(function() {
	$.ajax({
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/queries/analyze?q=salmon', // The URL to the API. You can get this in the API page of the API you intend to consume
    type: 'GET', // The HTTP Method, can be GET POST PUT DELETE etc
    // data: {}, // Additional parameters here
    // dataType: 'json',
    success: function(data) { console.dir((data.source)); },
    // error: function(err) { alert(err); },
    beforeSend: function(xhr) {
    xhr.setRequestHeader("X-Mashape-Authorization", "Jn8goME99rmshWQrcQDNuZ9e7TN8p1FXY71jsnp6yW4jmAtQuu"); // Enter here your Mashape key
    }
	});
});

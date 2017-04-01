$(document).ready(function() {
	var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/queries/analyze?q=salmon";
	
	$.ajax({
			url: queryURL,
			method: "GET",
			beforeSend: function(xhr) {
    		xhr.setRequestHeader("X-Mashape-Authorization", "Jn8goME99rmshWQrcQDNuZ9e7TN8p1FXY71jsnp6yW4jmAtQuu");
    	}
		}).done(function(response) {
			console.log(response);
			
		});
});

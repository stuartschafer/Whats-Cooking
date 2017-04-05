$(document).ready(function() {
	var recipeIngredients0 =[];
	var recipeIngredients1 =[];
	var recipeIngredients2 =[];
	var recipeIngredients3 =[];
	var recipeIngredients4 =[];

	function getData(query) {
		var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&limitLicense=true&number=5&ranking=1&ingredients=" + query;
		// var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/769774/information";
		$.ajax({
			url: queryURL,
			method: "GET",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-Mashape-Authorization", "Jn8goME99rmshWQrcQDNuZ9e7TN8p1FXY71jsnp6yW4jmAtQuu");
			}
		}).done(function(response) {
			console.log(response);
			for (var i = 0; i < response.length; i++) {
				getRecipe(response[i].id);
				
			}
		});
	}

	function getRecipe(recipeID) {
		var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + recipeID + "/information";

		$.ajax({
			url: queryURL,
			method: "GET",
			beforeSend: function(xhr) {
				xhr.setRequestHeader("X-Mashape-Authorization", "Jn8goME99rmshWQrcQDNuZ9e7TN8p1FXY71jsnp6yW4jmAtQuu");
			}
		}).done(function(recipe) {
			console.log(recipe);
		});
	}

	getData("stewing beef,potatoes");
	
});

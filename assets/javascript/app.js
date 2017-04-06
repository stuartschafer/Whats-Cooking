$(document).ready(function() {
    var recipeIngredients0 = [];
    var recipeIngredients1 = [];
    var recipeIngredients2 = [];
    var recipeIngredients3 = [];
    var recipeIngredients4 = [];

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
            if (recipe.instructions) {
                // console.log(recipe);
                layoutRecipeCard(recipe);
            }

        });
    }

    function layoutRecipeCard(recipeData) {
        var parent = $("#recipeData")

        var cardParent = $("<div>");
        $(cardParent).addClass("mdl-card mdl-cell mdl-cell--2-col mdl-cell--4-col-tablet mdl-shadow--2dp");

        var newFigure = $("<figure>");
        $(newFigure).addClass("mdl-card__media");
        var newImage = $("<img>");
        $(newImage).attr("src", recipeData.image);
        $(newFigure).append(newImage);

        var cardTitle = $("<div>");
        $(cardTitle).append('<h3 class="mdl-card__title-text">' + recipeData.title + '</h3>');

        var cardText = $("<div>");
        $(cardText).append('<p>Cooking Time : ' + recipeData.readyInMinutes + '</p>');
        $(cardText).append('<p>Servings : ' + recipeData.servings + '</p>');
        $(cardText).append('<p>Score : ' + recipeData.spoonacularScore + '</p>');

        var cardBorder = $("<div>");
        $(cardBorder).addClass("mdl-card__actions mdl-card--border");
        $(cardBorder).attr("data-id", recipeData.id);
        $(cardBorder).append('<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="readMore">Read More</a>');

        $(cardParent).append(newFigure);
        $(cardParent).append(cardTitle);
        $(cardParent).append(cardText);
        $(cardParent).append(cardBorder);
        $(parent).append(cardParent);
    }

    getData("chicken,potatoes");

    $("body").on("click", "#readMore", function() {
        console.log("press press")
        $(this.parentElement).data("id")

    });


});
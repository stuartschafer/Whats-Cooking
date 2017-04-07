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
        $(cardParent).addClass("col s12 m6");

        var card = $("<div>");
        $(card).addClass("card");

        var newFigure = $("<div>");
        $(newFigure).addClass("card-image waves-effect waves-block waves-light");

        var newImage = $("<img>");
        $(newImage).addClass("activator");
        $(newImage).attr("src", recipeData.image);
        $(newFigure).append(newImage);

        var cardContent = $("<div>");
        $(cardContent).append('<span class="card-title activator grey-text text-darken-4">' + recipeData.title + '<i class="material-icons right">more_vert</i></span>');

        $(cardContent).append('<p>Cooking Time : ' + recipeData.readyInMinutes + '</p>');
        $(cardContent).append('<p>Servings : ' + recipeData.servings + '</p>');
        $(cardContent).append('<p>Score : ' + recipeData.spoonacularScore + '</p>');

        var cardAction = $("<div>")
        $(cardAction).addClass("card-action")
        $(cardAction).append('<a class="waves-effect waves-light btn-large">Button</a>')

        var cardDetails = $("<div>");
        $(cardDetails).addClass("card-reveal");
        $(cardDetails).attr("data-id", recipeData.id);
        $(cardDetails).append('<span class="card-title grey-text text-darken-4">' + recipeData.title + '<i class="material-icons right">close</i></span>');
        $(cardDetails).append(recipeData.instructions);

        $(card).append(newFigure);
        $(card).append(cardContent);
        $(card).append(cardDetails);
        $(card).append(cardAction);
        $(cardParent).append(card);
        $(parent).append(cardParent);
    }

    getData("chicken,potatoes");

    $("body").on("click", "#readMore", function() {
        console.log("press press")
        $(this.parentElement).data("id")
    });


});
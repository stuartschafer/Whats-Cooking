$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBnO_XnW5MaeETGle29pk5z7cyseXcWxJM",
        authDomain: "whatscooking-cb33d.firebaseapp.com",
        databaseURL: "https://whatscooking-cb33d.firebaseio.com",
        projectId: "whatscooking-cb33d",
        storageBucket: "whatscooking-cb33d.appspot.com",
        messagingSenderId: "296059627382"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var pantryObj = {
        "Bacon": "Meat",
        "Chicken": "Meat",
        "Ground Beef": "Meat",
        "Ground Turkey": "Meat",
        "Ham": "Meat",
        "Pork Loin": "Meat",
        "Ribeye": "Meat",
        "Ribs": "Meat",
        "Rump Roast": "Meat",
        "Beef": "Meat",

        "Salmon": "Seafood",

        "Broccoli": "Produce",
        "Cauliflower": "Produce",
        "Carrot": "Produce",
        "Corn": "Produce",
        "Lettuce": "Produce",
        "Onion": "Produce",
        "Potato": "Produce",
        "Tomato": "Produce",
        "Leek": "Produce",
        "Garlic": "Produce",
        "Lemon": "Produce",
        "Cucumber": "Produce",

        "Black Olives": "Canned and Jarred",

        "Cheddar Cheese": "Cheese",

        "Eggs": "Milk, Eggs, Other Dairy",
        "Milk": "Milk, Eggs, Other Dairy",
        "Butter": "Milk, Eggs, Other Dairy",

        "Rice": "Pasta and Rice"
    };

    var pantry = [];
    var addToPandorasPantry = [];
    $("#emptyPantry").hide();
    var ingredients = [];

    function getData(query) {
        var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&limitLicense=true&number=5&ranking=1&ingredients=" + query;
        ingredients = query.split(",");

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
                console.log(recipe);
                var recipeIngredients = [];
                for (var i = 0; i < recipe.extendedIngredients.length; i++) {
                    recipeIngredients.push(recipe.extendedIngredients[i].name);

                }
                // compareIngredients(ingredients, recipeIngredients);
                layoutRecipeCard(recipe);
            }
        });
    }

    function testIngredients(supplied, required) {
        if (required.search(supplied) >= 0) {
            return true;
        }
    }

    function compareIngredients(pantry, recipe) {
        console.log("pantry: " + pantry);
        console.log("recipe: " + recipe);
        var missingIngredients = [];

        for (var i = 0; i < recipe.length; i++) {
            if ($.inArray(recipe[i], pantry) === -1) {
                missingIngredients.push(recipe[i]);
            }
        }
        console.log(missingIngredients);
    }

    function layoutRecipeCard(recipeData) {
        var parent = $("#recipeData");
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

        var cardAction = $("<div>");
        $(cardAction).addClass("card-action");
        $(cardAction).append('<a class="waves-effect waves-light btn-large">Button</a>');

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

    function displayPantryItemsOnPage(pantry) {
        database.ref().on("value", function(snapshot) {

            if (snapshot.child("pantry").exists()) {
                $("#emptyPantry").hide();
                $("#pantryItemsonMainPage").empty();
                addToMainPantryPage = snapshot.val().pantry;
                addToMainPantryPage = addToMainPantryPage.sort();

                for (var i = 0; i < addToMainPantryPage.length; i++) {
                    var parent = $("#pantryItemsonMainPage");
                    var checkbox = $("<div>")
                    var input = $("<input>");
                    $(input).attr("type", "checkbox");
                    $(input).attr("id", "item" + i);
                    $(input).addClass("pantryItemHere");
                    $(input).attr("name", addToMainPantryPage[i]);
                    var label = $("<label>");
                    $(label).attr("for", "item" + i);
                    $(label).text(addToMainPantryPage[i]);
                    $(checkbox).append(input);
                    $(checkbox).append(label);
                    $(parent).append(checkbox);
                }
            } else {
                $("#emptyPantry").show();
                $("#pantryItemsonMainPage").empty();
            }
        });
    }

    function goIntoPantry() {
        $(".addToPantryButton").hide();
        var arrIngred = [];
        var newIngred = [];
        var checkedButtons = $("input[id^='item']:checked");

        for (var i = 0; i < checkedButtons.length; i++) {
            arrIngred.push(checkedButtons[i].name);
        }
        // This combines the firebase array with the new array from what the user selected.
        var newArray = arrIngred.concat(addToPandorasPantry);
        // This sets the new array in firebase
        database.ref().set({ pantry: newArray });
    }

    // This displays Pandora's pantry items on the left-hand side of the page.
    // Any item in the pantry will not be displayed on the storage section (right-hand side).
    function displayPandorasPantry(pantry) {

        database.ref().on("value", function(snapshot) {
            var meatStorage = [];
            var seafoodStorage = [];
            var produceStorage = [];
            var cannedStorage = [];
            var cheeseStorage = [];
            var dairyStorage = [];
            var pastaRiceStorage = [];
            // This tests to make sure there is something in the firebase.
            if (snapshot.child("pantry").exists()) {
                $(".itemGoods2").empty();
                addToPandorasPantry = snapshot.val().pantry;
                addToPandorasPantry = addToPandorasPantry.sort();

                for (var j = 0; j < addToPandorasPantry.length; j++) {
                    var parent2 = $("#pandorasPantryItems");
                    var checkbox2 = $("<div>")
                    var label2 = $("<label>");
                    $(label2).css({ "line-height": "25px", "font-size": "1rem" });
                    $(label2).text(addToPandorasPantry[j]);
                    $(checkbox2).append(label2);
                    $(parent2).append(checkbox2);
                }
            } else {

                addToPandorasPantry = [];
                arrIngred = [];
            }
            $(".itemGoods").empty();
            // attempt to use pantryObj
            for (var food in pantryObj) {
                switch (pantryObj[food]) {
                    case "Meat":
                        meatStorage.push(food);
                        break;
                    case "Seafood":
                        seafoodStorage.push(food);
                        break;
                    case "Produce":
                        produceStorage.push(food);
                        break;
                    case "Canned and Jarred":
                        cannedStorage.push(food);
                        break;
                    case "Cheese":
                        cheeseStorage.push(food);
                        break;
                    case "Milk, Eggs, Other Dairy":
                        dairyStorage.push(food);
                        break;
                    case "Pasta and Rice":
                        pastaRiceStorage.push(food);
                        break;
                }
            }
            displayStorage(meatStorage, $("#meat-storage"), 0);
            displayStorage(seafoodStorage, $("#seafood-storage"), 20);
            displayStorage(produceStorage, $("#produce-storage"), 40);
            displayStorage(cannedStorage, $("#canned-storage"), 60);
            displayStorage(cheeseStorage, $("#cheese-storage"), 80);
            displayStorage(dairyStorage, $("#dairy-storage"), 100);

            // displayColdStorage(coldStorage);
            // displayMeatStorage(meatStorage);
            // displayProduceStorage(produceStorage);
            // displayDryGoodsStorage(dryGoodsStorage);
            // displaySpiceStorage(spiceStorage);
        });
    }


    function displayStorage(arr, newDiv, num) {
        var parent = newDiv;
        for (var i = 0; i < arr.length; i++) {
            if ($.inArray(arr[i], addToPandorasPantry) !== -1) {} else {
                var checkbox = $("<div>");
                var input = $("<input>");
                $(input).attr("type", "checkbox");
                $(input).attr("id", "item" + num);
                $(input).addClass("pantryItemClicked");
                $(input).attr("name", arr[i]);
                var label = $("<label>");
                $(label).attr("for", "item" + num);
                $(label).text(arr[i]);
                $(checkbox).append(input);
                $(checkbox).append(label);
                $(parent).append(checkbox);
                num++;
            }
        }
    }

    function getSelectedIngredients() {

    }


    $("body").on("click", "#readMore", function() {

        $(this.parentElement).data("id");
    });


    $("body").on("click", "#searchForRecipes", function() {
        var arrSelected = [];
        var selected = $("input[class^='pantryItemHere']:checked")
        for (var index = 0; index < selected.length; index++) {
            arrSelected.push(selected[index].name);
        }
        getData(arrSelected.toString());

    });

    $(".searchDeleteButton").hide();
    var database = firebase.database();
    var pantry = [];
    var addToMainPantryPage = [];

    displayPantryItemsOnPage(pantry);


    $(document).on("click", ".pantryItemHere", function() {
        if ($(".pantryItemHere").is(":checked") === true) { $(".searchDeleteButton").fadeIn(); } else if ($(".pantryItemHere").is(":checked") === false) { $(".searchDeleteButton").fadeOut(); }
    });

    // This runs whenevr a box(es) is clicked and when they are unclicked
    $(document).on("click", ".pantryItemClicked", function() {
        if ($(".pantryItemClicked").is(":checked") === true) { $(".addToPantryButton").fadeIn(); } else if ($(".pantryItemClicked").is(":checked") === false) { $(".addToPantryButton").fadeOut(); }
    });

    $(".addToPantryButton").hide();

    displayPandorasPantry(pantry);

    // This runs when the user selects some items and presses the "Add to My Pantry" button.
    // Might add a modal later on if the user does not select anything.
    $("#addToMyPantry").on("click", function(event) {
        event.preventDefault();
        goIntoPantry();
    });


});
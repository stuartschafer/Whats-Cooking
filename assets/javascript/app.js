$("#emptyPantry").hide();
$(".searchDeleteButton").hide();
$("#removeFromPantry").hide();
$(".addToPantryButton").hide();
    
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
    "Shrimp": "Seafood",
    "Crab": "Seafood",

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
    "Pickles": "Canned and Jarred",
    "Salsa": "Canned and Jarred",

    "Cheddar Cheese": "Cheese",
    "American Cheese": "Cheese",
    "Provolone": "Cheese",
    "Swiss Cheese": "Cheese",
    "Havarti": "Cheese",

    "Eggs": "Milk, Eggs, Other Dairy",
    "Milk": "Milk, Eggs, Other Dairy",
    "Butter": "Milk, Eggs, Other Dairy",

    "Rice": "Pasta and Rice",
    "Pasta": "Pasta and Rice"
};


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
    var addToPandorasPantry = [];
    var missingIngredients = [];
    var suppliedIngredients = [];
    var shoppingCartTrigger = false;

    $(".button-collapse").sideNav();

    function getData(query) {
        var queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=true&limitLicense=true&number=5&ranking=1&ingredients=" + query;

        $.ajax({
            url: queryURL,
            method: "GET",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-Mashape-Authorization", "Jn8goME99rmshWQrcQDNuZ9e7TN8p1FXY71jsnp6yW4jmAtQuu");
            }
        }).done(function(response) {
            //  console.log(response);
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
                //  console.log(recipe);
                var recipeIngredients = [];
                for (var i = 0; i < recipe.extendedIngredients.length; i++) {
                    recipeIngredients.push(recipe.extendedIngredients[i]);
                }
                compareIngredients(recipeIngredients);
                layoutRecipeCard(recipe);
                if (shoppingCartTrigger) {
                    shoppingCartTrigger = false;
                    $("#selected").hide()
                    layoutShoppingCard(recipe);
                }
            }
        });
    }

    function testIngredients(supplied, required) {
        if (required.search(supplied) >= 0) {
            return true;
        }
    }

    function compareIngredients(recipe) {
        missingIngredients = [];
        suppliedIngredients = [];
        database.ref().on("value", function(snapshot) {
            if (snapshot.child("pantry").exists()) {
                pantryItems = snapshot.val().pantry;
            }
        });
        //  console.log("pantry: " + pantryItems);
        //  console.log("recipe: " + recipe);
        var foundIngredient = false;

        for (var i = 0; i < recipe.length; i++) {

            for (var j = 0; j < pantryItems.length; j++) {

                if (recipe[i].name.toUpperCase().includes(pantryItems[j].toUpperCase())) {
                    //  console.log(recipe[i].name.toUpperCase());
                    //  console.log(pantryItems[j].toUpperCase());
                    if (recipe[i].aisle.toUpperCase() === pantryObj[pantryItems[j]].toUpperCase()) {
                        //  console.log(recipe[i].aisle.toUpperCase());
                        //  console.log(pantryObj[pantryItems[j]].toUpperCase());
                        foundIngredient = true;
                        suppliedIngredients.push(recipe[i].name);
                    }
                }
            }
            if (foundIngredient) {
                foundIngredient = false;
            } else

            {
                if (missingIngredients.indexOf(recipe[i].name) < 0) {
                    missingIngredients.push(recipe[i].name);
                }
            }
        }
        //  console.log(missingIngredients);
    }

    function layoutRecipeCard(recipeData) {
        var parent = $("#recipeData");
        var cardParent = $("<div>");
        $(cardParent).addClass("col s12 m6");

        var card = $("<div>");
        $(card).addClass("card layout");

        var newFigure = $("<div>");
        $(newFigure).addClass("card-image waves-effect waves-block waves-light");

        var newImage = $("<img>");
        $(newImage).addClass("activator");
        $(newImage).attr("src", recipeData.image);
        $(newFigure).append(newImage);

        var cardContent = $("<div>");
        $(cardContent).addClass("card-content")
        $(cardContent).append('<span class="card-title activator grey-text text-darken-4">' + recipeData.title + '<i class="material-icons right">more_vert</i></span>');

        $(cardContent).append('<p>Cooking Time : ' + recipeData.readyInMinutes + '</p>');
        $(cardContent).append('<p>Servings : ' + recipeData.servings + '</p>');
        $(cardContent).append('<p>Score : ' + recipeData.spoonacularScore + '</p>');
        $(cardContent).append('<p>Missing Items : ' + missingIngredients.length + '</p>');

        var cardAction = $("<div>");
        $(cardAction).addClass("card-action");
        $(cardAction).append('<a class="waves-effect waves-light btn-large" id="selected">Select</a>');
        $(cardAction).attr("data-id", recipeData.id);

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

    function layoutShoppingCard(recipeData) {
        var parent = $("#recipeData");
        var cardParent = $("<div>");
        $(cardParent).addClass("col s12 m6");

        var card = $("<div>");
        $(card).addClass("card");

        var newFigure = $("<div>");
        $(newFigure).addClass("card-image waves-effect waves-block waves-light");
        var cardContent = $("<div>");
        $(cardContent).addClass("card-content")
        $(cardContent).append('<span class="card-title grey-text text-darken-4">' + recipeData.title + '</span>');

        $(cardContent).append('<h3> Items to purchase :- </h3>');
        for (var i = 0; i < missingIngredients.length; i++) {
            num = i + 1;
            $(cardContent).append('<p>' + num + " : " + missingIngredients[i] + '</p>');
        }

        $(cardContent).append('<h3> Supplied items :- </h3>');
        for (var i = 0; i < suppliedIngredients.length; i++) {
            num = i + 1;
            $(cardContent).append('<p>' + num + " : " + suppliedIngredients[i] + '</p>');
        }
        $(cardContent).append('<h3> Instructions :- </h3>');
        $(cardContent).append(recipeData.instructions);
        var cardAction = $("<div>");
        $(cardAction).addClass("card-action");
        $(cardAction).append('<a class="waves-effect waves-light btn-large" id="returnResults">Return to results</a>');
        $(cardAction).attr("data-id", recipeData.id);
        $(card).append(cardContent);
        $(card).append(cardAction);
        $(cardParent).append(card);
        $(parent).append(cardParent);
    }

    function displayPantryItemsOnPage() {
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
        $("#removeFromPantry").hide();
        var arrIngred = [];
        var checkedButtons = $("input[id^='item']:checked");

        for (var i = 0; i < checkedButtons.length; i++) {
            arrIngred.push(checkedButtons[i].name);
        }
        // This combines the firebase array with the new array from what the user selected.
        var newArray = arrIngred.concat(addToPandorasPantry);
        // This sets the new array in firebase
        database.ref().set({ pantry: newArray });
    }

//  
    function deleteFromPantry() {
        $(".addToPantryButton").hide();
        $("#removeFromPantry").hide();
        var removeArray = [];
        var removeItems = $("input[id^='item']:checked");
            
        for (var i = 0; i < removeItems.length; i++) {
            removeArray.push(removeItems[i].name);
        }

        for (var j = addToPandorasPantry.length; j > -1; j--) {
            if ($.inArray(addToPandorasPantry[j], removeArray) === -1) {} 
            else { addToPandorasPantry.splice(j,1); }
        }
        database.ref().set({ pantry: addToPandorasPantry });
        $("#pandorasPantryItems").empty();
        displayPandorasPantry();
}

    // This displays Pandora's pantry items on the left-hand side of the page.
    // Any item in the pantry will not be displayed on the storage section (right-hand side).
    function displayPandorasPantry() {
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
                    var parent = $("#pandorasPantryItems");
                    var checkbox = $("<div>");
                    var input = $("<input>");
                    var label = $("<label>");
                    $(input).attr("type", "checkbox");
                    $(input).attr("id", "item" + (j+500));
                    $(input).addClass("removingFromPantry");
                    $(label).attr("for", "item" + (j+500));
                    $(input).attr("name", addToPandorasPantry[j]);
                    $(label).text(addToPandorasPantry[j]);
                    $(checkbox).append(input);
                    $(checkbox).append(label);
                    $(parent).append(checkbox);
                }
            } else {
                addToPandorasPantry = [];
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
        });
    }

    function displayStorage(arr, newDiv, num) {
        arr = arr.sort();
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

    $("body").on("click", "#selected", function() {
        shoppingCartTrigger = true;
        $("#recipeData").empty();
        getRecipe($(this.parentElement).data("id"));
    });

    $("body").on("click", "#searchForRecipes", function() {
        // write to local storage
        var arrSelected = [];
        var selected = $("input[class^='pantryItemHere']:checked");
        for (var index = 0; index < selected.length; index++) {
            arrSelected.push(selected[index].name);
        }
        localStorage.setItem("ingredients", arrSelected.toString());
        window.location.href = "assets/html/recipe.html";
    });

    if (window.location.pathname.includes("recipe.html")) {
        getData(localStorage.getItem("ingredients"));
    }

    $("body").on("click", "#returnResults", function() {
        $("#recipeData").empty();
        getData(localStorage.getItem("ingredients"));
    });

    $(".searchDeleteButton").hide();
    database = firebase.database();
    var addToMainPantryPage = [];

    displayPantryItemsOnPage();

    // This will display/hide the "Delete From Pantry" button if a pantry item is clicked/unclicked
    $(document).on("click", ".removingFromPantry", function() {
        if ($(".removingFromPantry").is(":checked") === true) { 
            $(".removeFromPantryButton").show();
            $(".addToPantryButton").hide();
            $( ".pantryItemClicked" ).prop( "checked", false ); }
        else if ($(".removingFromPantry").is(":checked") === false) { $(".removeFromPantryButton").hide(); }
    });

    $(document).on("click", ".pantryItemHere", function() {
        if ($(".pantryItemHere").is(":checked") === true) { $(".searchDeleteButton").show(); } 
        else if ($(".pantryItemHere").is(":checked") === false) { $(".searchDeleteButton").hide(); }
    });

    // This runs whenevr a box(es) is clicked and when they are unclicked
    $(document).on("click", ".pantryItemClicked", function() {
        if ($(".pantryItemClicked").is(":checked") === true) { 
            $(".addToPantryButton").show();
            $("#removeFromPantry").hide();
            $( ".removingFromPantry" ).prop( "checked", false ); }
        else if ($(".pantryItemClicked").is(":checked") === false) { $(".addToPantryButton").hide(); }
    });

    $("#removeFromPantry").hide();

    $(".addToPantryButton").hide();

    displayPandorasPantry();

    // This runs when the user selects some items and presses the "Add to My Pantry" button.
    $("#addToMyPantry").on("click", function(event) {
        event.preventDefault();
        goIntoPantry();
    });

    // This runs when the user deletes something from their pantry.
    $("#removeFromPantry").on("click", function(event) {
        event.preventDefault();
        deleteFromPantry();
    });

});
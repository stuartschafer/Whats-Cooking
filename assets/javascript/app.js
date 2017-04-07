$(document).ready(function() {
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
                var recipeIngredients = [];
                for (var i = 0; i < recipe.extendedIngredients.length; i++) {
                    recipeIngredients.push(recipe.extendedIngredients[i].name);
                    
                }
                // compareIngredients(ingredients, recipeIngredients);
                layoutRecipeCard(recipe);
            }
        });
    }


    function compareIngredients(pantry, recipe) {
        console.log("pantry: " + pantry);
        console.log("recipe: " + recipe);
        var missingIngredients = [];

        for (var i = 0; i < recipe.length; i++) {
            if ($.inArray(recipe[i], pantry) === -1) {
                missingIngredients.push(recipe[i]);
            }

            // if (pantry.indexOf(recipe[i]) === -1) {
            //     missingIngredients.push(recipe[i]);
            // }
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

    getData("chicken,potato");

    $("body").on("click", "#readMore", function() {
        console.log("press press");
        $(this.parentElement).data("id");
    });

// This js is for index.html
// This js is for index.html
// This js is for index.html

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
 
    $(".searchDeleteButton").hide();
    var database = firebase.database();
    var pantry = [];
    var addToMainPantryPage = [];

    displayPantryItemsOnPage(pantry);

 function displayPantryItemsOnPage(pantry) {
    database.ref().on("value", function(snapshot) {
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
    });
  }

  $(document).on("click", ".pantryItemHere", function(){
    if ( $(".pantryItemHere").is(":checked") === true ) { $(".searchDeleteButton").fadeIn(); }
    else if ( $(".pantryItemHere").is(":checked") === false ) { $(".searchDeleteButton").fadeOut(); }
  });
// End of js for index.html
// End of js for index.html
// End of js for index.html



// This js is for pantry.html
// This js is for pantry.html
// This js is for pantry.html

  // Sets inital variables
  var database = firebase.database();
  var coldStorage = ["Butter", "Cheddar Cheese", "Cream Cheese", "Eggs", "Milk", "Sour Cream", "Whipping Cream", "Yogurt"];
  var meatStorage = ["Bacon", "Chicken", "Ground Beef", "Ground Turkey", "Ham", "Pork Loin", "Ribeye", "Ribs", "Rump Roast"];
  var produceStorage = ["Broccoli", "Cauliflower", "Carrot", "Corn", "Cucumber", "Lettuce", "Onion", "Potato", "Tomato", ];
  var dryGoodsStorage = ["Bread", "Chocolate", "Olive Oil", "Peanut Butter", "Rice", "Salmon", "Soy Sauce", "Tuna Fish", "Vegetable Oil", "Vinegar", "Wine"];
  var spiceStorage = ["Bay Leaf", "Basil", "Brown Sugar", "Flour", "Garlic", "Ginger", "Mint", "Paprika", "Pepper", "Salt", "Sugar", "Vanilla Extract"];
  var pantry = [];
  var addToPandorasPantry = [];

  // This runs whenevr a box(es) is clicked and when they are unclicked
  $(document).on("click", ".pantryItemClicked", function(){
    if ( $(".pantryItemClicked").is(":checked") === true ) { $(".addToPantryButton").fadeIn(); }
    else if ( $(".pantryItemClicked").is(":checked") === false ) { $(".addToPantryButton").fadeOut(); }
  });

  $(".addToPantryButton").hide();

displayPandorasPantry(pantry);

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
    
      // This tests to make sure there is something in the firebase.
      if ( snapshot.child("pantry").exists() ) {
        $(".itemGoods2").empty();
        addToPandorasPantry = snapshot.val().pantry;
        addToPandorasPantry = addToPandorasPantry.sort();
         
        for (var j = 0; j < addToPandorasPantry.length; j++) {
          var parent2 = $("#pandorasPantryItems");
          var checkbox2 = $("<div>")
          var label2 = $("<label>");
          $(label2).css({"line-height":"25px","font-size":"1rem"});
          $(label2).text(addToPandorasPantry[j]);
          $(checkbox2).append(label2);
          $(parent2).append(checkbox2);
        }
      }
      else {  
          addToPandorasPantry = [];
          arrIngred = []; }
          $(".itemGoods").empty();
          displayColdStorage(coldStorage);
          displayMeatStorage(meatStorage);
          displayProduceStorage(produceStorage);
          displayDryGoodsStorage(dryGoodsStorage);
          displaySpiceStorage(spiceStorage);
    });
  }

// This runs when the user selects some items and presses the "Add to My Pantry" button.
// Might add a modal later on if the user does not select anything.
$("#addToMyPantry").on("click", function(event) {
    goIntoPantry();
});

  // This displays the storage items on the right-hand side of the page.
  // If a pantry item is on the left, then it will not show up on the right.
  function displayColdStorage(coldStorage) {
    var parent = $("#coldStorageItems");
    for (var i = 0; i < coldStorage.length; i++) {
      if( $.inArray(coldStorage[i], addToPandorasPantry) !== -1 ) {}
      else {
        var checkbox = $("<div>");
        var input = $("<input>");
        $(input).attr("type", "checkbox");
        $(input).attr("id", "item" + i);
        $(input).addClass("pantryItemClicked");
        $(input).attr("name", coldStorage[i]);
        var label = $("<label>");
        $(label).attr("for", "item" + i);
        $(label).text(coldStorage[i]);
        $(checkbox).append(input);
        $(checkbox).append(label);
        $(parent).append(checkbox); }
    }
  };

  function displayMeatStorage(meatStorage) {
    var parent = $("#meatStorageItems");
    for (var i = 20; i < (meatStorage.length+20); i++) {
      if( $.inArray(meatStorage[i-20], addToPandorasPantry) !== -1 ) {}
      else {
        var checkbox = $("<div>");
        var input = $("<input>");
        $(input).attr("type", "checkbox");
        $(input).attr("id", "item" + i);
        $(input).addClass("pantryItemClicked");
        $(input).attr("name", meatStorage[i-20]);
        var label = $("<label>");
        $(label).attr("for", "item" + i);
        $(label).text(meatStorage[i-20]);
        $(checkbox).append(input);
        $(checkbox).append(label);
        $(parent).append(checkbox); }
    }
  };

  function displayProduceStorage(produceStorage) {
    var parent = $("#produceStorageItems");
    for (var i = 40; i < (produceStorage.length+40); i++) {
      if( $.inArray(produceStorage[i-40], addToPandorasPantry) !== -1 ) {}
      else {
        var checkbox = $("<div>");
        var input = $("<input>");
        $(input).attr("type", "checkbox");
        $(input).attr("id", "item" + i);
        $(input).addClass("pantryItemClicked");
        $(input).attr("name", produceStorage[i-40]);
        var label = $("<label>");
        $(label).attr("for", "item" + i);
        $(label).text(produceStorage[i-40]);
        $(checkbox).append(input);
        $(checkbox).append(label);
        $(parent).append(checkbox); }
    }
  };

  function displayDryGoodsStorage(dryGoodsStorage) {
    var parent = $("#dryGoodsStorageItems");
    for (var i = 60; i < (dryGoodsStorage.length+60); i++) {
      if( $.inArray(dryGoodsStorage[i-60], addToPandorasPantry) !== -1 ) {}
      else {
        var checkbox = $("<div>");
        var input = $("<input>");
        $(input).attr("type", "checkbox");
        $(input).attr("id", "item" + i);
        $(input).addClass("pantryItemClicked");
        $(input).attr("name", dryGoodsStorage[i-60]);
        var label = $("<label>");
        $(label).attr("for", "item" + i);
        $(label).text(dryGoodsStorage[i-60]);
        $(checkbox).append(input);
        $(checkbox).append(label);
        $(parent).append(checkbox); }
    }
  };

  function displaySpiceStorage(spiceStorage) {
    var parent = $("#spiceStorageItems");
    for (var i = 80; i < (spiceStorage.length+80); i++) {
      if( $.inArray(spiceStorage[i-80], addToPandorasPantry) !== -1 ) {}
      else {
        var checkbox = $("<div>");
        var input = $("<input>");
        $(input).attr("type", "checkbox");
        $(input).attr("id", "item" + i);
        $(input).addClass("pantryItemClicked");
        $(input).attr("name", spiceStorage[i-80]);
        var label = $("<label>");
        $(label).attr("for", "item" + i);
        $(label).text(spiceStorage[i-80]);
        $(checkbox).append(input);
        $(checkbox).append(label);
        $(parent).append(checkbox); }
    }
  };
// End of js for pantry.html
// End of js for pantry.html
// End of js for pantry.html

});
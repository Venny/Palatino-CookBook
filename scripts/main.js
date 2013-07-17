(function ($) {  //ako bude optimizirano za druga biblioteka, a ne jQuery

$(document).ready(function () {
    $('#add-btn').on('click', onAddRecipeBtnClick);
    $('#ingredients-btn').on('click', onAvailableIngredBtnClick);
});

    // Main functions in the section navigation   
function onAddRecipeBtnClick() {
    document.getElementById('welcome-content').style.display = 'none';
    document.getElementById('avail-ingredients').style.display = 'none';
    document.getElementById('add-recipes-form').style.display = 'block';
    document.getElementById('add-btn').style.color = '#f77d23';
    document.getElementById('ingredients-btn').style.color = '#343434';

    $('#add-ingr-btn').on('click', onAddAnotherIngrBtnClick);
    $('#add-recipe-btn').on('click', onSaveRecipeBtnClick);
    $('#dellete-row').on('click', delleteRowBtnClick);
    messageDelletion();
    $('#recipes-message').html('');
};
function onAvailableIngredBtnClick() {
    document.getElementById("welcome-content").style.display = "none";
    document.getElementById("add-recipes-form").style.display = "none";
    document.getElementById("avail-ingredients").style.display = "block";
    document.getElementById("ingredients-btn").style.color = "#f77d23";
    document.getElementById("add-btn").style.color = "#343434";   
    $('#ingredient-btn').on('click', onAddIngredBtnClick);  
   // messageDelletion();
    showAvailingredients();
    $('#ingredients-ul a').on('click', onIngredientLiBtnClick);
};
    // End main functions





    // Detailed functionality
var counter = 4;
function onAddAnotherIngrBtnClick(e){
    $('#ingerdient-3').after('<span class="del-row"><br/>' +
                                    '<label for="ingerdient' + counter + '">' + 'Ingredient:' + '</label>' +
                                    '<input type="text" id="ingerdient-' + counter + '" />'+
                             '</span>');
    console.log(counter);
    counter += 1;   
    e.preventDefault();

};
var ingredients = [];
var recipeNum = '1';
function onSaveRecipeBtnClick(e) {
    var recipeName = $('#recipe-name').val();
    //console.log(typeof (recipeName));
    for (var i = 1; i <= 50; i++) {
        var ingredient = $('#ingerdient-' + i).val();
        if (validationFunc(ingredient)) {
            ingredients.push(ingredient);
            console.log(ingredients);
        }
    }
    if (validationFunc(recipeName) == false || ingredients.length <= 3) {
        $('#message-div').html('<span>Please enter a recipe name and at least 3 gredients!</span>');
        return false;
        e.preventDefault();
    }

    var finishedRecipe = {
            recipeName: recipeName,
            ingredients: ingredients
        }
    //console.log(finishedRecipe);

    //get the number for the recipes' names
    var resultRecipeNum = localStorageNum('recipeNumber', recipeNum);
    
    // Put the object into storage
    window.localStorage.setItem('recipe-' + resultRecipeNum, JSON.stringify(finishedRecipe));

    //console.log(localStorage);
    //console.log(resultRecipeNum);

    resultRecipeNum += 1;
    window.localStorage.setItem('recipeNumber', resultRecipeNum);
    $('#add-recipes-form input').val('');
    $('#message-div').html('Ready! Add another recipe. :)');
};



function onAddIngredBtnClick() {
    var availIngred = $('#ingredient-input').val();
    
    if (validationFunc(availIngred) === false) {
        $('#recipes-message').html('<span>Please enter an ingredient!</span>');
        return false;
    }
    else if (repeatedIngredient(availIngred) == false) {
        return false;
    }
    else {
        $('#recipes-message').html('');
    }
    //get the number for the recipes' names
    var availIngredNum = localStorageNum('ingredNumber', recipeNum);

    // Put the object into storage
    window.localStorage.setItem('availIngredient-' + availIngredNum, availIngred);

        console.log(localStorage);
        console.log(availIngredNum);

        availIngredNum += 1;
        window.localStorage.setItem('ingredNumber', availIngredNum);

        $('#ingredient-input').val('');
        console.log(availIngred);
        showAvailingredients();
        $('#ingredients-ul a').on('click', onIngredientLiBtnClick);
        $('#recipes-message').html('');
};
    // End detailed functionality



    // Validate it
function validationFunc(data) {
    if (data) {
        return true;
    }
    else {
        return false;
    }
}
function repeatedIngredient(data) {
    var localStorageKeys = Object.keys(localStorage),
        allThings = '';
    for (var key in localStorage) {
        allThings = localStorage.getItem(key);
       // console.log(allThings + ' the product')
        if (allThings == data) {
            $('#recipes-message').html('<span>We already have this ingredient!</span>');
            return false;
        }
    }
}

    //Helpful functions
function messageDelletion() {
    $('#message-div').html('');
}
function localStorageNum(key, number) {

    //one storage for the unique key/ integer for the recipes' names
    if (!window.localStorage.getItem(key)) {
        window.localStorage.setItem(key, number);
    };
    var result = parseInt(window.localStorage.getItem(key));
    //console.log('first: ' + result);
    return result;
}
function delleteRowBtnClick() {
    $('.del-row').remove();
}
function showAvailingredients() {
    var counter = 1,
        HTMLstarter = '<h3>Available ingredients</h3>'+'<ul id="ingredients-ul">',
        fullHTML = '';
    var localStorageKeys = Object.keys(localStorage),
        i = 0;
    for (i = 0; i <= localStorageKeys.length - 1; i++) {
        for (counter = 1; counter < localStorageKeys.length; counter++) {
            if (localStorageKeys[i] == 'availIngredient-' + counter) {
                var theIngredient = localStorage.getItem(localStorageKeys[i]);
                fullHTML += '<li><a href="#" data-ingredient="' + theIngredient + '" >' + theIngredient + '</a></li>';
                //console.log(localStorageKeys[i] + ' the number:' + counter); 
                counter++;
            }
            //else {
            //    console.log('Another key: ' + localStorageKeys[i]);
            //    console.log(counter);
            //}
        }
    }
    $('#message-div').html(HTMLstarter + fullHTML + '</ul>');
}
function onIngredientLiBtnClick() {
    var myData = $(this).data('ingredient');
    console.log(myData);
    ingredientSearchResult(myData);
}
function ingredientSearchResult(data) {
    var HTMLText = '<dl>';
    var localStorageKeys = Object.keys(localStorage);
    for (var i = 0; i <= localStorageKeys.length - 1; i++) {
      for (var counter = 1; counter < localStorageKeys.length; counter++) {
            if (localStorageKeys[i] == 'recipe-' + counter) {
                var theRecipe = JSON.parse(localStorage.getItem(localStorageKeys[i]));
                var recipeIngredients = theRecipe.ingredients;
                for (var n = 0; n < recipeIngredients.length; n++) {
                    if (data == recipeIngredients[n]) {
                        console.log(theRecipe);
                        HTMLText += '<dt>' + theRecipe.recipeName + '</dt>' +
                                    '<dd>' + theRecipe.ingredients + '</dd><br/>';
                    }
                }
              counter++;
            }
        }
    }
    var finshedHTML = HTMLText + '</dl>';
    $('#recipes-message').html(finshedHTML);
}

})(jQuery);

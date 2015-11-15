// enable to button to click to add ingredients
$(function()
{
    $("#add_ingredient").click
    (
        function()
        {
            $("#ingredients").append("<li><input type = 'text'></input></li>")
        }
    )
}
);

// this performs the query to the Yummly API found here:
// yummly.developer.com
// the query is then sent to the next function for processing
var performQuery = function(query)
{
    try
    {
        $.ajax
        (
            {   
                type: "GET",
                url: query,
                crossDomain: true,
                dataType: "jsonp",
                jsonp: false,
            }
        );
    }
    catch (e)
    {
        console.log(e.description);
    }
}

// handle the submit request by the user
$(function()
{
    $("#submit").click
    (
        function()
        {
            var ingredients = $("#ingredients input")

            if(ingredients.length == 0)
            {
                alert("You can't search for nothing")
                return;
            }

            // the is the beginning of the query, but then we fill in the rest below
            var query = "http://api.yummly.com/v1/api/recipes?_app_id=4fb49314&_app_key=cc68ac71faebcc031f377518b6f28ba2&callback=processData&requirePictures=true"

            // add the ingredients that user is searching for
            var empty_ingredients = false
            for(var i = 0; i < ingredients.length; i ++)
            {
                if(ingredients[i].value == "")
                {
                    alert("You can't search for nothing")
                    return;
                }
                // don't want to search for 'dinner' as an ingredients
                if(ingredients.type = "text")
                {
                    if(ingredients.value == "")
                    {
                        empty_ingredients = true;
                    }
                    query += "&allowedIngredient[]=" + ingredients[i].value
                }
            }

            // add the course that the user searching for
            var courses = ["breakfast", "lunch_snack", "dinner", "drinks"]
            for(var i = 0; i < courses.length; i ++)
            {
                if($('#' + courses[i]).is(':checked'))
                {
                    query += "&allowedCourse[]=course^course-" + courses[i]
                }
            }

            // console.log(query)
            var response = performQuery(query)
        }
    )   
}
);

// give ability to restart the process
$(function()
{
    $("#refresh").click
    (
        function()
        {
            location.reload()
        }
    )
}
);

var request_data = undefined
var index = 0;

var processData = function(data)
{
    request_data = data;

    if(data.matches.length == 0)
    {
        alert("No recipes found");
        location.reload();
    }

    processRecipe(index);
}

var currentRecipe = undefined;

// loads recipe and displays their information
var processRecipe = function(index)
{

    if(index >= request_data.matches.length)
    {
        alert("No more recipes found");
        return;
    }
    // load the article titles and fade out the search bar
    $("#input, #title, #recipe").fadeOut(500);

    setTimeout(function()
    {
        recipe.innerHTML = '';

        var recipe_data = request_data.matches[index];
        currentRecipe = recipe_data;
        // console.log(recipe_data);

        // create the recipe wrapper
        var recipe_info = document.createElement("div");
        recipe_info.className = "col s12";
        var recipe_title = document.createElement("h5");
        recipe_title.textContent = recipe_data.recipeName;

        // add the ingredient wrapper
        var ingredient_list = document.createElement("ol");
        ingredient_list.id = "ingredients";
        ingredient_list.textContent = "Ingredients";

        // add an image of the recipe
        var recipe_image = document.createElement("img");
        var image_url = recipe_data.smallImageUrls[0].substring(0, recipe_data.smallImageUrls[0].length - 4);
        recipe_image.src = image_url + '=s500';

        // add the actual ingredients
        for(var i = 0; i < recipe_data.ingredients.length; i ++)
        {
            var a = document.createElement("li");
            a.textContent = recipe_data.ingredients[i];
            ingredient_list.appendChild(a)
        }

        // append actual information to the document itself
        recipe_info.appendChild(recipe_title);
        recipe_info.appendChild(recipe_image);
        recipe_info.appendChild(ingredient_list);  
        recipe.appendChild(recipe_info);

        if(index > 0)
        {
            $("#recipe").append("<a class = 'btn green' id = 'prev'>Previous</a> ");
            // give the ability to get a previous recipe
            $("#prev").click
            (
                function()
                {
                    index -= 1
                    processRecipe(index)
                }
            );
        }
        
        if(index < request_data.matches.length - 1)
        {
            $("#recipe").append("<a class = 'btn green' id = 'next'>Next</a>");
            // give the ability to get a next recipe
            $("#next").click
            (
                function()
                {
                    index += 1
                    processRecipe(index)
                }
            );
        }

        // share button
        $("#recipe").append("<br /><a class = 'btn blue' id = 'share'><i class='material-icons left'>comment</i>Share</a><br />");

        // give ability to share the recipe
        $(function()
        {
            $("#share").click
            (
                function()
                {
                    var ingredient_query = "";

                    for(var i = 0; i < recipe_data.ingredients.length; i ++)
                    {
                        ingredient_query += "&ingredients=" + recipe_data.ingredients[i];
                    }

                    $.ajax({
                        url : "/recipes/" + recipe_data.recipeName
                                          + "/" + ingredient_query
                                          + "&image_url=" + escape(image_url),
                        type: 'POST',

                        dataType: "json",
                        contentType: 'application/json',
                        data: currentRecipe,

                        success: function(result)
                        {
                            alert(result.status);
                        },
                        error: function(xhr, message, statusText)
                        {
                            console.error(xhr);
                            console.error(message);
                            console.error(something);
                        }

                    });
                }
            )
        }
        );

    }, 500)

    $("#recipe").fadeIn();
    setTimeout(
        function()
        {
            $("#recipe").prepend("<h2>What about this?</h2>")
        }, 
        550
    );
}
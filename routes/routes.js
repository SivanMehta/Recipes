var querystring = require('querystring');

var saved_recipes = {};

exports.init = function(app)
{
    app.get("/", landing);
    app.get("/recipes", recipes);
    app.get("/search", search);
    app.post("/recipes/*", process_search);
}

landing = function(request, response)
{
    response.render("index");
}

recipes = function(request, response)
{
    response.render("recipes");
}

search = function(request, response)
{
    response.render("search");
}

process_search = function(request, response)
{
    // need to respond with JSON, so we return an object with the 
    // status of the request and a link to the saved recipe

    var recipe_data = querystring.parse(request.url);
    var recipe_name = NaN;
    var keys = Object.keys(recipe_data)
    for(var i = 0; i < keys.length; i++)
    {
        if(keys[i].indexOf("/recipes") != -1)
        {
            console.log(keys[i]);
            recipe_name = keys[i];
        }
    }

    saved_recipes[recipe_name] = {ingredients: recipe_data.ingredients, 
                                  image_url: recipe_data.image_url};

    console.log(saved_recipes);

    response.json({status: "succeeded!"});
}
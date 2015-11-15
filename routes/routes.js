var querystring = require('querystring');

var saved_recipes = {};

exports.init = function(app)
{
    app.get("/", landing);
    app.get("/recipes", recipe_list);
    app.get("/saved/:recipe_title", recipe)
    app.get("/search", search);
    app.post("/recipes/*", process_search);
}

landing = function(request, response)
{
    response.render("index");
}

recipe_list = function(request, response)
{
    response.render("recipes", {recipes: saved_recipes});
}

recipe = function(request, response)
{
    response.render("index");
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


    response.json({status: "succeeded!"});
}
var querystring = require('querystring');

var saved_recipes = {};

exports.init = function(app)
{
    app.get("/", landing);
    app.get("/recipes", recipes);
    app.get("/search", search);
    app.post("/recipes/:recipe_name/:ingredients?", process_search);
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
    saved_recipes[request.params.recipe_name] = querystring.parse(request.url).ingredients;

    console.log(saved_recipes);

    response.json({status: "succeeded!"});
}
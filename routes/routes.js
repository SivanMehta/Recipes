exports.init = function(app)
{
    app.get("/", landing);
    app.get("/search", search);
    app.get("/recipes", recipes);
}

landing = function(request, response)
{
    response.render("index");
}

search = function(request, response)
{
    response.render("search");
}

recipes = function(request, response)
{
    response.render("recipes");
}
var querystring = require('querystring');

// start with a starter recipe so we don't have to query the API on every test.
var saved_recipes = {
    "/recipes/Jamba Juice Tropical Tease Smoothie/": {
        ingredients: ["pineapple juice", "bananas", "mango", "nonfat vanilla frozen yogurt", "ice"],
        image_url: "https://lh3.googleusercontent.com/Vgm7v7D_SSgkOO-MMN8W7Niigk2Ce6s-znf-OmPYKaY9-NDe97uzuESE9FmpF134U3pk4Cd8H8OCmFzyKqnsgw=s500"
    }
};

exports.init = function(app)
{
    app.get("/", landing);
    app.get("/recipes", recipe_list);
    app.get("/recipes/:recipe_title", individual_recipe)
    app.post("/recipes/*", process_search);
    app.get("/search", search);
}

landing = function(request, response)
{
    response.render("index");
}

recipe_list = function(request, response)
{
    response.render("recipes", {recipes: saved_recipes});
}

individual_recipe = function(request, response)
{
    var parameter = '/recipes/' + request.params.recipe_title + "/";
    var recipe_data = saved_recipes[parameter];

    response.render("recipe", {recipe_data : recipe_data,
                               recipe_title: request.params.recipe_title });
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

    response.json({saved_to: recipe_name});
}
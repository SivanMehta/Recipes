exports.init = function(app)
{
    app.get("/", landing);
}

landing = function(request, response)
{
    response.render("index");
}
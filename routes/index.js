var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('marked');


//create variable for path to posts directory
var postsDir = __dirname + "/../posts/";

//read contents of posts directory
fs.readdir(postsDir, function(error, directoryContents) {
    if (error){
        throw new Error(error);
    }

    //create 'posts' object containing parsed markdown contents for each post
    var posts = directoryContents.map(function(filename) {
        var postName = filename.replace('.md', '');
        var contents = fs.readFileSync(postsDir + filename, {encoding: 'utf-8'});
        return {postName: postName, contents: marked(contents)};
    });

    //create route for index page
    router.get('/', function(request, response) {
        response.render('index', {posts:posts, title: 'all posts'})
    });

    //loop through posts object and create route to each post page
    posts.forEach(function(post) {
        router.get('/' + post.postName, function(request, response) {
            response.render('post', {postContents: post.contents})
        })
    })
})


module.exports = router;
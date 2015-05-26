var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('marked');

var postsDir = __dirname + '/../posts/';
fs.readdir(postsDir, function(error, directoryContents) {
  if (error) {
    throw new Error(error);
  }

  var posts = directoryContents.map(function(filename) {
    var postName = filename.replace('.md', '');
    var contents = fs.readFileSync(postsDir + filename, {encoding: 'utf-8'});
    return {postName: postName, contents: marked(contents)};
  });

  router.get('/', function(request, response) {
    response.render('index', {posts: posts, title: 'all posts'} )
  });

  posts.forEach(function(post) {
    router.get('/' + post.postName, function(request, response) {
      response.render('post', {postContents: post.contents});
    });
  });
});

module.exports = router;

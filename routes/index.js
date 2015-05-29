var express = require('express');
var router = express.Router();
var fs = require('fs');
var marked = require('marked');

var moment = require('moment');
moment().format();


var postsDir = __dirname + '/../posts/';
fs.readdir(postsDir, function(error, directoryContents) {
  if (error) {
    throw new Error(error);
  }

var posts = directoryContents.map(function(filename) {
    var now = moment();
    var postName = filename.replace('.md', '');
    var contents = fs.readFileSync(postsDir + filename, {encoding: 'utf-8'});
    var metaString = contents.split('---\n')[1];
    var content = contents.split('---\n')[2];
    var more = contents.split('---\n')[3];
    var lines = metaString.split('\n');
    var metaData = {};


    lines.forEach(function(line) {
      var array = line.split(': ');
      var key = array[0];
      var value = array[1];

      if(key) {
        metaData[key] = value;
      }
    });

    var timestamp = moment(metaData.date).format('X');
      // console.log(timestamp);

    return {postName: postName, contents: content, postTitle: metaData.title, postAuthor: metaData.author, postDate: metaData.date};

  });

// SORT FUNCTION HERE
posts.sort(function (var1, var2) { 
   var  a = var1.postDate, 
        b = var2.postDate;
    if (a > b)  return 1;
    if (a < b)  return -1;
    else return 0;
});

console.log(posts);

// END SORT FUNCTION


  router.get('/', function(request, response) {
    response.render('index', {posts: posts, title: 'all posts'} )
  });

  posts.forEach(function(post) {
    router.get('/' + post.postName, function(request, response) {
      response.render('post', post);
    });
  });
});

module.exports = router;

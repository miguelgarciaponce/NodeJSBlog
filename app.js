var Twig = require("twig"),
express = require('express'),
app = express();


var server = require('http').createServer(app)
, io = require('socket.io').listen(server);

server.listen(3000);


// This section is optional and used to configure twig.
app.set("twig options", {
  strict_variables: false
});

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  res.render('index.twig', {
  });
});

app.get('/blog', function(req, res){
  var MongoClient = require('mongodb').MongoClient;
  var message1 = "Funcionará?" ;
  
  MongoClient.connect("mongodb://localhost:27017/post", function(err, db) {
    if(err) { return console.dir(err); }
    message = "Connect!!!";
    
    db.collection('posts', function(err, collection) {
      collection.find().toArray(function(err, documents) {
        res.render('blog.twig', {
          message : documents
        });

        db.close();
      });
    }); 
  });


  
});

app.get('/blog/:id', function(req, res) {
  var MongoClient = require('mongodb').MongoClient;
  var message1 = "Funcionará?" ;
  
  MongoClient.connect("mongodb://localhost:27017/post", function(err, db) {
    if(err) { return console.dir(err); }
    
    db.collection('posts', function(err, collection) {
      var mongo = require('mongodb');
      var BSON = mongo.BSONPure;
      var o_id = new BSON.ObjectID(req.params.id);
      var idii = "ObjectId(\"" + req.params.id + "\")";
      console.log(o_id);
      collection.find({ "_id" : o_id }).toArray(function(err, documents) {
        console.log(documents);
        res.render('post.twig', {
          post : documents
        });

        db.close();
      });
    }); 
  });
});



app.get('/newentry', function(req, res){
  res.render('newentry.twig', {

  });
});

app.get('/tutorial', function(req, res){
  res.render('tutorial.twig', {

  });
});


io.sockets.on('connection', function (socket) {
  socket.emit('add_post', {});
  socket.on('my other event', function (data) {
    console.log(data.title);

    // Insert data in the database 
    var MongoClient = require('mongodb').MongoClient;
    var message1 = "Funcionará?" ;
    
    MongoClient.connect("mongodb://localhost:27017/post", function(err, db) {
      if(err) { return console.dir(err); }
      console.log("Connect!!!");
      
      db.collection('posts', function(err, collection) {
        collection.insert(data, {safe: true}, function(err, records){
          console.log("Record added as ");
          socket.emit('post_success', {});

        });
      
        db.close();
        }); 
    });


  });
});



console.log("Server working in http://localhost:3000");
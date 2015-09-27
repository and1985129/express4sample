var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// collection的路由
var mongo = require('mongodb');
var Connection = mongo.Connection;
var Server = mongo.Server;
var Db = mongo.Db;
var CollectionDriver = require('./collectionDriver').CollectionDriver;

var mongoHost = '127.0.0.1';
var mongoPort = 27017;
var collectionDriver;
var db = new Db('RestfulDemoDB', new Server(mongoHost, mongoPort), {safe: true});

// collectionDriver = new CollectionDriver(db);
// var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));
db.open(function(err, dbConnection){
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log('DB State: ', db._state);
  collectionDriver = new CollectionDriver(db);
});

router.get('/:collection', function(req, res, next){
  var params = req.params;
  collectionDriver.findAll(params.collection, function(error, objs){
    if (error) {
      res.send(400, error);
    } else {
      if (req.accepts('html')) {
        res.render('data', {objects: objs, collection: req.params.collection});
      } else {
        res.set('Content-Type', 'application/json');
        res.send(200, objs);
      }
    }
  });
});

// 根据collection名字查找对应内容
router.get('/:collection/:entity', function(req, res, next) { //I
   var params = req.params;
   var entity = params.entity;
   var collection = params.collection;
   if (entity) {
       collectionDriver.get(collection, entity, function(error, objs) { //J
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //K
       });
   } else {
      res.send(400, {error: 'bad url', url: req.url});
   }
});

// Post record to db
router.post('/:collection', function(req, res) { //A
  var object = req.body;
  console.log(req.body);
  var collection = req.params.collection;
  collectionDriver.save(collection, object, function(err,docs) {
    if (err) { res.send(400, err); } 
    else { res.send(201, docs); } //B
  });
});

// Update object to db
router.put('/:collection/:entity', function(req, res){
  var params = req.params;
  var entity = params.entity;
  var collection = params.collection;

  if (entity){
    collectionDriver.update(collection, req.body, entity, function(error, objs){
      if (error) {
        res.send(400, error);
      } else {
        res.send(200, objs);
      }
    });
  } else {
    var error = {'message':'Cannot PUT a whole collection'};
    res.send(400, error);
  }
});

// Delete object
router.delete('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionDriver.delete(collection, entity, function(error, objs) { //B
          if (error) { res.send(400, error); }
          else { res.send(200, objs); } //C 200 b/c includes the original doc
       });
   } else {
       var error = { "message" : "Cannot DELETE a whole collection" };
       res.send(400, error);
   }
});

module.exports = router;
// exports.users = require('./users');
// exports.device = require('./device');

// exports.index = function(req, res, next){
//   res.render('index', {title: 'Express'});
// };
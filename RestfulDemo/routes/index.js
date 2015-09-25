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

module.exports = router;
// exports.users = require('./users');
// exports.device = require('./device');

// exports.index = function(req, res, next){
//   res.render('index', {title: 'Express'});
// };
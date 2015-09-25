
var express = require('express');
var router = express.Router();

var map = {
  "1": {id: 1, name: "test"},
  "2": {id: 2, name:"test"}
};

/* GET users listing. */
router.get('/all', function(req, res, next) {
  res.set({'Content-Type':'text/json', 'Encoding':'utf8'});
  res.send(map);
});

module.exports = router;

// var map = {
//   "1": {id: 1, name: "test"},
//   "2": {id: 2, name:"test"}
// };

// exports.all = function(req, res, next){
//   res.set({'Content-Type':'text/json', 'Encoding':'utf8'});
//   res.send(map);
// };
var ObjectID = require('mongodb').ObjectID;
CollectionDriver = function(db){
  this.db = db;
};

// 得到collection
CollectionDriver.prototype.getCollection = function(collectionName, callback){
  this.db.collection(collectionName, function(error, the_collection){
	if (error) {
	  callback(error);
	} else {
	  callback(null, the_collection);
	}
  });
};

// 得到collection的所有内容
CollectionDriver.prototype.findAll = function(collectionName, callback){
  this.getCollection(collectionName, function(error, the_collection){
	if (error) {
	  callback(error);
	} else {
	  the_collection.find().toArray(function(error, results){
		if (error) {
		  callback(error);
		} else {
		  callback(null, results);
		}
	  });
	}
  });
};

// 获取指定collection对应id的内容
CollectionDriver.prototype.get = function(collectionName, id, callback) { //A
  this.getCollection(collectionName, function(error, the_collection) {
    if (error) {
	  callback(error);
	} else {
      var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B
      if (!checkForHexRegExp.test(id)) {
		callback({error: "invalid id"});
	  } else {
		the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) { //C
          if (error) {
			callback(error);
		  } else {
			callback(null, doc);
          }
        });
	  }
	}
  });
};

// Save new object
CollectionDriver.prototype.save = function(collectionName, obj, callback){
  this.getCollection(collectionName, function(error, the_collection){
	if (error) {
	  callback(error);
	} else {
	  obj.created_at = new Date();
	  the_collection.insert(obj, function(){
		callback(null, obj);
	  });
	}
  });
};

// Update object
CollectionDriver.prototype.update = function(collectionName, obj, entityId, callback){
  this.getCollection(collectionName, function(error, the_collection){
	if (error) {
	  callback(error);
	} else {
	  obj._id = ObjectID(entityId);
	  obj.update_at = new Date();
	  the_collection.save(obj, function(error, doc){
		if (error) {
		  callback(error);
		} else {
		  callback(null, obj);
		}
	  });
	}
  });
};

// Delete object
CollectionDriver.prototype.delete = function(collectionName, entityId, callback){
  this.getCollection(collectionName, function(error, the_collection){
	if (error) {
	  callback(error);
	} else {
	  the_collection.remove({'_id':ObjectID(entityId)}, function(error, doc){
		if (error) {
		  callback(error);
		} else {
		  callback(null, doc);
		}
	  });
	}
  });
};

exports.CollectionDriver = CollectionDriver;
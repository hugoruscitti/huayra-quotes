import Ember from 'ember';

var gui = require('nw.gui');
var path = require('path');
var fse = require('fs-extra');

var db_path = path.join('./', 'data', 'db.json');

export default Ember.Service.extend({
  db: null,
  index_collection: null,
  error: "",

  init: function() {
    var loki = require('lokijs');
    var db = new loki('data/db.json');

    db.loadDatabase({}, () => {
      var index_collection = db.getCollection("index");
      this.set('db', db);
      this.set('index_collection', index_collection);
    });

  },

  search: function(q) {
    return new Ember.RSVP.Promise((resolve) => {
      var regex = new RegExp(q, 'i');

      var data = this.get('index_collection').find({title: {$regex: regex}});

      var array = Ember.A();

      data.forEach((d) => {
        array.pushObject(d);
      });

      resolve(array);

    });
  },

  getById: function(id) {

    return new Ember.RSVP.Promise((resolve) => {
      var data = this.get('index_collection').find({id: id});

      if (data.length > 0) {
          resolve(data[0]);
      }

    });

  },

  getByCategory: function(category) {
    return new Ember.RSVP.Promise((resolve) => {
      var data = this.get('index_collection').find({category: category});
      var array = Ember.A();

      data.forEach((d) => {
        array.pushObject(d);
      });

      resolve(array);
    });
  }


});

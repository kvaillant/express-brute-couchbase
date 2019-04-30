var AbstractClientStore = require('express-brute/lib/AbstractClientStore'),
    couchbase = require('couchbase'),
    _ = require('underscore');

var CouchbaseStore = module.exports = function (couchoptions, options) {
    AbstractClientStore.apply(this, arguments);
    this.options = _.extend({}, CouchbaseStore.defaults, options);
    this.couchbaseOptions = _.extend({}, CouchbaseStore.bucketdefaults, couchoptions);

    var cluster = new couchbase.Cluster(this.couchbaseOptions.cluster);
    if (this.couchbaseOptions.username) {
        cluster.authenticate(this.couchbaseOptions.username, this.couchbaseOptions.password);
        this.client = cluster.openBucket(this.couchbaseOptions.bucket);
    } else {
        this.client = cluster.openBucket(this.couchbaseOptions.bucket, this.couchbaseOptions.password);
    }
};

CouchbaseStore.prototype = Object.create(AbstractClientStore.prototype);

CouchbaseStore.prototype.set = function (key, value, lifetime, callback) {
    this.client.upsert(this.options.prefix + key, value, { expiry: lifetime || 0 }, function (err, data) {
        typeof callback == 'function' && callback.apply(this, arguments);
    });
};
CouchbaseStore.prototype.get = function (key, callback) {
    this.client.get(this.options.prefix + key, function (err, data) {
        if (err && err.code != 13) { // Key not found
            typeof callback == 'function' && callback(err, null);
        } else {
            if (data) {
                data = data.value;
                data.lastRequest = new Date(data.lastRequest);
                data.firstRequest = new Date(data.firstRequest);
            }
            typeof callback == 'function' && callback(null, data);
        }
    });
};
CouchbaseStore.prototype.reset = function (key, callback) {
    this.client.remove(this.options.prefix + key, function (err, data) {
        typeof callback == 'function' && callback.apply(this, arguments);
    });
};
CouchbaseStore.defaults = {
    prefix: ''
};
CouchbaseStore.bucketdefaults = {
    cluster: 'http://localhost:8091',
    bucket: 'express-brute-store',
    password: ''
};

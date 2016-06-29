# express-brute-couchbase
=======================

A Couchbase store for [express-brute](https://github.com/AdamPflug/express-brute)

Installation
------------
  via npm:

      $ npm install express-brute-couchbase

Usage
-----
``` js
var ExpressBrute = require('express-brute'),
	CouchbaseStore = require('express-brute-couchbase');

var store = new CouchbaseStore('http://127.0.0.1:8091');
var bruteforce = new ExpressBrute(store);

app.post('/auth',
	bruteforce.prevent, // error 403 if we hit this route too often
	function (req, res, next) {
		res.send('Success!');
	}
);
```

Options
-------
- `host` Couchbase cluster options for couchnode constructor, is json. default : ({
  cluster: 'http://localhost:8091',
  bucket: 'express-brute-store',
  password: ''
})
- `options`
	- `prefix`       An optional prefix for each couchbase key, in case you are sharing
	                 your couchbase servers with something generating its own keys.



For details see [couchnode](https://github.com/couchbase/couchnode).

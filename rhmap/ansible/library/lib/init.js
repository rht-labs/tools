'use strict';
var fs = require('fs');
var fhc = require(process.env.FHMODULE_HOME+'/node_modules/fh-fhc');
var utils = require(process.env.FHMODULE_HOME+'/lib/utils.js');

// get arguments passed in by file, e.g. action=target target=http://ps-consult-na.redhat.feedhenry.com/
// return an object e.g. {action: 'target', target: 'http://ps-consult-na.redhat.feedhenry.com/'}
exports.getArgs = function(cb){

	fs.readFile(process.argv[2], 'utf8', function (err,data) {
	     // do we need to catch err? 
	  //console.log(data)  
	  if (err){
	    cb("Unable to load arguments", null);
	  } else {
	    var args = {};
	    if (data){
	      data.split(' ').forEach(function(x){
	        var arr = x.split('=');
	        arr[1] && (args[arr[0]] = utils.stripString(arr[1]));
	      });
	    }
	    cb(null, args);

	    
	  }
	  
	});
}

exports.fhLoad = function(cb){
	fhc.load(function(err){
      if (err){
           cb("Unable to perform fhc.load", null);
      } else {
      	   cb(null, true)
      }   // FHC started up OK - we can now perform commands
	});
}
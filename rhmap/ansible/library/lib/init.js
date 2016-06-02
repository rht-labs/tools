'use strict';
var fs = require('fs');
var fhc = require(process.env.FHMODULE_HOME+'/node_modules/fh-fhc');
var utils = require(process.env.FHMODULE_HOME+'/lib/utils.js');
const argsReg = /(\b\w+)=(.*?(?=\s\w+=|$))/g;
// get arguments passed in by file, e.g. action=target target=http://ps-consult-na.redhat.feedhenry.com/
// return an object e.g. {action: 'target', target: 'http://ps-consult-na.redhat.feedhenry.com/'}
exports.getArgs = function(cb){
	fs.readFile(process.argv[2], 'utf8', function (err,data) {  
	  if (err){
	    cb("Unable to load arguments", null);
	  } else {
	    var args = {};
	    var matching;
	    if (data){
	    	while((matching = argsReg.exec(data)) != null) {
                args[matching[1]] = utils.stripString(matching[2]);
            }
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
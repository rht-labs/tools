'use strict';
var fhc = require('../node_modules/fh-fhc');
function createEnvironment(args, cb){
  //['admin', 'environments', 'create', '--id='+MBaaSNameEnv, '--label='+MBaaSNameEnv, '--targets='+MBaaSName]
  if (!args['mbaasName'] || !args['environment']){
  	return cb({err: "Missing argument"}, false);
  }
  var mbaasName = args['mbaasName'] + "-" + args['environment'];
  fhc.admin.environments.read({id: mbaasName}, function(err, envRead){
  	if (err){  // If the environment does not exist an error is returned from the read call.
	  fhc.admin.environments.create({
	    id: mbaasName, 
	    label: mbaasName, 
	    targets: mbaasName,
	  }, function(err, response){
	      if (err){
	        // Handle error
	        //console.log(err)
	        cb({err: err}, false);
	      } else {
	        //console.log(response)
	        cb(response, true);
	      }
	  });
  	} else {
  		//console.log(envRead)
  		if (envRead.id == mbaasName){
  			cb({id: envRead.id}, false);
  		} else {
  			cb({err: "Unknown error reading environment"}, false);
  		}
  	}
  });
}
exports.create = createEnvironment;
'use strict';
var fhc = require('../node_modules/fh-fhc');

function createEnvironment(args, cb){
  //['admin', 'environments', 'create', '--id='+MBaaSNameEnv, '--label='+MBaaSNameEnv, '--targets='+MBaaSName]
  if (!args['mbaasName']){
  	return cb({err: "Missing argument"}, false);
  }
  fhc.admin.environments.read({id: args['mbaasName']}, function(err, envRead){
  	if (err){  // If the environment does not exist an error is returned from the read call.
	  fhc.admin.environments.create({
	    id: args['mbaasName'], 
	    label: args['mbaasName'], 
	    targets:args['mbaasName'],
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
  		if (envRead.id == args['mbaasName']){
  			cb({id: envRead.id}, false);
  		} else {
  			cb({err: "Unknown error reading environment"}, false);
  		}


  	}


  });



}

exports.create = createEnvironment;
'use strict';
var fhc = require('../node_modules/fh-fhc');

function createMBaaSTarget(args, cb){
  
  if (!args['mbaasName'] || ! args['fhMbaasHost'] || !args['url'] || !args['openshiftUsername'] || !args['openshiftPassword'] || !args['routerDNSUrl']){
  	return cb({err: "Missing argument"}, false);
  }
  fhc.admin.mbaas.read({id: args['mbaasName']}, function(err, mbaasRead){
  	if (err){  // If the mbaas does not exist an error is returned from the read call.

	  fhc.admin.mbaas.create(
	  {
	    id: args['mbaasName'], 
	    type: 'openshift3', 
	    fhMbaasHost:args['fhMbaasHost'], 
	    provisionMBaaS: true, 
	    type_target: 'openshift3', 
	    url: args['url'], 
	    username: args['openshiftUsername'], 
	    password: args['openshiftPassword'], 
	    routerDNSUrl: args['routerDNSUrl'], 
	    servicekey:""
	  }, function(err, response){
	      if (err){
	        // Handle error
	        //console.log(err)
	        cb({err: err}, false);
	      } else {
	        
	        cb(response, true);

	      }
	  });


  	} else {
  		if (mbaasRead.id == args['mbaasName']){
  			cb({id: mbaasRead.id}, false);
  		} else {
  			cb({err: "Unknown error reading mbaas"}, false);
  		}


  	}


  });



}

exports.createMBaaSTarget = createMBaaSTarget;
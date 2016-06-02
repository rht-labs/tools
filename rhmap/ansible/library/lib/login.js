'use strict';
var fhc = require('../node_modules/fh-fhc');

function doLogin(username, password, cb){
	//console.log(fhc);
	fhc.user({},function(err, currentUser){
		//console.log(currentUser);
		// if (currentUser && currentUser.displayName == username){
		// 	return cb({username: currentUser.displayName}, false);
		// }
		fhc.login( {_:[username,password]}, function(err, response){
 			if (err){
 				cb({err: err}, false)
 			}
      		if (response && response.result == 'ok'){
      			cb(response, true);
      		} else {
      			cb({err: response}, false);
      		}
      
    	});
	})

}


exports.doLogin = doLogin;
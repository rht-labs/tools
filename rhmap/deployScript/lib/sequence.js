
var fhCalls = require('./fhCalls.js'),
openshiftcalls = require('./openshiftcalls.js'),
async= require('async'),
configProvider = require('../config.js');

function createMBaaSes(){
	return function(cb){ 
		var projectArray = [];
		var MBaaSName;	
		var success;
		var config = configProvider.getConfig();
	
		if (!config || !config.project || !config.project.environments || !config.project.name || typeof config.project.environments !== 'object' || !config.project.environments.length > 0){
			
			return cb('Invalid config.project object');
		}

		config.project.environments.forEach(function(environment){
			MBaaSName = config.project.name+"-"+environment;
			projectArray.push(openshiftcalls.createOpenshiftProject(MBaaSName));
			projectArray.push(openshiftcalls.createOpenshiftApp(MBaaSName));
			projectArray.push(fhCalls.createMBaaSTarget(MBaaSName));
			projectArray.push(fhCalls.createMBaaSEnvironment(MBaaSName));
		});
		async.series(projectArray, function(err, results){
			
			success = true;
			results.forEach(function(result){
				if (result && result.success !== true){
				  success = false;
				}

			});
			cb(null, {success: success});

		});
	}
	
}

exports.process= function(cb){
	var funcArray = [];
	funcArray.push(openshiftcalls.openshiftLogout());
	funcArray.push(openshiftcalls.openshiftLogin());
	funcArray.push(fhCalls.rhMAPTarget());
	funcArray.push(fhCalls.rhMAPLogin());
	funcArray.push(createMBaaSes());
	// funcArray.push(fhCalls.createRHMAPProject());
	async.series(funcArray, function(err, results){
		
		if (err){
			
			cb(err, null)
		} else {
			
			success = true;
			results.forEach(function(result){
				if (!result || result.success !== true){
				  success = false;
				}

			});
			cb(null, {success: success});
			
		}
	})

}
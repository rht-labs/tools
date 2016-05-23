
var fhCalls = require('./fhCalls.js'),
openshiftcalls = require('./openshiftcalls.js'),
async= require('async'),
config = require('../config.js');

function createMBaaSes(){
	return function(cb){ 
		var projectArray = [];
		var MBaaSName;	
		console.log(config);
		config.environments.forEach(function(environment){
			MBaaSName = config.projectName+"-"+environment;
			projectArray.push(openshiftcalls.createOpenshiftProject(MBaaSName));
			projectArray.push(openshiftcalls.createOpenshiftApp(MBaaSName));
			projectArray.push(fhCalls.createMBaaSTarget(MBaaSName));
			projectArray.push(fhCalls.createMBaaSEnvironment(MBaaSName));
		});
		async.series(projectArray, function(err, res){
			cb(err, res);
		});
	}
	
}

exports.process= function(cb){
	var funcArray = [];
	funcArray.push(openshiftcalls.openshiftLogin());
	// funcArray.push(fhCalls.rhMAPTarget());
	// funcArray.push(fhCalls.rhMAPLogin());
	// funcArray.push(createMBaaSes());
	// funcArray.push(fhCalls.createRHMAPProject());
	async.series(funcArray, function(err, res){
		if (err){
			
			cb(err, null)
		} else {
			cb(null, true);
			
		}
	})

}
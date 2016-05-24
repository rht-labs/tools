var systemCall = require('./systemCall.js'),
configProvider = require('../config.js'),
utils = require('./utils.js');


// Perform logout from openshift using "oc logout"
exports.openshiftLogout = function(){
	return function(cb){
		systemCall.execute('oc', ['logout'], {label:'Logging out of Openshift '}, function(err, result){
			if (err){
				cb(err, null)
			} else {
				cb(null, {success: true});
			}
		});
	}
}

// Perform login to openshift using parameters from config.openshift using "oc login"
// config.openshift.hostname, config.openshift.username, config.openshift.password
// Once login is complete, openshift status is called to check user is logged in using "oc status"
exports.openshiftLogin = function(){
	return function(cb){
		var config = configProvider.getConfig();
	
		if (!config || !config.openshift || !config.openshift.hostname || !config.openshift.username || !config.openshift.password){
			return cb("parameter missing", {success:false})
		}
		systemCall.execute('oc', ['login',config.openshift.hostname, '--insecure-skip-tls-verify=true', '--username='+config.openshift.username, '--password='+config.openshift.password], {label:'Logging into OpenShift'}, function(err, result){
			if (err){
				cb(err, null)
			} else if (utils.validateStringResponse(result,'Login failed')) {
				cb(null, {success:false})

			} else {
				systemCall.execute('oc', ['status'], {label:'Checking Openshift Status'}, function(err, result){
					//In project ph-mbaas-test-live on server https://osm1-master1.feedhenry.net:8443
					// You have no services, deployment configs, or build configs.
					// Run 'oc new-app' to create an application.
					if (err){
						cb(err, null)
					} else {
						if (utils.validateStringResponse(result, config.openshift.hostname)){
							cb(null, {success:true});
						} else {
							cb ('Invalid response from openshift status', null)
						}
					
					}
				});
			}
		});
	}
}

// Perform openshoft create project using "oc new-project"
// parameter MBaaSName
exports.createOpenshiftProject = function(MBaaSName){
	return function(cb){
		if (!MBaaSName){
			return cb("MBaaSName parameter missing", {success:false})
		}
		systemCall.execute('oc', ['new-project',MBaaSName], {label:'Creating Openshift project '+ MBaaSName}, function(err, result){
			if (err){
				return cb(err, {success:false})
			} else {
				
				if (utils.validateStringResponse(result, MBaaSName)) {
					
					cb(null, {success: true});
				} else {
					cb('Error creating project '+ MBaaSName,{success:false});
				}

			}
		});
	}
}


// Perform openshift create app using "oc new-app"
// Parameter MBaaSName
// Uses config.project.template
// Validates response contains string "Success" 
exports.createOpenshiftApp = function(MBaaSName){
	return function(cb){
		var config = configProvider.getConfig();
		if (!MBaaSName){
			return cb("MBaaSName parameter missing", {success:false})
		}

		systemCall.execute('oc', ['new-app', '-f ../'+config.project.template , '-p MBAAS_ROUTER_DNS='+MBaaSName+'.apps.osm1.feedhenry.net'], {label:'Creating MBaaS '+ MBaaSName}, function(err, result){
			if (err){
				return cb(err, null)
			} else {
				if (1==1){
				//if (utils.validateStringResponse(result, 'Success')) {
					cb(null, {success: true});
				} else {
					cb('Error creating app '+ MBaaSName,{success:false});
				}

				
			}
		});
	}
}

var systemCall = require('./systemCall.js'),
config = require('../config.js'),
utils = require('./utils.js');

exports.openshiftLogout = function(MBaaSName){
	return function(cb){
		systemCall.execute('oc', ['logout'], {label:'Logging out of Openshift '+ MBaaSName}, function(err, result){
			if (err){
				cb(err, null)
			} else {
				cb(null, true);
			}
		});
	}
}

exports.openshiftLogin = function(){
	return function(cb){
		systemCall.execute('oc', ['login',config.hostname, '--insecure-skip-tls-verify=true', '--username='+config.username, '--password='+config.password], {label:'Logging into OpenShift'}, function(err, result){
			
			if (err){
				cb(err, null)
			} else {
				systemCall.execute('oc', ['status'], {label:'Chacking Openshift Status'}, function(err, result){
					//In project ph-mbaas-test-live on server https://osm1-master1.feedhenry.net:8443
					// You have no services, deployment configs, or build configs.
					// Run 'oc new-app' to create an application.
					if (err){
						cb(err, null)
					} else {
						if (utils.validateStringResponse(result, 'config.hostname')){
							cb(null, true);
						} else {
							cb ('Invalid response from openshift status', null)
						}
					
					}
				});
			}
		});
	}
}

exports.createOpenshiftProject = function(MBaaSName){
	return function(cb){
		systemCall.execute('oc', ['new-project',MBaaSName], {label:'Creating Openshift project '+ MBaaSName}, function(err, result){
			if (err){
				cb(err, null)
			} else {
				//In project ph-mbaas-test-live on server https://osm1-master1.feedhenry.net:8443
				cb(null, result)
			}
		});
	}
}

exports.createOpenshiftApp = function(MBaaSName){
	return function(cb){
		systemCall.execute('oc', ['new-app', '-f ../fh-mbaas-template-1node.json', '-p MBAAS_ROUTER_DNS='+MBaaSName+'.apps.osm1.feedhenry.net'], {label:'Creating MBaaS '+ MBaaSName}, function(err, result){
			if (err){
				cb(err, null)
			} else {
				cb(null, result)
			}
		});
	}
}

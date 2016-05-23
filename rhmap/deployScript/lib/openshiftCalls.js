var systemCall = require('./systemCall.js'),
config = ('../config.js');

exports.openshiftLogin = function(){
	return function(cb){
		systemCall.execute('oc', ['login',config.hostname, '--insecure-skip-tls-verify=true', '--username='+config.username, '--password='+config.password], {label:'Logging into OpenShift'}, function(err, result){
			if (err){
				cb(err, null)
			} else {
				cb(null, result)
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
				cb(null, result)
			}
		});
	}
}

exports.createOpenshiftApp = function(MBaaSName){
	return function(cb){
		systemCall.execute('oc', ['new-app', '-f ./fh-mbaas-template-1node.json', '-p MBAAS_ROUTER_DNS='+MBaaSName+'.apps.osm1.feedhenry.net'], {label:'Creating MBaaS '+ MBaaSName}, function(err, result){
			if (err){
				cb(err, null)
			} else {
				cb(null, result)
			}
		});
	}
}

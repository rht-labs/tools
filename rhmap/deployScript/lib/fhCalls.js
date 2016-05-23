var systemCall = require('./systemCall.js'),
config = ('../config.js');

exports.createMBaaSTarget = function(MBaaSName){
	return function(cb){
		systemCall.execute('fhc', ['admin','mbaas', 'create', '--id='+MBaaSName, '--type=openshift3', '--fhMbaasHost=https://'+MBaaSName+'.apps.osm1.feedhenry.net', '--provisionMBaaS=true', '--type_target=openshift3', '--url=https://osm1-master1.feedhenry.net:8443', '--username='+ config.username, '--password='+config.password, '--routerDNSUrl=*.apps.osm1.feedhenry.net', '--servicekey=""'], {label:'Creating MBaaS Target '+ MBaaSName}, function(err, result){
			if (err){
				cb(err, null)
			} else {
				cb(null, result)
			}
		});
	}
}

exports.createMBaaSEnvironment = function(MBaaSName){
	return function(cb){
		systemCall.execute('fhc', ['admin', 'environments', 'create', '--id='+MBaaSName, '--label='+MBaaSName, '--targets='+MBaaSName], {label: 'Creating MBaaS Environment '+ MBaaSName}, function(err, result){
			if (err){
				cb(err, null)
			} else {
				cb(null, result)
			}
		});
	}
}

exports.rhMAPTarget = function(){
	return function(cb){
		systemCall.execute('fhc', ['target', config.FHDomain], {label:'Setting FHC Target'},function(err, result){
			if (err){
				cb(err, null)
			} else {
				cb(null, result)
			}
		});
	}
}

exports.rhMAPLogin = function(){
	return function(cb){
		systemCall.execute('fhc',['login', config.FHUsername, config.FHPassword], {label: 'Logging into RHMAP Core'},function(err, result){
			if (err){
				cb(err, null)
			} else {
				cb(null, result)
			}
		});
	}
}

exports.createRHMAPProject = function(){
	return function(cb){
		systemCall.execute('fhc', ['projects', 'create' ,'projectName'], {label:'Creating RH MAP Project'},function(err, result){
			if (err){
				cb(err, null)
			} else {
				cb(null, result)
			}
		});
	}
}
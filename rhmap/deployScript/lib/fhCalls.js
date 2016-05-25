var systemCall = require('./systemCall.js'),
configProvider= require('../config.js'),
utils = require('./utils.js');

exports.createMBaaSTarget = function(MBaaSName){
	return function(cb){
		var config = configProvider.getConfig();
		if (!MBaaSName){
			return cb('no MBaaSName parameter', {success: false});
		}
		if (!config || !config.openshift || !config.openshift.hostname || !config.openshift.username || !config.openshift.password || !config.openshift.port || !config.openshift.dnsUrl){
			return cb("parameter missing", {success:false})
		}
		systemCall.execute('fhc', ['admin','mbaas', 'create', '--id='+MBaaSName, '--type=openshift3', '--fhMbaasHost=https://'+MBaaSName+config.openshift.hostname, '--provisionMBaaS=true', '--type_target=openshift3', '--url=https://'+config.openshift.hostname+':'+config.openshift.port, '--username='+ config.openshift.username, '--password='+config.openshift.password, '--routerDNSUrl='+config.openshift.dnsUrl, '--servicekey=""'], {label:'Creating MBaaS Target '+ MBaaSName}, function(err, result){
			if (err){
				return cb(err, null)
			} else {
				if (utils.validateJSON(result, "_id", MBaaSName)) {
					config.deployed.MBaaS.push(MBaaSName);
					configProvider.update(config);
					cb(null, {success:true});
				} else {
					cb('Error creating MBaaS target', {success: false});
				}
				
			}
		});
	}
}

exports.createMBaaSEnvironment = function(MBaaSName){
	var MBaaSNameEnv = MBaaSName + '-env';
	return function(cb){
		var config = configProvider.getConfig();
		if (!MBaaSName){
			return cb('no MBaaSName parameter', {success: false});
		}
		systemCall.execute('fhc', ['admin', 'environments', 'create', '--id='+MBaaSNameEnv, '--label='+MBaaSNameEnv, '--targets='+MBaaSName], {label: 'Creating MBaaS Environment '+ MBaaSNameEnv}, function(err, result){
			if (err){
				cb(err, null)
			} else {
				if (1==1){
				// if (utils.validateJSON(result, "_id", MBaaSNameEnv)) {
					config.deployed.environments.push(MBaaSNameEnv);
					configProvider.update(config);
					cb(null, {success:true});
				} else {
					cb('Error creating Environment', {success: false});
				}
			}
		});
	}
}

exports.rhMAPTarget = function(){
	return function(cb){
		var config = configProvider.getConfig();
		if (!config || !config.rhmap || !config.rhmap.hostname){
			return cb('Invalid rhmap configuration', {success: false});
		}
		systemCall.execute('fhc', ['target', config.rhmap.hostname], {label:'Setting FHC Target'},function(err, result){
			if (err){
				cb(err, null)
			} else {
				//Successfully targeted: http://testing.grdryn3.skunkhenry.com/ User: testing-admin@example.com
				if (utils.validateStringResponse(result, 'Successfully targeted')) {

					cb(null, {success: true});
				} else {
					cb("Error targetting fh", {success: false});
				}
				
			}
		});
	}
}

exports.rhMAPLogin = function(){
	return function(cb){
		var config = configProvider.getConfig();
		if (!config || !config.rhmap || !config.rhmap.username || !config.rhmap.password){
			return cb('Invalid rhmap configuration', {success: false});
		}
		systemCall.execute('fhc',['login', config.rhmap.username, config.rhmap.password], {label: 'Logging into RHMAP Core'},function(err, result){
			if (err){
				cb(err, null)
			} else {
				//Successfully logged into http://testing.grdryn3.skunkhenry.com/
				if (utils.validateStringResponse(result, 'Successfully logged into')) {
					cb(null, {success: true});
				} else {
					cb("Error logging into fh", {success: false});
				}
			}
		});
	}
}

exports.createRHMAPProject = function(){
	return function(cb){
		var config = configProvider.getConfig();
		systemCall.execute('fhc', ['projects', 'create' ,'projectName'], {label:'Creating RH MAP Project'},function(err, result){
			if (err){
				cb(err, null)
			} else {
				//console.log(result)
				var projectId = utils.getJSONProperty(result, 'guid');

				if (projectId) {
					config.deployed.projectId = projectId;
					configProvider.update(config);
					cb(null, {success:true});
				} else {
					cb('Error creating project', {success: false});
				}

			}
		});
	}
}

exports.createRHMAPTeam = function(){
	return function(cb){
		var config = configProvider.getConfig();
		var teamConfig = {
			"name": config.project.name + 'developer',
			"code": config.project.name + 'developer',
			"desc": config.project.name + 'developer team',
			"perms": {
				"cluster/reseller/customer/domain/service":"write",
				"cluster/reseller/customer/domain/project":"write"
			},
			"users": [],
			"business-objects":{
				"cluster/reseller/customer/domain/project":[
					config.deployed.projectId
				],
				"cluster":[
					"sam1-core"
				],
				"cluster/reseller":[
					"6Oz0VqOQoT5KDG5Fj_0c_DXN"
				],
				"cluster/reseller/customer":[
					"IlV_eqt_AArFNGB-KSr0oZ9F"
				],
				"cluster/reseller/customer/domain":[
					"v5cu7xtd7abtig5yyproaozc"
				],
				"cluster/reseller/customer/domain/admin/environment":
					config.deployed.environments,
				"cluster/reseller/customer/domain/admin":[
					"*"
				],
				"cluster/reseller/customer/domain/admin/mbaas-target":
					config.deployed.MBaaS
			}
		}
		console.log(teamConfig);
		//cb(null, {success:true});
		systemCall.execute('fhc', ['admin', 'teams', 'create', '--team='+JSON.stringify(teamConfig) ], {label:'Creating RH MAP Team'},function(err, result){
			console.log(result);
			if (err){
				cb(err, null)
			} else {
				var teamId = utils.getJSONProperty(result, '_id');
				config.deployed.teamId = teamId;
				cb(null, {success:true})
			}
		});
	}
}

exports.createRHUser = function(){
	return function(cb){
		var config = configProvider.getConfig();
		systemCall.execute('fhc', ['admin-users', 'create' ], {label:'Creating RH MAP User'},function(err, result){
			console.log(result);
			if (err){
				cb(err, null)
			} else {
				var teamId = utils.getJSONProperty(result, '_id');
				config.deployed.teamId = teamId;
				cb(null, {success:true})
			}
		});
	}


}




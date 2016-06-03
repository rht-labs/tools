'use strict'
var config = require('../config.js').getConfig();
var proxyquire = require('proxyquire');

var systemCallProxy = {
	execute: function(command, args, options, cb){
		//console.log(typeof args);
		if (command == 'oc' && args && typeof args == 'object' ) {
			if (args[0] == 'logout') {
				cb(null, 'Logged "test" out on "https://osm1-master1.xxxx.net:8443"');
			}
			if (args[0] == 'status') {
				//console.log('Calling status')
				cb(null, 'In project ph-mbaas-test-live on server https://osm1-master1.xxxxx.net:8443\nYou have no services, deployment configs, or build configs.\nRun \'oc new-app\' to create an application.');
			}

			if (args[0] == 'login'){
				//console.log(args)
				if (args[3] == '--username=test' && args[1] == 'osm1-master1.xxxx.net') {
					cb(null, 'Login successful.\nYou have access to the following projects and can switch between them with');
				} else {
					cb(null, 'Login failed (401 Unauthorized)');
				}
			}

			if(args[0] == 'new-project'){
				cb(null, 'In project ' + args[1] +' on server https://osm1-master1.xxxx.net:8443');
			}

			if(args[0] == 'new-app'){
				cb(null, 'Success');
			}
		}
	}
}

var badConfigUsername = {
	getConfig : function(){
	return {
			openshift : {
				hostname : 'osm1-master1.xxxx.net',
				username : 'invalid',
				password : 'xxxx'

			}
		}
	}
}
var badConfigHostname = {
	getConfig : function(){
	return {
			openshift : {
				username : 'test',
				password : 'xxxx'

			}
		}
	}
}



describe('openshift login calls', function () {
  it('should perform call to logout from openshift', function (done) {
  	var openshiftcalls = proxyquire('../lib/openshiftcalls.js', {'./systemCall.js': systemCallProxy});
  	var openshiftLogout = openshiftcalls.openshiftLogout();
  	openshiftLogout(function(err, result){
  		//console.log(err);
  		result.success.should.equal(true);
  		done();
  	});
  });	
  it('should perform successfull to login to openshift', function (done) {
  	var openshiftcalls = proxyquire('../lib/openshiftcalls.js', {'./systemCall.js': systemCallProxy});
  	var openshiftLogin = openshiftcalls.openshiftLogin();
  	openshiftLogin(function(err, result){
  		result.success.should.equal(true);
  		done();
  	});
  });
  it('should perform unsuccessfull to login to openshift (invalid username)', function (done) {
  	var openshiftcalls = proxyquire('../lib/openshiftcalls.js', {'./systemCall.js': systemCallProxy,'../config.js' : badConfigUsername});
  	var openshiftLogin = openshiftcalls.openshiftLogin();
  	openshiftLogin(function(err, result){
  		result.success.should.equal(false);
  		done();
  	});
  });
  it('should perform unsuccessfull to login to openshift (invalid hostname)', function (done) {
  	var openshiftcalls = proxyquire('../lib/openshiftcalls.js', {'./systemCall.js': systemCallProxy,'../config.js' : badConfigHostname});
  	var openshiftLogin = openshiftcalls.openshiftLogin();
  	openshiftLogin(function(err, result){
  		err.should.equal('parameter missing');
  		result.success.should.equal(false);
  		done();
  	});
  });
});

describe('openshift project creation calls', function () {
  it('should perform call to create project on openshift', function (done) {
  	var openshiftcalls = proxyquire('../lib/openshiftcalls.js', {'./systemCall.js': systemCallProxy});
  	var createOpenshiftProject = openshiftcalls.createOpenshiftProject('test-mbaas');
  	createOpenshiftProject(function(err, result){

  		//console.log(result)
  		result.success.should.equal(true);
  		done();
  	});
  });	
  it('should fail to create project on openshift', function (done) {
  	var openshiftcalls = proxyquire('../lib/openshiftcalls.js', {'./systemCall.js': systemCallProxy});
  	var createOpenshiftProject = openshiftcalls.createOpenshiftProject('');
  	createOpenshiftProject(function(err, result){
  		//console.log(result)
  		//result.success.should.equal(false);
  		done();
  	});
  });
});

describe('openshift app creation calls', function () {
  it('should perform call to create app on openshift', function (done) {
  	var openshiftcalls = proxyquire('../lib/openshiftcalls.js', {'./systemCall.js': systemCallProxy});
  	var createOpenshiftApp = openshiftcalls.createOpenshiftApp('test-mbaas');
  	createOpenshiftApp(function(err, result){
  		//console.log(result);
  		result.success.should.equal(true);
  		done();
  	});
  });	
   it('should fail to create app on openshift', function (done) {
  	var openshiftcalls = proxyquire('../lib/openshiftcalls.js', {'./systemCall.js': systemCallProxy});
  	var createOpenshiftApp = openshiftcalls.createOpenshiftApp();
  	createOpenshiftApp(function(err, result){
  		//console.log(result);
  		result.success.should.equal(false);
  		done();
  	});
  });
});




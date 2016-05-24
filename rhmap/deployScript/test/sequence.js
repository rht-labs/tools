'use strict';

var openshiftCallsProxy = {

	openshiftLogout: function(){
		return function(cb){
			
			cb(null, {success: true});
		}
	}, 
	openshiftLogin: function(){
		return function(cb){
			
			cb(null, {success: true});
		}
	},
	createOpenshiftProject: function(mbaasName){
		return function(cb){
			if (mbaasName){
				cb(null, {success: true});
			} else {
				cb('invalid MBaaS name', {success: false});
			}
			
		}		
	},
	createOpenshiftApp: function(mbaasName){
		return function(cb){
			if (mbaasName){
				cb(null, {success: true});
			} else {
				cb('invalid MBaaS name', {success: false});
			}
			
		}		
	}
};

var fhCallsProxy = {
	rhMAPTarget: function(){
		return function(cb){
			
			cb(null, {success: true});
		}

	},
	rhMAPLogin: function(){
		return function(cb){
			
			cb(null, {success: true});
		}

	},
	createMBaaSTarget: function(){
		return function(cb){
			
			cb(null, {success: true});
		}

	},
	createMBaaSEnvironment: function(){
		return function(cb){
			
			cb(null, {success: true});
		}

	},
	createRHMAPTeam: function(){
		return function(cb){
			
			cb(null, {success: true});
		}

	},
	createRHMAPProject: function(){
		return function(cb){
			
			cb(null, {success: true});
		}

	}
};

var goodConfig = require('../config.js').getConfig();

var badConfigEnvironments = {
	getConfig : function(){
	return {
			project : {
				environments :  "",
				name : 'ph-mbaas-test'
			}
		}
	}
}

var badConfigName= {
	getConfig : function(){
	return {
			project : {
				environments :  ['dev']
			}
		}
	}
}

var proxyquire = require('proxyquire');



describe('sequence', function () {
  it('should perform sequence of steps correctly', function (done) {
  	var sequence = proxyquire('../lib/sequence.js', {'./fhCalls.js': fhCallsProxy,'./openshiftcalls.js': openshiftCallsProxy, '../config.js' : goodConfig});
    sequence.process(function(err, res){
    	if (err){
    		console.log(err);
    	}
    	res.success.should.equal(true);
    	done();
    });

  });
   it('should fail perform sequence of steps correctly (no environments array)', function (done) {
  	var sequence = proxyquire('../lib/sequence.js', {'./fhCalls.js': fhCallsProxy,'./openshiftcalls.js': openshiftCallsProxy, '../config.js' : badConfigEnvironments});
    sequence.process(function(err, res){

    	err.should.equal('Invalid config.project object');
    	done();
    });

  });
  it('should fail perform sequence of steps correctly (no name string)', function (done) {
  	var sequence = proxyquire('../lib/sequence.js', {'./fhCalls.js': fhCallsProxy,'./openshiftcalls.js': openshiftCallsProxy, '../config.js' : badConfigName});
    sequence.process(function(err, res){

    	err.should.equal('Invalid config.project object');
    	done();
    });

  });

});
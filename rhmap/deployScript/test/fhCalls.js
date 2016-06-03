'use strict'
var config = require('../config.js').getConfig();
var proxyquire = require('proxyquire');

var systemCallProxy = {
	execute: function(command, args, options, cb){
		//console.log(typeof args);
		if (command == 'fhc' && args && typeof args == 'object' ) {
			if (args[0] == 'target') {
     
				cb(null, 'Successfully targeted: http://testing.xxxxx.xxxxxx.com/ User: testing-xxx@xxxxx.com');
			}
      if (args[0] == 'login') {
       
        cb(null, 'Successfully logged into http://testing.xxxxx.xxxxx.com/');
      }
      if (args[0] == 'projects') {
        var response = {
          "type": "PROJECT",
          "template": null,
          "sysOwner": "3ttcniemc36vavcfagdfcdxe",
          "guid": "afbv36d5pfrtns2jh7zszljs",
          "title": "test-project",
          "sysModified": 1464113677459,
          "sysVersion": 0,
          "featured": false,
          "sysCreated": 1464113677457,
          "apps": [],
          "authorEmail": "testing-admin@example.com",
          "sysGroupFlags": 70111,
          "sysGroupList": "",
          "businessObject": "cluster/reseller/customer/domain/project",
          "migrated": false,
          "templateId": "default",
          "jsonTemplateId": "bare_project",
          "service": false
        }
        cb(null, JSON.stringify(response));
      }
      if (args[0] == 'admin' && args[1] == 'mbaas') {
       
        var response = {
          "owner": "3ttcniemc36vavcfagdfcdxe",
          "fhMbaasHost": "https://ph-mbaas-test-dev.apps.osm1.xxxxx.net",
          "url": "https://osm1-master1.xxxxx.net:8443",
          "username": "test",
          "routerDNSUrl": "*.apps.osm1.xxxxx.net",
          "servicekey": "\"\"",
          "_id": "test-mbaas",
          "type": "openshift3",
          "cacheKey": "ph-mbaas-test-dev-mbaas-openshiftdeploy-1464027416578"
        }
        cb(null, JSON.stringify(response));
      }
      if (args[0] == 'admin' && args[1] == 'teams') {
       
        var response = {
          "name": "ph-mbaas-testdeveloper",
          "code": "ph-mbaas-testdeveloper",
          "desc": "ph-mbaas-testdeveloper team",
          "created": "1464116135402",
          "updated": "1464116135402",
          "_id": "5744a3a723e724650c4099cc",
          "bosLabel": "default",
          "business-objects": {
            "cluster/reseller/customer/domain/admin/mbaas-target": [
              "ph-mbaas-test-dev",
              "ph-mbaas-test-test",
              "ph-mbaas-test-live"
            ],
            "cluster/reseller/customer/domain/admin": [
              "*"
            ],
            "cluster/reseller/customer/domain/admin/environment": [
              "ph-mbaas-test-dev-env",
              "ph-mbaas-test-test-env",
              "ph-mbaas-test-live-env"
            ],
            "cluster/reseller/customer/domain": [
              "v5cu7xtd7abtig5yyproaozc"
            ],
            "cluster/reseller/customer": [
              "IlV_eqt_AArFNGB-KSr0oZ9F"
            ],
            "cluster/reseller": [
              "ppx5i4eyekwpgfxblg6ur64m"
            ],
            "cluster": [
              "grdryn3-single"
            ],
            "cluster/reseller/customer/domain/project": [
              "mrlnbpmh5jdtwbjaa45cjlly"
            ]
          },
          "users": [],
          "perms": {
            "cluster/reseller/customer/domain/project": "write",
            "cluster/reseller/customer/domain/service": "write"
          },
          "defaultTeam": false
        }
        cb(null, JSON.stringify(response));
      }


      if (args[0] == 'admin' && args[1] == 'environments') {
       
        var response = {
          "__v": 0,
          "created": "2016-05-23T18:21:26.361Z",
          "modified": "2016-05-23T18:21:26.361Z",
          "owner": "3ttcniemc36vavcfagdfcdxe",
          "_id": "test-mbaas-env",
          "label": "test-mbaas-env",
          "targets": [
            "test-mbaas"
          ]
        }
        cb(null, JSON.stringify(response));
      }
		}
	}
}

var goodConfig = {
	getConfig : function(){
	return {
      project : {
        environments :  ['dev', 'test', 'live'],
        name : 'ph-mbaas-test',
        template: 'fh-mbaas-template-1node.json'
      },
			rhmap : {
        hostname : 'http://testing.xxxx.com',
        username : 'xxxx@example.com',
        password : 'xxxx'
      },
      openshift : {
        hostname : 'osm1-master1.feedhenry.net',
        port: '8443',
        username : 'test',
        password : 'xxxxx',
        dnsUrl: '*.apps.xxxx.net'
    	},
      deployed: {
        environments : [],
        MBaaS : []
      }
    }
	}
}
var badConfigHostname = {
  getConfig : function(){
  return {
      rhmap : {
        username : 'xxxx@example.com',
        password : 'xxxx'
      }
    }
  }
}

var badConfigNoUsername = {
  getConfig : function(){
  return {
      rhmap : {
        hostname : 'http://testing.grdryn3.skunkhenry.com',
        password : 'Password1'
      }
    }
  }
}

describe('fh target calls', function () {
  it('should perform call to target fh domain', function (done) {
  	var fhCalls = proxyquire('../lib/fhCalls.js', {'./systemCall.js': systemCallProxy,'../config.js' : goodConfig});
  	var rhMAPTarget = fhCalls.rhMAPTarget();
  	rhMAPTarget(function(err, result){
  		result.success.should.equal(true);
  		done();
  	});
  });	
  it('should return error targetting fh domain', function (done) {
    var fhCalls = proxyquire('../lib/fhCalls.js', {'./systemCall.js': systemCallProxy,'../config.js' : badConfigHostname});
    var rhMAPTarget = fhCalls.rhMAPTarget();
    rhMAPTarget(function(err, result){
      result.success.should.equal(false);
      done();
    });
  }); 
});


describe('fh login calls', function () {
  it('should perform call to login to fh domain', function (done) {
    var fhCalls = proxyquire('../lib/fhCalls.js', {'./systemCall.js': systemCallProxy,'../config.js' : goodConfig});
    var rhMAPLogin = fhCalls.rhMAPLogin();
    rhMAPLogin(function(err, result){
      result.success.should.equal(true);
      done();
    });
  }); 
  it('should return error logging into fh domain', function (done) {
    var fhCalls = proxyquire('../lib/fhCalls.js', {'./systemCall.js': systemCallProxy,'../config.js' : badConfigNoUsername});
    var rhMAPLogin = fhCalls.rhMAPLogin();
    rhMAPLogin(function(err, result){
      result.success.should.equal(false);
      done();
    });
  }); 
});

describe('fh MBaaS creation calls', function () {
  it('should create MBaaS on fh domain', function (done) {
    var fhCalls = proxyquire('../lib/fhCalls.js', {'./systemCall.js': systemCallProxy,'../config.js' : goodConfig});
    var createMBaaSTarget = fhCalls.createMBaaSTarget('test-mbaas');
    createMBaaSTarget(function(err, result){
      result.success.should.equal(true);
      done();
    });
  }); 
  it('should fail to create MBaaS on fh domain', function (done) {
    var fhCalls = proxyquire('../lib/fhCalls.js', {'./systemCall.js': systemCallProxy,'../config.js' : goodConfig});
    var createMBaaSTarget = fhCalls.createMBaaSTarget();
    createMBaaSTarget(function(err, result){
      result.success.should.equal(false);
      done();
    });
  }); 
});


describe('fh Environment creation calls', function () {
  it('should create Environment on fh domain', function (done) {
    var fhCalls = proxyquire('../lib/fhCalls.js', {'./systemCall.js': systemCallProxy,'../config.js' : goodConfig});
    var createMBaaSEnvironment = fhCalls.createMBaaSEnvironment('test-mbaas');
    createMBaaSEnvironment(function(err, result){
      result.success.should.equal(true);
      done();
    });
  }); 
  it('should fail to create Environment on fh domain', function (done) {
    var fhCalls = proxyquire('../lib/fhCalls.js', {'./systemCall.js': systemCallProxy,'../config.js' : goodConfig});
    var createMBaaSEnvironment = fhCalls.createMBaaSEnvironment();
    createMBaaSEnvironment(function(err, result){
      result.success.should.equal(false);
      done();
    });
  }); 
});


describe('fh project creation calls', function () {
  it('should create project on fh domain', function (done) {
    var fhCalls = proxyquire('../lib/fhCalls.js', {'./systemCall.js': systemCallProxy,'../config.js' : goodConfig});
    var createRHMAPProject = fhCalls.createRHMAPProject();
    createRHMAPProject(function(err, result){
      result.success.should.equal(true);
      done();
    });
  }); 

});


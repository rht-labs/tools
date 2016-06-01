var proxyquire = require('proxyquire');
var fhc = {
	admin: {
		environments: {
			create: function(arguments, cb){

				var response = null,
				err = null;
				response = { __v: 0,
				  created: '2016-06-01T17:56:35.732Z',
				  modified: '2016-06-01T17:56:35.732Z',
				  target: 'projectName',
				  order: 2,
				  domain: 'testing',
				  owner: '3ttcniemc36vavcfagdfcdxe',
				  label: 'projectName',
				  id: 'projectName',
				  _id: '574f21d3b04bb86658e45ec1',
				  enabled: true }
		    	
				cb(err, response);
			},
			read: function(arguments, cb){
				var response = null,
				err = null;
				if (arguments.id == 'test-duplicate') {
				  response = { 
				  	  created: '2016-06-01T17:56:35.732Z',
					  modified: '2016-06-01T17:56:35.732Z',
					  target:
					   { _label: 'test-duplicate',
					     _env: 'test-duplicate',
					     type: 'openshift3',
					     enabled: true,
					     editable: true,
					     decoupled: true,
					     __v: 0,
					     _id: '574f1253bec3708e43f586a5',
					     bearerToken: 'SQFXSBQNXdCYYeJc6TqZEGSufn5DDivB-oqnFduoV8M',
					     label: 'test-duplicate',
					     id: 'test-duplicate',
					     servicekey: 'd1738b17303f483092cdd6ea049d1e455e2d07a55454d217c9e4e59dca5c5a9e',
					     routerDNSUrl: '*.apps.osm1.feedhenry.net',
					     url: 'https://osm1-master1.feedhenry.net:8443',
					     fhMbaasHost: 'https://projectname.osm1-master1.feedhenry.net',
					     owner: '3ttcniemc36vavcfagdfcdxe',
					     domain: 'testing',
					     modified: '2016-06-01T16:50:27.706Z',
					     created: '2016-06-01T16:50:27.706Z' },
					  order: 2,
					  domain: 'testing',
					  owner: '3ttcniemc36vavcfagdfcdxe',
					  label: 'test-duplicate',
					  id: 'test-duplicate',
					  _id: '574f21d3b04bb86658e45ec1',
					  __v: 0,
					  enabled: true 
					}
				} else {
					err = {"userDetail":"Invalid MBaaS target: projectName","systemDetail":"can not read mbaas_target - 'Invalid MBaaS target: projectNa'","code":"FH-SUPERCORE-ERROR"};
				}
				cb(err, response);
			}
		}
	}
		
}

describe('fh Environment calls', function () {
  it('should create Environment ', function (done) {
  	var args = {
        mbaasName: 'projectName'
    }

  	var environment = proxyquire('../lib/environment.js', {'../node_modules/fh-fhc': fhc});
  	environment.create(args, function(response, changed){
  		//console.log(response);
		response.id.should.equal(args.mbaasName);
		changed.should.equal(true);
		done();
  	});
  });
  it('should not create duplicate environment ', function (done) {
  	var args = {
        mbaasName: 'test-duplicate'
    }

  	var environment = proxyquire('../lib/environment.js', {'../node_modules/fh-fhc': fhc});
  	environment.create(args, function(response, changed){
		
		changed.should.equal(false);
		done();
  	});
  });

   it('should not create Environment missing arguments', function (done) {
  	var args = {}

  	var environment = proxyquire('../lib/environment.js', {'../node_modules/fh-fhc': fhc});
  	environment.create(args, function(response, changed){
		
		changed.should.equal(false);
		done();
  	});
  });



});

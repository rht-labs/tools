var proxyquire = require('proxyquire');
var fhc = {
	login: function(arguments, cb){
		var response = {};
		var username = arguments._[0];
		var password = arguments._[1];
		if (username == 'testUser' && password == 'testPass') {
			response = { 
			csrf: 'b1a9dc5c430f3597f43bb4050a70632c',
  			domain: 'test',
  			login: 'rz7zhdvy44fwvz4mbbx3hm3c',
  			responses: { 
  				local: { 
  					status: 'ok' 
  				} 
  			},
  			result: 'ok',
  			sub: '3ttcniemc36vavcfagdfcdxe',
  			timestamp: 1464784789898,
  			user: 'ewtbmfr74wiwfdahpr3sa23i'}
		} else {
			response = "login failed: not-valid";
		}
		cb(null, response);
	},
	user: function(arguments, cb){
		cb(null, {displayName: 'oldUser'});
	}
}

describe('fh login calls', function () {
  it('should perform valid login to fh domain', function (done) {
  	var login = proxyquire('../lib/login.js', {'../node_modules/fh-fhc': fhc});
  	login.doLogin('testUser', 'testPass', function(response, changed){
		response.result.should.equal('ok');
		changed.should.equal(true);
		done();
  	});
  });
  it('should not perform valid login to fh domain', function (done) {
  	var login = proxyquire('../lib/login.js', {'../node_modules/fh-fhc': fhc});
  	login.doLogin('badUser', 'badPass', function(response, changed){	
		response.err.should.equal('login failed: not-valid');
		changed.should.equal(false);
		done();
  		
  	});
  });
  it('should not login to fh domain, user already logged in', function (done) {
  	var login = proxyquire('../lib/login.js', {'../node_modules/fh-fhc': fhc});
  	login.doLogin('oldUser', 'oldPass', function(response, changed){	
		response.username.should.equal('oldUser');
		changed.should.equal(false);
		done();
  		
  	});
  });
});

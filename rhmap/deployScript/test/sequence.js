'use strict';
var openshiftCallsProxy = {

	openshiftLogin: function(){
		return function(cb){
			console.log('Calling proxy');
			cb(null, true);
		}
	}
};
var fhCallsProxy = {};
var proxyquire = require('proxyquire');
var sequence = proxyquire('../lib/sequence.js', {'./openshiftcalls.js': openshiftCallsProxy,'./fhCalls.js': fhCallsProxy});


describe('sequence', function () {
  it('should add perform sequence of steps correctly', function (done) {
    sequence.process(function(err, res){
    	res.should.equal(true);
    	done();
    });

  });
});
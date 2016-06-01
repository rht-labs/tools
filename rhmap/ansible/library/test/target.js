var proxyquire = require('proxyquire');
var fhc = {
	target: function(arguments, cb){
		var response;
		var target = arguments._[0];
		
		if (!target) {
			response = 'https://target.feedhenry.com'
		} else if (target) {
			response = target;
		}
		cb(null, response);
	}
}

describe('fh target calls', function () {
  it('should not change target ', function (done) {
  	var target = proxyquire('../lib/target.js', {'../node_modules/fh-fhc': fhc});
  	target.set('https://target.feedhenry.com', function(response, changed){
		response.target.should.equal('https://target.feedhenry.com');
		changed.should.equal(false);
		done();
  	});
  });
  it('should change target ', function (done) {
    var target = proxyquire('../lib/target.js', {'../node_modules/fh-fhc': fhc});
    target.set('https://newtarget.feedhenry.com', function(response, changed){
    response.target.should.equal('https://newtarget.feedhenry.com');
    changed.should.equal(true);
    done();
    });
  });

});

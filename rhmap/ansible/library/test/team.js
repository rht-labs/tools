


var proxyquire = require('proxyquire');
var fhc = {
	admin: {
		teams: {
			create: function(arguments, cb){

				var response = null,
				err = null;
				response = { name: 'projectNamedeveloper',
				  code: 'projectNamedeveloper',
				  desc: 'projectNamedeveloper',
				  created: '1464806205725',
				  updated: '1464806205725',
				  _id: '574f2b3db027cfee3aa5d003',
				  bosLabel: 'default',
				  'business-objects':
				   { 'cluster/reseller/customer/domain/admin/mbaas-target': [ 'ph-mbaas' ],
				     'cluster/reseller/customer/domain/admin': [ '*' ],
				     'cluster/reseller/customer/domain/admin/environment': [ 'ph-mbaas' ],
				     'cluster/reseller/customer/domain': [ 'v5cu7xtd7abtig5yyproaozc' ],
				     'cluster/reseller/customer': [ 'IlV_eqt_AArFNGB-KSr0oZ9F' ],
				     'cluster/reseller': [ 'ppx5i4eyekwpgfxblg6ur64m' ],
				     cluster: [ 'grdryn3-single' ],
				     'cluster/reseller/customer/domain/project': [] },
				  users: [],
				  perms:
				   { 'cluster/reseller/customer/domain/project': 'write',
				     'cluster/reseller/customer/domain/service': 'write' },
				  defaultTeam: false }
				cb(err, response);
			},
			list: function(arguments, cb){
				var response = null,
				err = null;
				
				  response = [

				  	{ _id: '56ebe602f5f3d4424c7e2b98',
					  code: 'default-ppx5i4eyekwpgfxblg6ur64m-owner',
					  created: '1458300418187',
					  desc: 'A team that gives users access only to the things they create',
					  name: 'Owner Only (FeedHenry Test Reseller reseller)'
					},
					{ _id: '56ebe602f5f3d4424c7e2b34',
					  code: 'default-ppx5i4eyekwpgfxblg634534m-owner',
					  created: '1458300418187',
					  desc: 'A team that gives users access only to the things they create',
					  name: 'testTeamdeveloper'
					}
				  ]
				
				cb(err, response);
			}
		}
	}
		
}

describe('fh team calls', function () {
  it('should create team ', function (done) {
  	var args = {
        mbaasName: 'projectName'
    }

  	var team = proxyquire('../lib/team.js', {'../node_modules/fh-fhc': fhc});
  	team.create(args, function(response, changed){
  		//console.log(response);
		response.name.should.equal(args.mbaasName+'developer');
		changed.should.equal(true);
		done();
  	});
  });
  it('should not create duplicate team ', function (done) {
  	var args = {
        mbaasName: 'testTeam'
    }

  	var team = proxyquire('../lib/team.js', {'../node_modules/fh-fhc': fhc});
  	team.create(args, function(response, changed){
		
		changed.should.equal(false);
		done();
  	});
  });

   it('should not create team missing arguments', function (done) {
  	var args = {}

  	var team = proxyquire('../lib/team.js', {'../node_modules/fh-fhc': fhc});
  	team.create(args, function(response, changed){
		
		changed.should.equal(false);
		done();
  	});
  });



});

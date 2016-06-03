
var config = {
	project : {
		environments :  ['dev', 'test', 'live'],
		name : 'ph-mbaas-test',
		template: 'fh-mbaas-template-1node.json'
	},
	users: [
		{
			username: 'devuser',
			email: 'devuser@example.com',
			role: 'developer'
		},
		{
			username: 'opsuser',
			email: 'opsuser@example.com',
			role: 'operations'
		},
		{
			username: 'business',
			email: 'business@example.com',
			role: 'business'
		}
	],
	openshift : {
		hostname : 'xxxxx.feedhenry.net',
		port: '8443',
		username : 'USERNAME',
		password : 'PASSWORD',
		dnsUrl: '*.apps.osm1.feedhenry.net'


	},
	rhmap : {
		hostname : 'http://xxxxxx.com',
		username : 'xxxxx@example.com',
		password : 'xxxxxx'
	},
	deployed :{
		MBaaS : [],
		environments : []
	}
}


exports.getConfig = function(){
	//console.log('Getting config')
	return config;
}

exports.update = function(updatedConfig){
	config = updatedConfig;
}

#FH Openshift MBaaS creation script
##Usage
npm start

##Tests
npm test

##configuration
Edit config.js

```js
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
		hostname : 'osm1-master1.xxxxx.net',
		port: '8443',
		username : 'test',
		password : 'xxxxx',
		dnsUrl: '*.apps.osm1.xxxxx.net'


	},
	rhmap : {
		hostname : 'http://xxxxx.com',
		username : 'testing-admin@xxxx.com',
		password : 'xxxxx'
	},
	deployed :{
		MBaaS : [],
		environments : []
	}
}

```
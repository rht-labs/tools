
var sequence = require('./lib/sequence.js');
sequence.process(function(err, res){
	if (err){
		console.error(err)
	} else {
		console.log(res);
	}
});

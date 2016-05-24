exports.validateStringResponse = function(response, string){
	// console.log('Checking '+ response);
	// console.log('For '+ string)
	// console.log(response.indexOf(string) );
	if (response.indexOf(string) !== -1){
		
		return true;
	} else {
		
		return false;
	}
}

exports.validateJSON = function(data, key, value ){
	

	try {
		var dataJSON = JSON.parse(data);
		//console.log(dataJSON);
		if (dataJSON[key] == value){
			
			return true;
		} else {
			return false;
		}
	}
	catch(err){
		return false;
	}
}

exports.getJSONProperty = function(data, key){
	try {

		var dataJSON = JSON.parse(data);

		return dataJSON[key];
	} 
	catch(err){
		return false;
	}
	
}
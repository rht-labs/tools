exports.validateStringResponse = function(response, string){

	if (response && response.indexOf("string")){
		return true;
	} else {
		return false;
	}
}
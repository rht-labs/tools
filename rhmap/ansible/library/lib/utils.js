'use strict'

exports.stripString = function(string){
  string = string.replace(/['"]+/g, '').trim()
  return string;
}
exports.removeString = function(string, remove){
	string = string.replace(remove, '')

  
    return string;

}
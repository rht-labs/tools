'use strict'

exports.stripString = function(string){
  string = string.replace(/['"]+/g, '')
  string = string.replace(/\^/g, ' ')
  
  return string;
}

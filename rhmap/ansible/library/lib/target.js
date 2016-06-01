'use strict';
var fhc = require('../node_modules/fh-fhc');
var url = require('url');

function setTarget(target, cb){
    // test current target
    fhc.target({_:[]}, function(err, response){
      if (url.parse(response).hostname == url.parse(target).hostname){
        cb({target: target}, false)
      } else{
        fhc.target( {_:[target]}, function(err, response){
          if (err){
            // Handle error
            cb({err: err}, false);
          } else {
            
            cb({target:response}, true);

          }
        });
      }
    
    })

}

exports.set = setTarget;
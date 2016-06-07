#!/usr/local/bin/node
fs = require('fs');
var ansiblefhc = require('ansible-fhc');

// get arguments passed in by file
ansiblefhc.init.getArgs(function(err, args){
  var action;
  if (err){
    finish({err: err});
  } else {
    // load the fhc module.
    ansiblefhc.init.fhLoad(function(err, success){
      if (err ){
        finish(err);
      } else {
        action = args.action;
        // perform the action (first argument passed)
        ansiblefhc.process(action, args, finish);
      }
    });
  }
});

function finish(err, response ){
  if (err){
    console.log({err:err})
  } else {
    if (!response.changed){
      response.changed = false;
    }
    try {
      var stringOutput = JSON.stringify(response)
      console.log(stringOutput);
    }
    catch(err){
      console.log({err: err});
    }
  }

  
}





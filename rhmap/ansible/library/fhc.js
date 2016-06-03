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
        finish({err: err});
      } else {
        action = args.action;
        // perform the action (first argument passed)
        ansiblefhc.process(action, args, finish);
      }
    });
  }
});

function finish(output, changed ){
  if (!changed){
    changed = false;
  }
  try {
    var stringOutput = JSON.stringify({changed:changed, output})
    console.log(stringOutput);
  }
  catch(err){
    console.log({err: err});
  }
  
}





#!/usr/local/bin/node
fs = require('fs');
var target = require(process.env.FHMODULE_HOME+'/lib/target.js');
var login = require(process.env.FHMODULE_HOME+'/lib/login.js');
var mbaas = require(process.env.FHMODULE_HOME+'/lib/mbaas.js');
var init = require(process.env.FHMODULE_HOME+'/lib/init.js');
var environment = require(process.env.FHMODULE_HOME+'/lib/environment.js');
var team = require(process.env.FHMODULE_HOME+'/lib/team.js');
var project = require(process.env.FHMODULE_HOME+'/lib/project.js');

// get arguments passed in by file
init.getArgs(function(err, args){
  var action;
  if (err){
    finish({err: err});
  } else {
    // load the fhc module.
    init.fhLoad(function(err, success){
      if (err ){
        finish({err: err});
      } else {
        action = args.action;
        // perform the action (first argument passed)
        doAction(action, args);
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

function doAction(action, args){
  //finish(args)
  if (action == 'target'){
    target.set(args['target'], finish);
  }
  else if (action == 'login'){
    login.doLogin(args['username'], args['password'], finish);
  }
  else if (action == 'createMBaaSTarget'){
    mbaas.create(args, finish);
  }
  else if (action == 'createEnvironment'){
    environment.create(args, finish);
  }
  else if (action == 'createTeam'){
    team.create(args, finish);
  }
  else if (action == 'createProject'){
    project.create(args, finish);
  }
}




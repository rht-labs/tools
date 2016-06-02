'use strict';
var fhc = require('../node_modules/fh-fhc');
var utils = require(process.env.FHMODULE_HOME+'/lib/utils.js');

function create(args, cb){
  //['admin', 'environments', 'create', '--id='+MBaaSNameEnv, '--label='+MBaaSNameEnv, '--targets='+MBaaSName]
  if (!args['mbaasName']){
  	return cb({err: "Missing argument"}, false);
  }
  //return cb(args['mbaases']);
  var mbaases = [],
  environments = [];
  if (args['mbaases']){
    mbaases = args['mbaases'].split(",");
  }
  if (args['environments']){
    environments = args['environments'].split(",");
  }
  

  var teamName = args['mbaasName'] + 'developer';
  var teamConfig = {
    "name": teamName,
    "code": teamName,
    "desc": teamName,
    "perms": {
      "cluster/reseller/customer/domain/service":"write",
      "cluster/reseller/customer/domain/project":"write"
    },
    "users": [],
    "business-objects":{
      "cluster/reseller/customer/domain/project":[
        args['projectGuid']
      ],
      "cluster":[
        "sam1-core"
      ],
      "cluster/reseller":[
        "6Oz0VqOQoT5KDG5Fj_0c_DXN"
      ],
      "cluster/reseller/customer":[
        "IlV_eqt_AArFNGB-KSr0oZ9F"
      ],
      "cluster/reseller/customer/domain":[
        "v5cu7xtd7abtig5yyproaozc"
      ],
      "cluster/reseller/customer/domain/admin/environment":
        environments,
      "cluster/reseller/customer/domain/admin":[
        "*"
      ],
      "cluster/reseller/customer/domain/admin/mbaas-target":
        mbaases    }
  }

  //admin.teams.read requires a team guid, which we don't have so we need to read and loop through the list
  fhc.admin.teams.list({}, function(err, teams){
    var matched = false,
    teamId;
    teams.forEach(function(team){
      if (team.name == teamName){
        matched = true;
      }
    });
    if (matched){
      cb({name: teamName}, false);
    } else {

      fhc.admin.teams.create({team:JSON.stringify(teamConfig)}, function(err, response){
        if (err){
          // Handle error
          //console.log(err)
          cb({err: err}, false);
        } else {
          //console.log(response)
          cb(response, true);

        }
      });
    }
  });



}

exports.create = create;
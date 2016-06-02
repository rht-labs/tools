'use strict';
var fhc = require('../node_modules/fh-fhc');

function createProject(args, cb){
  //'fhc', ['projects', 'create' ,'projectName'],
  if (!args['projectName']){
  	return cb({err: "Missing argument"}, false);
  }
  var projectName = args['projectName'];
  fhc.projects({_:[]}, function(err, projects){
  	var matched = false;
  	var guid;
	projects.forEach(function(project){
      if (project.title == projectName){
        matched = true;
        guid = project.guid;
      }
    });
    if (matched){
      cb({guid: guid}, false);
    } else {

      fhc.projects({_:['create', projectName]}, function(err, response){
        if (err){
          // Handle error
          //console.log(err)
          cb({err: err}, false);
        } else {
          //console.log(response)
          cb({guid: response.guid}, true);

        }
      });
    }

  });



}

exports.create = createProject;
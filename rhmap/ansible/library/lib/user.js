'use strict';
var fhc = require('../node_modules/fh-fhc');

function createUser(args, cb){
  //'fhc', ['projects', 'create' ,'projectName'],
  if (!args['username']){
  	return cb({err: "Missing argument"}, false);
  }
  var username = args['username'];
  //console.log(fhc);
  fhc['admin-users'].list(function(err, users){
  	var matched = false;
  	var guid;
    //console.log(users)
	  users.list.forEach(function(user){
      if (user.fields.username == username){
        //console.log(user)
        matched = true;
        guid = user.guid;
      }
    });
    if (matched){
      cb({guid: guid}, false);
    } else {
      fhc['admin-users'].create(['username='+username, 'email='+username, 'invite=true' ], function(err, response){
        if (err){
          // Handle error
          console.log(err)
          cb({err: err}, false);
        } else {
          //console.log(response)
          //Have to list users again to find the guid to return.
          fhc['admin-users'].list(function(err, users){
            var matched = false;
            var guid;
            //console.log(users)
            users.list.forEach(function(user){
              if (user.fields.username == username){
                guid = user.guid;
              }
            });

            cb({guid:guid}, true);
          });

        }
      });
    }

  });



}

exports.create = createUser;
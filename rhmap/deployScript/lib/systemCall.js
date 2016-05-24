//fhc fhcfg set _exit false
const spawn = require('child_process').spawn;


exports.execute = function(command, args, options, cb){
  //console.log(args)
  if (options && options.label){
    console.log(options.label)
  }
  const sysCommand = spawn(command, args);

  var chunks = "";
  sysCommand.stdout.on('data', function(data) {
    chunks += data.toString();
  });

  sysCommand.on('close', function(code) {
    //console.log(chunks);
    cb(null, chunks)
  });

  sysCommand.on('error', function(err) {
    console.log(err)
    cb(err, null)
  });

}
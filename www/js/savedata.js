// XMLHttpRequest does have a async/sync flag (false=async=default) but's been deprecated in the main thread.
// That should ensure that we actually upload the data properly.  Will need to do something about 
// https://stackoverflow.com/questions/3760319/how-to-force-a-program-to-wait-until-an-http-request-is-finished-in-javascript
// Best = https://javascript.info/xmlhttprequest#upload-progress

// but we still have how to handle this and "wait" --
// use promises: https://www.freecodecamp.org/news/javascript-from-callbacks-to-async-await-1cc090ddad99/


function saveData(name, data) {
  // Will post the data to a webserver using PHP and, if on iOS, also save it locally for backup
  // logfile mode is here to just keep track of what was run and when.  It doesn't have the data itself
  return new Promise(function (resolve, reject) {
    // Do the PHP posting to the server
    var xhr = new XMLHttpRequest();  
    // Setup my callbacks - in particular the success/error one
    xhr.onloadend = function() {
      if (xhr.status == 200) {
        console.log("saveData successful upload");
        resolve(xhr.response);
      } else {
        console.log("saveData error " + this.status);
        reject(xhr.status);
      }
    };
    xhr.ontimeout = function () {
      console.log("saveData timeout");
      reject('timeout');
    };
    xhr.timeout = 4000;
    console.log('XHR Opening- ');
    xhr.open('POST', 'https://www.stark-labs.com/exp/jsPsych/mobile_cMST/write_data_file.php'); 
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log('XHR Sending');
    xhr.send(JSON.stringify({filename: name, filedata: data}));
    console.log('XHR status: ' + xhr.status);
  });
}

function appendLog(name, data) {
  // Will post the data to a webserver using PHP and, if on iOS, also save it locally for backup
  // logfile mode is here to just keep track of what was run and when.  It doesn't have the data 
  return new Promise(function (resolve, reject) {  
    // Do the PHP posting to the server
    var xhr = new XMLHttpRequest();
    data += '\n';
    // Setup my callbacks - in particular the success/error one
    xhr.onloadend = function() {
      if (xhr.status == 200) {
        console.log("saveData successful upload");
        resolve(xhr.response);
      } else {
        console.log("saveData error " + this.status);
        reject(xhr.status);
      }
    };
    xhr.ontimeout = function () {
      console.log("saveData timeout");
      reject('timeout');
    };
    xhr.timeout = 4000;
    console.log('XHR Opening- logmode ');
    xhr.open('POST', 'https://www.stark-labs.com/exp/jsPsych/mobile_cMST/append_log.php');
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log('XHR Sending');
    xhr.send(JSON.stringify({filename: name, filedata: data}));
    console.log('XHR status: ' + xhr.status);

  });
}


// another option: https://gist.github.com/john-doherty/6a9bf0f6b5eb77fb2bd332571a84c7c2
var fileErrorHandler = function(fileName, e) {
  // Lifted from https://www.neontribe.co.uk/blog/cordova-file-plugin-examples
  var msg = ''
  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'Storage quota exceeded'
      break
    case FileError.NOT_FOUND_ERR:
      msg = 'File not found'
      break
    case FileError.SECURITY_ERR:
      msg = 'Security error'
      break
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'Invalid modification'
      break
    case FileError.INVALID_STATE_ERR:
      msg = 'Invalid state'
      break
    default:
      msg = 'Unknown error'
      break
  }
  console.log('Error (' + fileName + '): ' + msg)
}

function saveLocalData(fileName, data) {
  return new Promise(function (resolve, reject) {
    // Lifted from https://www.neontribe.co.uk/blog/cordova-file-plugin-examples
    //data = JSON.stringify(data, null, '\t')
    window.resolveLocalFileSystemURL(
      cordova.file.dataDirectory,
      function(directoryEntry) {
        directoryEntry.getFile(
          fileName+".csv",
          { create: true },
          function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
              fileWriter.onwriteend = function(e) {
                // for real-world usage, you might consider passing a success callback
                console.log('Write of file "' + fileName + '"" completed.')
                resolve('completed');
              }

              fileWriter.onerror = function(e) {
                // you could hook this up with our global error handler, or pass in an error callback
                console.log('Write failed: ' + e.toString())
                reject(e.toString());
              }

              //var blob = new Blob([data], { type: 'text/plain' })
              fileWriter.seek(fileWriter.length);
              fileWriter.write(data)
            }, fileErrorHandler.bind(null, fileName))
          },
          fileErrorHandler.bind(null, fileName)
        )
      },
      fileErrorHandler.bind(null, fileName)
    )
  });
}


function appendLocalLog(fileName, data) {
  return new Promise(function (resolve, reject) {
    // Lifted from https://www.neontribe.co.uk/blog/cordova-file-plugin-examples
    //data = JSON.stringify(data, null, '\t')
    window.resolveLocalFileSystemURL(
      cordova.file.dataDirectory,
      function(directoryEntry) {
        directoryEntry.getFile(
          fileName+".log",
          { create: true },
          function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {
              fileWriter.onwriteend = function(e) {
                // for real-world usage, you might consider passing a success callback
                console.log('Write of file "' + fileName + '"" completed.')
                resolve('completed');
              }

              fileWriter.onerror = function(e) {
                // you could hook this up with our global error handler, or pass in an error callback
                console.log('Write failed: ' + e.toString());
                reject(e.toString());
              }

              //var blob = new Blob([data], { type: 'text/plain' })
              fileWriter.seek(fileWriter.length);
              fileWriter.write(data+"\n");
            }, fileErrorHandler.bind(null, fileName))
          },
          fileErrorHandler.bind(null, fileName)
        )
      },
      fileErrorHandler.bind(null, fileName)
    )
  });
}

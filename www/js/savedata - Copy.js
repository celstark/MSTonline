// XMLHttpRequest does have a async/sync flag (false=async=default) but's been deprecated in the main thread.
// That should ensure that we actually upload the data properly.  Will need to do something about 
// https://stackoverflow.com/questions/3760319/how-to-force-a-program-to-wait-until-an-http-request-is-finished-in-javascript
// Best = https://javascript.info/xmlhttprequest#upload-progress


function saveData(name, data) {
    // Will post the data to a webserver using PHP and, if on iOS, also save it locally for backup
    // logfile mode is here to just keep track of what was run and when.  It doesn't have the data itself

    // Do the PHP posting to the server
    var xhr = new XMLHttpRequest();
    console.log('XHR Opening- ');
    xhr.open('POST', 'http://www.stark-labs.com/exp/jsPsych/mobile_cMST/write_data_file.php',true); 

    xhr.upload.onprogress = function(event) {
      console.log(`Uploaded ${event.loaded} of ${event.total}`);
    };
  
    // track completion: both successful or not
    xhr.onloadend = function() {
      if (xhr.status == 200) {
        console.log("onloadend successful upload");
      } else {
        console.log("onloadend error " + this.status);
      }
    };

    xhr.upload.onload = function() {
      console.log('upload onload - successful upload');
    };

    // testing readystate
    xhr.onreadystatechange=function() { 
      console.log('ReadyStateChanged ' + xhr.readyState);
      if (xhr.readyState == 3) { 
        // loading
      }
      if (xhr.readyState == 4) {
        // request finished
        completed=true;
      }
    };


    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log('XHR Sending');
    xhr.send(JSON.stringify({filename: name, filedata: data}));
    console.log('XHR status: ' + xhr.status);

    if (device.platform == 'iOS') {
      // Since this is all appening just once or so per run and not constantly, we just open, write, and close
      console.log('Local iOS save');
      writeToLocalFile(name,data); 
    }
  }

  function appendLog(name, data) {
    // Will post the data to a webserver using PHP and, if on iOS, also save it locally for backup
    // logfile mode is here to just keep track of what was run and when.  It doesn't have the data 

    // Do the PHP posting to the server
    var xhr = new XMLHttpRequest();
    data += '\n';
    console.log('XHR Opening- logmode ');
    var completed=false;
    xhr.open('POST', 'http://www.stark-labs.com/exp/jsPsych/mobile_cMST/append_log.php',true);
  
    xhr.upload.onprogress = function(event) {
      console.log(`Uploaded ${event.loaded} of ${event.total}`);
    };
  
    // track completion: both successful or not
    xhr.onloadend = function() {
      if (xhr.status == 200) {
        console.log("onloadend successful upload");
      } else {
        console.log("onloadend error " + this.status);
      }
    };

    xhr.upload.onload = function() {
      console.log('upload onload - successful upload');
    };

    // testing readystate
    xhr.onreadystatechange=function() { 
      console.log('ReadyStateChanged ' + xhr.readyState);
      if (xhr.readyState == 3) { 
        // loading
      }
      if (xhr.readyState == 4) {
        // request finished
        completed=true;
      }
    };
  
    xhr.setRequestHeader('Content-Type', 'application/json');
    console.log('XHR Sending');
    xhr.send(JSON.stringify({filename: name, filedata: data}));
    console.log('XHR status: ' + xhr.status);

    if (device.platform == 'iOS') {
        // Since this is all appening just once or so per run and not constantly, we just open, write, and close
        console.log('Local iOS save - logmode');
        appendLocalRunLog(name,data); 
      }
  
  }
  
  function checkTransferComplete() {

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
  function writeToLocalFile(fileName, data) {
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
              }

              fileWriter.onerror = function(e) {
                // you could hook this up with our global error handler, or pass in an error callback
                console.log('Write failed: ' + e.toString())
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
  }

  function appendLocalRunLog(fileName, data) {
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
              }

              fileWriter.onerror = function(e) {
                // you could hook this up with our global error handler, or pass in an error callback
                console.log('Write failed: ' + e.toString())
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
  }

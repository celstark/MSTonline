Currently, the code is configured to save your data two ways: 1) via a PHP-based upload to a web
server and 2) Locally (if on iOS).  All of this happens in www/js/savedata.js where we have functions
like appendLog() and appendLocalLog.

So, for example, inside one of the experiment .html files you'll have code like this:
    if (DEBUGMODE == 0) { 
        appendLog(phasename,'Start: ' + date.toISOString() + JSON.stringify(jsPsych.data.urlVariables()) ); 
        if (device.platform == 'iOS') {
        appendLocalLog(phasename,'Start: ' + date.toISOString() + JSON.stringify(jsPsych.data.urlVariables()) ); 
        }
    }

"phasename" will be something like "msts" (MST-study phase) and we'll call appendLog to send it via
PHP and we'll call appendLocalLog to send the info locally.

YOU MUST CONFIGURE THOSE FUNCTIONS IN savedata.js TO USE YOUR OWN SERVER IF NOT USING THE STARK-LABS ONE.

Sample append_log.php and write_data_file.php are found in the "misc" folder.
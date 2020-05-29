# Overview
Multiple variants of the MST coded up with jsPsych (and Cordova) are in progress / available. Published here is the classic study/test version using either 3-choice (Old/Similar/New) or 2-choice (Old/New) responses and either 32- or 64-items per set.
The experiment itself really just uses jsPsych and the Cordova bits could be pulled out for a purely online version of the task.  What we really need Cordova for is the mobile (iPad / Android tablet) target.  But, at the moment, we're using the "platform/browser" code from Cordova as our basis for online.  A few key bits on this:
- All stimulus timing / running / etc is pure jsPsych
- Data are saved using routines in js/savedata.js.  
 - This has both "appendlog" and "savedata" routines.  The former just keeps a log of what is run when and the latter saves the data in CSV files
 - There are routines in there to post the data via PHP to a webserver and to save the data locally.  
  - Local saves only make sense on the mobile builds.  These do both the PHP and the local saves.
- For the Cordova aspects, we both load in the cordova.js file and we setup a document listener.  That listener is what lets the code wait until Cordova is ready before actually doing anything in the experiment.  All experimental code is then embedded in onDeviceReady()

# jsPsych
All needed [jsPsych](https://www.jspsych.org/) bits are included here.  It's a really nice platform that
lets us code up and run experiments in JavaScript.

# Cordova
Apache's [Cordova](https://cordova.apache.org/) lets us take web applications (like those created in jsPsych) and bundle them for devices.  It also lets you run the bundled up versions in web browsers. For many things, it's nice in that it gives you access to native features (camera, mic, GPS, etc.), but we're not using that here.  You can pull the Cordova bits out of here pretty easily if you want to run pure jsPsych bits on your own web-server. But, there's no harm in keeping them and you can have it run on Android or iOS tablets then "natively" as a plus.

# Hosting
I do not host things for you.  You'll need your own web-server with the ability to run jsPsych projects on it.  I suggest taking some of the jsPsych examples and testing them on your own machine first.  You can run a good enough server in a Virtual Machine (VM) just fine or get fancy and use a container like Docker / Singularity if you like. But, you're on your own there.  A decent place to start would be to use VirtualBox to install a basic Linux Apache server (LAMP servers are nice starts).
## Saving data on the web server
You'll notice above I mentioned that js/savedata.js file.  It calls on two PHP scripts (write_data_file.php and append_log.php - found in the "misc" folder) to actually save the text files on your servers.  Both the savedata.js and the two PHP files will need to be customized for your own setup.  If you like, you can use SQL to save the data too (sample given). I've also got a count_runlog.php file in there that I use for automatic counterbalancing (idea being that it counts the number of times an experiment has been run so that your code could do something like NumRuns % 4 and end up with a number ranging from 0-4 that you use to assign the counterbalance condition.) 

Regardless, just as I am not providing hosting for the experiment for you, I'm not hosting your data either. You don't want me to.

# Installing
Once you've done your `git clone https://github.com/celstark/MSTonline.git` and
have this in place, you'll need to install Cordova (if you want to roll that way)
and then at least setup the browser target:

```
cordova platform add browser
cordova emulate browser
```

Likewise, you can 
```
cordova platform add android
cordova emulate android
```

# Running
If all goes well, you should pop up a screen eventually that lets you customize an experimental run.  What you're really doing is building up a URL that will take the participant through a series of tasks with whatever parameters you've specified.  The experiment's HTML code will tell you what the parameters can be, but one key bit is the various q_XXX aspects.  You'll see things like:
q_start=msts&q_msts=mstt
in the URL that page builds.  That means in our queue (q), we start with "msts" - aka "msts.html".  That task will be run first.  Next we see "q_msts" meaning the "msts" (MST Study) task gets an instruction as to what comes in the queue next.  In this case, it's "mstt", aka "mstt.html" (the test phase).

You'll note here that there's only a rough translation between task name (msts, mstt, etc) and the actual HTML file being run.  That's intentional.  You could have "q_msts=mstt_v3" meaning that the msts task would next queue up mstt_v3.html, which internally calls itself mstt.


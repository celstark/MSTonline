# Overview
Multiple variants of the MST coded up with jsPsych and JATOS are in progress / available. Published here is the classic study/test version using either 3-choice (Old/Similar/New) or 2-choice (Old/New) responses and either 32- or 64-items per set.
The experiment itself really just uses jsPsych and the Cordova bits could be pulled out for a purely online version of the task.  What we really need Cordova for is the mobile (iPad / Android tablet) target.  But, at the moment, we're using the "platform/browser" code from Cordova as our basis for online.  A few key bits on this:
- All stimulus timing / running / etc is pure jsPsych
- Experiment and data management go via JATOS
- The actual running then happens in a web browser connected to either a local JATOS server (e.g., your own laptop) or a remote one you manage. 

# jsPsych
All needed [jsPsych](https://www.jspsych.org/) bits are included here.  It's a really nice platform that lets us code up and run experiments in JavaScript.

# JATOS
You will need to install [JATOS](https://www.jatos.org/). This sets up a webserver on your machine (even just your personal machine for running "locally"). This is available for Windows, Mac, and Linux so you should be good.

# Hosting
I do not host things for you.  Well, actually, I do have one setup for collaborators, so let me know. But, it's pretty simple to setup. Head on over to the JATOS documentation to see how to do it. This can just be some machine in your lab if you're testing relatively locally or it can even be the same machine that's delivering the experiment. 

# Installing
You can clone the repository and setup a new JATOS experiment and then copy these resources into your JATOS `study_assets_root` folder. But, a better option will be to go to a Release here and download the JATOS `.zip` file.  Once you have JATOS import that, you have the experiment fully in place.

# Data
JATOS will provide a very thorough log file in a JSON like format. If all you want, however, is the REC, LDI and a few other summary metrics, you can find these in the *Worker and Batch Manager* and then *Batch Session Data*.  There, you'll see things like:
```
  "1234": [
    "msts_2021-10-29-10-9-33_Complete",
    "mstt_2021-10-29-10-13-36_Valid, 32, 32, 32\nOld, 29, 15, 0\nSimilar, 3, 16, 7\nNew, 0, 1, 25\nREC, 0.906, LDI, 0.281"
  ],
```
That says that subject 1234 was run on 10/29/2021, that they had 32 valid responses in each of the Repeat, Lure, and New trial categories, responded "Old" to 29 repeats, 15 lures, and 0 new items, etc.

# Customizing
The source code shows a number of ways you can customize the experiment delivery. This happens typically via settings given in JATOS and by customizing the `setup.html` file. For example, for the study and test phases, if you hit *Properties* in JATOS the *JSON input* will let you specify a host of options.  If you wanted to force a 32-item rather than 64-item per stimulus type, you could have:
```
{
  "force_nstimper": 32
}
```
Again, the full list of options are listed in the `msts.html` and `mstt.html` files. You can also configure things at the *Study Properties* level. For example, this might be in your *Edit Study Properties*, *JSON input* section:
```
{
  "resp_mode": "button",
  "include_consent": 1,
  "include_demographics": 1,
  "include_idcode": 1
}
```
Note that bit there about including the optional components for a "enter your ID" page, a demographics page, and a consent form page. When set to 1 like this, those components will be shown. Customize as you see fit, of course.

Finally, a number of these can also be set in the *Batch* properties or even via URL parameters.  Again, have a look at the code.

## Setup.html
This is a bit atypical for JATOS, but I use a `setup.html` file to help configure things. You can strip this and set it all up directly in the JATOS interface and in the code, but I've found this very handy, especially when running multiple versions of things. Here, for example, is a bit of it that sets up some defaults:

```
var order=[5,6,7]; // Default order skips consent and demographics
var include_consent=0;
var include_demographics=0;
var include_idcode=0;

jatos.studySessionData['sid']=sid;
jatos.studySessionData['urlsid']=urlsid;

jatos.studySessionData["taskindex"] = 0;
jatos.studySessionData["order"] = order;

jatos.studySessionData["set_mst"] = 1;
jatos.studySessionData["nstimper"] = 64; // do the full set
jatos.studySessionData['resp_mode'] = 'button'; 
jatos.studySessionData['twochoice'] = 0;
jatos.studySessionData['selfpaced'] = 1; // This should be our default as it was used in the original
```
The bottom half of that is setting pretty easy to understand defaults, but the `order` variable is worth paying a bit of attention to. Those numbers are the JATOS component numbers. As the experiment progresses, each component, instead of just triggering the next one in the sequence, will trigger the component that is next in the `order` list.  This way, you can have things like an "MST Study - Stim set 1" in your JATOS experiment that has a "force_set = 1" in its *Properties* page along with ones for other variants you want to be able to run and it'll only be engaged when the `order` list includes that component. Or, you might set that directly in the `setup.html`. For example:
```
cond = ( nruns % 2 ) + 2;
if (jatos.componentJsonInput && typeof jatos.componentJsonInput['force_cond'] !== 'undefined') {
  cond=jatos.componentJsonInput['force_cond'];
  console.log('condition forced via JSON component to ' + cond);
}
var order = [];
switch (cond) {
  case 0: 
    jatos.studySessionData["set_mst"] = 1;
    condtag='Set1';
    break;
  case 1: 
    jatos.studySessionData["set_mst"] = 2;
    condtag='Set2';
    break;
}
```



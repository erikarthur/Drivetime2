function parseOutput(e) {
    var outputText = document.getElementById("output");
 
    var textToParse = outputText.childNodes[5].firstChild.innerText;
    var driveTimeText = document.getElementById("driveTime");
    
    var minutes = /\d+ min/g;
    var hours =  /\d+ hr/g;

    var strDriveMins = textToParse.match(minutes); //matches "2 chapters"
    var strDriveHours = textToParse.match(hours);
    //var strSingleLineText = driveTimeText.replace(new RegExp("\\n", "g", ""));

    if (strDriveHours == null)
    	driveTimeText.innerText = "Current: " + strDriveMins[1] + ", No Traffic: " + strDriveMins[0];
 	else
        driveTimeText.innerText = "Current: " + strDriveHours[1] + ":" + strDriveMins[1] + ", No Traffic: " + strDriveHours[0] + ":" + strDriveMins[0];
}
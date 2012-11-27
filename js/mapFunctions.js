
var map = null;
var directionsManager;
var directionsErrorEventObj;
var directionsUpdatedEventObj;
var dtObject = new Object();
dtObject.wayPoint1 = null;
dtObject.wayPoint2 = null;
dtObject.Duration = null;
dtObject.routeColor = null;
dtObject.routeOpacity = null;
dtObject.r = null;
dtObject.g = null;
dtObject.b = null;
dtObject.a = null;

function d2h(d) {return d.toString(16);}
function h2d(h) {return parseInt(h,16);}

function initializeObjects()
{
    //initialize the cookies for testing
    //$.cookie("wayPoint1", "2668 Town Lake Dr Woodbury MN 55125", { expires: 365 });
    //$.cookie("wayPoint2", "30 E. 7th St, St Paul, MN 55101", { expires: 365 });
    //$.cookie("routeColor", "ff0088", { expires: 365 });
    //$.cookie("routeOpacity", "255", { expires: 365 });

    //dtObject.wayPoint1 = "2668 Town Lake Dr Woodbury MN 55125";
    //dtObject.wayPoint2 =  "30 E. 7th St, St Paul, MN 55101";
    //dtObject.routeColor = "#ff0088";
    //dtObject.routeOpacity =  255;

    //read the dtObjects values from a cookie
    dtObject.wayPoint1 = $.cookie("wayPoint1");
    dtObject.wayPoint2 = $.cookie("wayPoint2");
    dtObject.routeColor = $.cookie("routeColor");
    dtObject.routeOpacity = $.cookie("routeOpacity");
    dtObject.r = dtObject.routeColor.substr(1,2);
    dtObject.g = dtObject.routeColor.substr(3,2);
    dtObject.b = dtObject.routeColor.substr(5,2);

    dtObject.r = h2d(dtObject.r);
    dtObject.g = h2d(dtObject.g);
    dtObject.b = h2d(dtObject.b);

    if (typeof (dtObject.routeOpacity) != null) {
        $("#routeOpacity").slider("value", dtObject.routeOpacity);
        //dtObject.routeOpacity = 55;
    }
    else {
        $("#routeOpacity").slider("value", dtObject.routeOpacity);
        //dtObject.routeOpacity = 55; 
    }
    dtObject.a = parseInt(dtObject.routeOpacity);

    var t1 = dtObject.wayPoint1;
    var t2 = dtObject.wayPoint2;
    var t3 = dtObject.routeColor;


    $("#wayPoint1").val(t1);
    $("#wayPoint2").val(t2);
    $("#routeColor").val(t3);
    

   // if (typeof(dtObject.wayPoint1) == undefined)
   // {
   //     dtObject.wayPoint1 = "2668 Town Lake Dr, Woodbury, MN, 55125";
   // }
}

function saveSettings() {

    

    var txtWP1 = $("#wayPoint1").val();
    var txtWP2 = $("#wayPoint2").val();
    var txtRC  = $("#routeColor").val();
    var txtRO  = $("#routeOpacity").slider( "option", "value" );

    var i = 0;

    $.cookie("wayPoint1", txtWP1, { expires: 365 });
    $.cookie("wayPoint2", txtWP2, { expires: 365 });
    $.cookie("routeColor", txtRC, { expires: 365 });
    $.cookie("routeOpacity", txtRO, { expires: 365 });

    //read the dtObjects values from a cookie
    dtObject.wayPoint1 = $.cookie("wayPoint1");
    dtObject.wayPoint2 = $.cookie("wayPoint2");
    dtObject.routeColor = $.cookie("routeColor");
    dtObject.routeOpacity = $.cookie("routeOpacity");

    dtObject.r = dtObject.routeColor.substr(1,2);
    dtObject.g = dtObject.routeColor.substr(3,2);
    dtObject.b = dtObject.routeColor.substr(5,2);

    dtObject.r = h2d(dtObject.r);
    dtObject.g = h2d(dtObject.g);
    dtObject.b = h2d(dtObject.b);
    dtObject.a = parseInt(dtObject.routeOpacity);

}

function createMap() {

    initializeObjects();
    // Initialize the map
    map = new Microsoft.Maps.Map(document.getElementById("myMap"),
                 { credentials: "AmLVAXMn2L1eVoiJ-v4jC9Sxyoh1A-DAViCGgQZT7xsGjZGJJMEo2p1sEIy2G_95" });

    var latVal = 44.93829887705892;
    var longVal = -93.0003124149414;


    // Set the map center
    map.setView({ center: new Microsoft.Maps.Location(latVal, longVal) });

    var options = map.getOptions();
    options.zoom = 12;
    map.setView(options);

    Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', {
        callback: function () {
            trafficLayer = new Microsoft.Maps.Traffic.TrafficLayer(map);
            var tileLayer = trafficLayer.getTileLayer();
            tileLayer.setOptions({ opacity: 1.0 });

            // show the traffic Layer 
            trafficLayer.show();
        }
    });

    if (!directionsManager) {
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', { callback: createDrivingRoute });
    }
    else {
        createDrivingRoute(0);
    }
    var currentTime = new Date();
    var hours = currentTime.getHours() % 12;
    if (hours == 0) {
        hours = 12;
    }
    var UpdateTimeDisplay = document.getElementById("updateTime")
    var minutes = currentTime.getMinutes();
    if (minutes < 10) {
        UpdateTimeDisplay.innerHTML = "Last Updated: " + hours + ":0" + minutes;
    }
    else {
        UpdateTimeDisplay.innerHTML = "Last Updated: " + hours + ":" + minutes;
    }
}




function home() {
    var query = document.getElementById("LocA").value;


    map.getCredentials(function (credentials) {
        var searchRequest = 'http://dev.virtualearth.net/REST/v1/Locations/' + query + '?output=json&jsonp=SearchServiceCallback&key=AmLVAXMn2L1eVoiJ-v4jC9Sxyoh1A-DAViCGgQZT7xsGjZGJJMEo2p1sEIy2G_95';
        var mapscript = document.createElement('script');
        mapscript.type = 'text/javascript';
        mapscript.src = searchRequest;
        document.getElementById('myMap').appendChild(mapscript);
    });
    var latlon = map.getCenter();
    document.getElementById('Latitude').value = latlon.latitude;  // + '/' + latlon.longitude
    document.getElementById('Longitude').value = latlon.longitude;
    document.getElementById('LatLong').value = latlon.latitude + ',' + latlon.longitude
}

function mapData() {

    var latlon = map.getCenter();
    document.getElementById('Latitude').value = latlon.latitude;  // + '/' + latlon.longitude
    document.getElementById('Longitude').value = latlon.longitude;
    var options = map.getOptions();
    document.getElementById('LatLong').value = options.zoom;
}

function SearchServiceCallback(result) {
    var output = document.getElementById("output");
    if (output) {
        while (output.hasChildNodes()) {
            output.removeChild(output.lastChild);
        }
    }

    var resultsHeader = document.createElement("h5");

    output.appendChild(resultsHeader);

    if (result && result.resourceSets && result.resourceSets.length > 0 && result.resourceSets[0].resources &&
    result.resourceSets[0].resources.length > 0) {
        resultsHeader.innerHTML = "Bing Maps REST Search API  <br/>  Found location " + result.resourceSets[0].resources[0].name;

        var bbox = result.resourceSets[0].resources[0].bbox;

        var viewBoundaries = Microsoft.Maps.LocationRect.fromLocations(new Microsoft.Maps.Location(bbox[0], bbox[1]), new Microsoft.Maps.Location(bbox[2], bbox[3]));

        map.setView({ bounds: viewBoundaries });

        var location = new Microsoft.Maps.Location(result.resourceSets[0].resources[0].point.coordinates[0], result.resourceSets[0].resources[0].point.coordinates[1]);
        var pushpin = new Microsoft.Maps.Pushpin(location, { text: "erik" });

        map.entities.push(pushpin);


    }
    else {
        if (typeof (response) == 'undefined' || response == null) {
            alert("Invalid credentials or no response");
        }
        else {
            if (typeof (response) != 'undefined' && response && result && result.errorDetails) {
                resultsHeader.innerHTML = "Message :" + response.errorDetails[0];
            }

            alert("No results for the query");
        }
    }
}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

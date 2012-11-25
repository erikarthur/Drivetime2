function createDirectionsManager() {
    var displayMessage;
    if (!directionsManager) {
        directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
        displayMessage = 'Directions Module loaded\n';
        displayMessage += 'Directions Manager loaded';
    }
    //alert(displayMessage);
    directionsManager.resetDirections();
    directionsErrorEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', function (arg) { });
    directionsUpdatedEventObj = Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', function () { });
}

function createDrivingRoute(iDirection) {
    if (!directionsManager) { createDirectionsManager(); }
    directionsManager.resetDirections();
    // Set Route Mode to driving 
    var options = directionsManager.getRenderOptions();
    options.drivingPolylineOptions.visible = false;
    options.drivingPolylineOptions.strokeColor.a = 50;
    directionsManager.setRenderOptions(options);
    options = directionsManager.getRenderOptions();
    
    directionsManager.setRequestOptions({ routeMode: Microsoft.Maps.Directions.RouteMode.driving, displayRouteSelector:false });

    //var WoodburyWayPoint = getCookie("Address1"); 
    //var StPaulWayPoint = getCookie("Address2");

    var WoodburyWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: '2668 Town Lake Dr Woodbury MN 55125' });
    var StPaulWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: '30 e 7th St St Paul MN' });


    if (typeof(WoodburyWayPoint) == undefined)
        WoodburyWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: '2668 Town Lake Dr Woodbury MN 55125' });

    if (typeof (StPaulWaypoint) == undefined) 
        StPaulWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: '30 e 7th St St Paul MN' });

    if (iDirection === 0) {
        setCookie("Address1", WoodburyWaypoint, 365);
        setCookie("Address2", StPaulWaypoint, 365);
        directionsManager.addWaypoint(WoodburyWaypoint);
        directionsManager.addWaypoint(StPaulWaypoint);
    }
    else {
        setCookie("Address1", WoodburyWaypoint, 365);
        setCookie("Address2", StPaulWaypoint, 365);
        directionsManager.addWaypoint(StPaulWaypoint);
        directionsManager.addWaypoint(WoodburyWaypoint);
    }
    // Set the element in which the itinerary will be rendered
    directionsManager.setRenderOptions({ itineraryContainer: document.getElementById('output') });
    Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', parseOutput);
    directionsManager.calculateDirections();
    
}
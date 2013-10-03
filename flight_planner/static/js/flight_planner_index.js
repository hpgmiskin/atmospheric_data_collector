//flight_planner_index

var map; 
var shape;
var volume;

DELAY = 200
DEFAULT_FORMAT = {
		editable: true,
		strokeColor : "#FFFFFF",
		strokeOpacity : 0.8,
		strokeWeight : 2,
		fillColor : "#FFFFFF",
		fillOpacity : 0.35
	}

function getObject (jsonString) {
	//returns the object assoicated with the given JSON string
	var sanitisedJASONString = jsonString.replace(/'/g, '"');
	var object = JSON.parse(sanitisedJASONString);

	return object
}

function update(data) {
	//general function to be called for any update
	console.log(data["volumeData"])
}

function updateAltitude (altitudeData) {

	altitudeData = JSON.stringify(altitudeData)
		$.post( "post_altitude",{"postField":altitudeData}, function(data){
			update(data)
		} ,"json");
}

function updateMap (shapeData) {

	console.log(shapeData); 
	shapeData = JSON.stringify(shapeData)

		$.post( "post_shape",{"postField":shapeData}, function(data){
			update(data)
		} ,"json");
};

function addShape(shapeData) {

	type = shapeData["type"];
	path = shapeData["path"];
	mapCenter = shapeData["mapCenter"];

	if ((shapeData["type"] == "none") || (path == null)) {
		return null;
	};

	var pathCoordinates = [];
	var length = 0;

	if (type == "rectangle") {
		length = path.length - 1;
	} else if (type == "polygon") {
		length = path.length;
	} else {
		return null;
	}

	for (var i = 0; i < length; i++) {
		pathCoordinates.push(new google.maps.LatLng(path[i][0], path[i][1]));
	};

	shapeSettings = {
		paths: pathCoordinates,
		editable: true
	}

	var existingShape = new google.maps.Polygon($.extend(shapeSettings,DEFAULT_FORMAT));
	existingShape.setMap(map);

	shape = existingShape;

	if (type == "rectangle") {
		setRectangleListeners(existingShape);
	} else if (type == "polygon") {
		alert("polygon")
		setPolygonListeners(existingShape);
	};

}

function initialize() {

	var shapeData = getObject($("#shapeData").val());
	
	drawMap(shapeData["mapCenter"]);
	addShape(shapeData);

}

function drawMap(mapCenter) {
	var myOptions = {
		center : new google.maps.LatLng(mapCenter[0],mapCenter[1]),
		zoom : 16,
		mapTypeId : google.maps.MapTypeId.HYBRID
	};
	map = new google.maps.Map(document.getElementById('map_canvas'), myOptions); 
	google.maps.event.addListenerOnce(map, 'idle', function() {
		//addFeaturesToMap();
	});
	var drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode : null,
		drawingControl : true,
		drawingControlOptions : {
			position : google.maps.ControlPosition.TOP_CENTER,
			drawingModes : [
			google.maps.drawing.OverlayType.RECTANGLE,
			google.maps.drawing.OverlayType.POLYGON
			]
		},
		rectangleOptions : DEFAULT_FORMAT,
		polygonOptions : DEFAULT_FORMAT
	});
	drawingManager.setMap(map);

	google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
		if (typeof(shape) != "undefined") {
			shape.setMap(null);
		};
		complexPath = polygon.getPath();
		path = complexPath["b"];
		updatePolygon(path);
		setPolygonListeners(polygon);
	});

	google.maps.event.addListener(drawingManager, 'rectanglecomplete' , function(rectangle) {
		if (typeof(shape) != "undefined") {
			shape.setMap(null);
		};
		path = rectangle.getBounds()
		updateRectangle(path)
		setRectangleListeners(rectangle);
	});

} ;


function setPolygonListeners(polygon) {

	google.maps.event.addListener(polygon, 'capturing_changed', function() { 
		shape = this
		window.setTimeout(function() {
			complexPath = shape.getPath();
			path = complexPath["b"];
    		updatePolygon(path);
		}, DELAY);
	});
};

function setRectangleListeners(rectangle) {

	google.maps.event.addListener(rectangle, 'bounds_changed', function() {
		shape = this
		window.setTimeout(function() {
      		var path = shape.getBounds();
    		updateRectangle(path);
    	}, DELAY);
	});
};

function updatePolygon(polygonPath) {
	//function to obtain the path and area of a polygon and post the change

	var polygonArea = google.maps.geometry.spherical.computeArea(polygonPath);
	updateMap({"type":"polygon","path":polygonPath,"area":polygonArea})
};

function updateRectangle(rectangleBounds) {
	//function to obtain the path and area of a rectangle and post the change

	var rectangleNorthEastBounds = rectangleBounds.getNorthEast();
	var rectangleSouthWestBounds = rectangleBounds.getSouthWest();
	var rectangleNorthWestBounds = new google.maps.LatLng(rectangleNorthEastBounds.lat(), rectangleSouthWestBounds.lng());
	var rectangleSouthEastBounds = new google.maps.LatLng(rectangleSouthWestBounds.lat(), rectangleNorthEastBounds.lng());

	var rectanglePath = [rectangleNorthEastBounds, rectangleSouthEastBounds, rectangleSouthWestBounds, rectangleNorthWestBounds, rectangleNorthEastBounds]; 
	var rectangleArea = google.maps.geometry.spherical.computeArea(rectanglePath);

	updateMap({"type":"rectangle","path":rectanglePath,"area":rectangleArea})
}

google.maps.event.addDomListener(window, 'load', initialize); 


// Vertical slider
$(function() {
	$( "#altitude-slider" ).slider({
		orientation: "vertical",
		range: true,
		min: 0,
		max: 1000,
		values: [ $('#low-altitude').val(), $('#high-altitude').val() ],
		slide: function( event, ui ) {
			$( "#altitude" ).val( ui.values[ 0 ] + "m - " + ui.values[ 1 ] + "m" );
		},
		stop: function ( event, ui ) {
			updateAltitude(JSON.stringify(ui.values))
		}
	});
	$( "#altitude" ).val( $( "#altitude-slider" ).slider( "values", 0 ) +
		"m - " + $( "#altitude-slider" ).slider( "values", 1 ) + "m");

});
//index

var map; 
var drawingManager;
var shape;
var volume;

function update(data) {
	//general function to be called for any update
	//console.log(data["volumeData"])
	//console.log(drawingManager)
	//drawingManager["drawingMode"] = null;
	//console.log(drawingManager)
	setVolumeData(data)
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

	// if (type == "rectangle") {
	// 	setRectangleListeners(existingShape);
	// } else if (type == "polygon") {
	// 	setPolygonListeners(existingShape);
	// };

	setRectangleListeners(existingShape);
	setPolygonListeners(existingShape);

}

function initialize() {

	var shapeData = getObject($("#shapeData").val());
	mapCenter = shapeData["mapCenter"]
	drawingModesSelector = ["rectangle"]
	
	drawMap(mapCenter,drawingModesSelector);
	setVolumeData();
	addShape(shapeData);

}


function setPolygonListeners(polygon) {

	google.maps.event.addListener(polygon, 'capturing_changed', function() { 
		window.setTimeout(function() {
			complexPath = shape.getPath();
			path = complexPath["b"];
    		updatePolygon(path);
		}, DELAY);
	});
};

function setRectangleListeners(rectangle) {

	google.maps.event.addListener(rectangle, 'bounds_changed', function() {
		shape = this;
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


function setVolumeData(data) {
	if (data) {
		volumeData = data["volumeData"]
	} else {
		volumeData = $("#volumeData").val()
	};

	volumeData = getObject(volumeData)

	$("#range").val(volumeData["range"]);
	$("#area").val(volumeData["area"]);
	$("#volume").val(volumeData["volume"]);

};
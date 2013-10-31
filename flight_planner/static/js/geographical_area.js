//index

$("#map-information").hide();

function toggleHelp(helpTitle) {
	$("#range-panel").hide();
	$("#shape-panel").hide();
	$("#edit-panel").hide();
	$("#next").hide();
	if (helpTitle == "shape-panel") {
		$("#shape-panel").show();
	} else if (helpTitle == "edit-panel") {
		$("#edit-panel").show();
		$("#next").show();
	} else if (helpTitle == "range-panel") {
		$("#range-panel").show();
	};
};

function toggleControls(){
	$("#map-information").toggle();
	$("#map-controls").toggle();
}

function updateAltitude (altitudeData) {

	altitudeData = JSON.stringify(altitudeData)
	$.post( "post_altitude",{"postField":altitudeData}, function(data){
		update(data)
		toggleHelp("shape-panel");
	} ,"json");
}

function updateMap (shapeData) {

	console.log(shapeData); 
	shapeData = JSON.stringify(shapeData)

	$.post( "post_shape",{"postField":shapeData}, function(data){
		update(data)
		$("#map-controls").hide();
		$("#map-information").show();
		toggleHelp("edit-panel");
	} ,"json");
};

function addShape(shapeData) {

	type = shapeData["type"];
	bounds = shapeData["bounds"];
	mapCenter = shapeData["mapCenter"];

	if ((shapeData["type"] == "none") || (bounds == null)) {
		return null;
	};

	if (type == "rectangle") {
		var rectangleBounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(bounds[0][0], bounds[0][1]),
			new google.maps.LatLng(bounds[1][0], bounds[1][1])
			);
		var existingShape = new google.maps.Rectangle($.extend({bounds:rectangleBounds},DEFAULT_SHAPE_FORMAT));
	} else {
		return null;
	};

	existingShape.setMap(map);
	shape = existingShape;
	setRectangleListeners(existingShape);
};

function initialize() {

	var shapeData = getObject($("#shapeData").val());
	var markerData = getObject($("#markerData").val());

	mapCenter = shapeData["mapCenter"]
	drawingModesSelector = ["rectangle"]
	
	drawMap(mapCenter,drawingModesSelector);
	setVolumeData();
	addShape(shapeData);
	addAllMarkers(markerData);

	toggleHelp("range-panel");
};

function setRectangleListeners(rectangle) {

	google.maps.event.addListener(rectangle, 'bounds_changed', function() {
		shape = this;
		window.setTimeout(function() {
      		var rectangleBounds = shape.getBounds();
    		updateRectangle(rectangleBounds);
    	}, DELAY);
	});
};

function updateRectangle(rectangleBounds) {
	//function to obtain the path and area of a rectangle and post the change

	var rectangleNorthEastBounds = rectangleBounds.getNorthEast();
	var rectangleSouthWestBounds = rectangleBounds.getSouthWest();
	var rectangleNorthWestBounds = new google.maps.LatLng(rectangleNorthEastBounds.lat(), rectangleSouthWestBounds.lng());
	var rectangleSouthEastBounds = new google.maps.LatLng(rectangleSouthWestBounds.lat(), rectangleNorthEastBounds.lng());

	var rectanglePath = [rectangleNorthEastBounds, rectangleSouthEastBounds, rectangleSouthWestBounds, rectangleNorthWestBounds, rectangleNorthEastBounds]; 
	var rectangleArea = google.maps.geometry.spherical.computeArea(rectanglePath);

	updateMap({"type":"rectangle","bounds":rectangleBounds,"area":rectangleArea})
};

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
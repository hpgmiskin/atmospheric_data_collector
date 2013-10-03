//flight_planner_base.js

var DELAY = 200
var DEFAULT_SHAPE_FORMAT = {
		editable: true,
		strokeColor : "#FFFFFF",
		strokeOpacity : 0.8,
		strokeWeight : 2,
		fillColor : "#FFFFFF",
		fillOpacity : 0.35
	};
var DEFAULT_MARKER_FORMAT = {
	draggable : true,
	flat : true
};

function getObject(jsonString) {
	//returns the object assoicated with the given JSON string

	if ((jsonString.length < 1)||(typeof(jsonString) != "string"))  {
		return [50.935531, -1.396047];
	};

	var sanitisedJASONString = jsonString.replace(/'/g, '"');
	return JSON.parse(sanitisedJASONString);
};

function drawMap(mapCenter,drawingModesSelector) {

	var myOptions = {
		center : new google.maps.LatLng(mapCenter[0],mapCenter[1]),
		zoom : 16,
		mapTypeId : google.maps.MapTypeId.HYBRID
	};

	map = new google.maps.Map(document.getElementById('map_canvas'), myOptions); 

	 // google.maps.event.addListenerOnce(map, 'idle', function() {
	 // 	addMarker();
	 // });

	setDrawingManager(drawingModesSelector)

	google.maps.event.addListener(drawingManager, 'markercomplete', function(marker) {
		var markerPosition = marker.getPosition();
		updateMarker(marker);
		setMarkerListeners(marker);
		shape = marker;
	});

	google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
		if (typeof(shape) != "undefined") {
			shape.setMap(null);
		};
		complexPath = polygon.getPath();
		path = complexPath["b"];
		updatePolygon(path);
		setPolygonListeners(polygon);
		shape = polygon;
	});

	google.maps.event.addListener(drawingManager, 'rectanglecomplete' , function(rectangle) {
		if (typeof(shape) != "undefined") {
			shape.setMap(null);
		};
		var path = rectangle.getBounds()
		updateRectangle(path)
		setRectangleListeners(rectangle);
		shape = rectangle;
	});

};


function setDrawingManager(drawingModesSelector) {

	var allDrawingModes = {
		"marker" : google.maps.drawing.OverlayType.MARKER,
		"polygon" : google.maps.drawing.OverlayType.POLYGON,
		"circle" : google.maps.drawing.OverlayType.CIRCLE,
		"rectangle" : google.maps.drawing.OverlayType.RECTANGLE
	};

	drawingModes = [];
	for (var i = 0; i < drawingModesSelector.length; i++) {
		drawingModes.push(allDrawingModes[drawingModesSelector[i]]);
	};

	drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode : null,
		drawingControl : true,
		drawingControlOptions : {
			position : google.maps.ControlPosition.TOP_CENTER,
			drawingModes : drawingModes
		},
		markerOptions : DEFAULT_MARKER_FORMAT,
		rectangleOptions : DEFAULT_SHAPE_FORMAT,
		polygonOptions : DEFAULT_SHAPE_FORMAT
	});
	drawingManager.setMap(map);
};
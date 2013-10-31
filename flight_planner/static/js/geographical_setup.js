// //index

var map; 
var shape;
var markerTitles = ["Home","Takeoff","Landing"];
var markerSelect = 0;

$("#takeoff").hide();
$("#landing").hide();


function initialize() {

	var drawingModesSelector = ["marker"]
	var mapCenter = getObject($("#mapCenter").val());
	drawMap(mapCenter,drawingModesSelector);

};

google.maps.event.addDomListener(window, 'load', initialize); 




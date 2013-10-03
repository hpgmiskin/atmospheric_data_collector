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


function update(data) {
	console.log(data);
	shape.setMap(null);
	title = data["title"];
	position = data["position"];
	icon = data["icon"];
	shadow = data["shadow"];
	addMarker(title,position,icon,shadow);

	if (title == "Home") {
		$("#takeoff").show();
	} else if (title == "Takeoff") {
		$("#landing").show();
	};
};

function addMarker(title,position,icon,shadow) {

	console.log(position)

	var point = new google.maps.LatLng(position[0],position[1]);
	console.log(point);
	var marker = new google.maps.Marker({
		draggable : true,
		position: point,
		map: map,
		title : title,
		icon: icon,
		shadow: shadow
	});

	marker.setMap(map);
};


function setMarkerListeners(marker) {
	//setupd the functions that will be called when the marker has been dragged to location

	google.maps.event.addListener(marker, 'dragend', function() {
		markerLocation = this.getPosition();
    	updateMarker(this);
	});
};


function updateMarker(marker) {
	//function to obtain the path and area of a polygon and post the change

	position = marker.getPosition();
	title = marker.getTitle()

	console.log(title)

	if (typeof(title) == "undefined") {
		title = markerTitles[markerSelect];
		markerSelect ++;
		if (markerSelect > 2){
			markerSelect = 0;
		};
	};

	console.log(title)

	markerData = {"title":title,"position":position};
	markerData = JSON.stringify(markerData);

	$.post( "post_marker",{"postField":markerData}, function(data){
		update(data);
	} ,"json");

};
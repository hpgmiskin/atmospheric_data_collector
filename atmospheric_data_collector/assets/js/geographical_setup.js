//geographical-setup

function toggleHelp(helpTitle) {
	$("#home").hide();
	$("#takeoff").hide();
	$("#landing").hide();
	$("#nextA").hide();
	$("#nextB").hide();

	if (helpTitle == "home") {
		$("#home").show();
	} else if (helpTitle == "landing") {
		$("#landing").show();
	} else if (helpTitle == "takeoff") {
		$("#takeoff").show();
	} else {
		$("#nextA").show();
		$("#nextB").show();
	};
};

function initialize() {

	var drawingModesSelector = ["marker"]
	var mapCenter = getObject($("#mapCenter").val());
	var markerData = getObject($("#markerData").val());
	drawMap(mapCenter,drawingModesSelector);
	addAllMarkers(markerData);
	toggleHelp("home")

};

google.maps.event.addDomListener(window, 'load', initialize); 
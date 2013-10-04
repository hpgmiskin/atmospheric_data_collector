# Create your views here.

from django.shortcuts import render,redirect
from flight_planner.logic import geolocation

from django.views.decorators.csrf import csrf_protect,csrf_exempt
from django.http import HttpResponse
from django.template import RequestContext
#from django.shortcuts import render_to_response

import json,re

SLIDER_VALUES = [100,600]
volume = geolocation.Volume()
marker = geolocation.Marker()

@csrf_exempt
def home(request):
	"view for index of flight_planner"

	panels = [
		{"id":"plane-setup","title":"Plane Setup","content":"Used to set plane configuration"},
		{"id":"geographical-setup","title":"Geographical Setup","content":"Used to define what the are of interest is"},
		{"id":"route-preview","title":"Route Preview","content":"Plots a 3D graph of the predicted route"}
	]

	data = {"panels":panels}

	return render(request, 'flight_planner_index.html', data)

@csrf_exempt
def planeSetup(request):
	"view to deal with setting of plane configuration"

	planeForm = [
		{"id":"plane-speed","label":"Plane Speed","placeholder":"Speed (m/s)"},
		{"id":"plane-turn","label":"Max Turn Angle","placeholder":"Angle (deg)"},
		{"id":"plane-time","label":"Max Flight Time","placeholder":"Time (minutes)"}
		]

	print(planeForm)

	data = {
		"planeForm" : planeForm
		}

	return render(request, 'plane_setup.html', data)

@csrf_exempt
def geographicalArea(request):

	altitudeData = volume.getAltitude()
	shapeData = volume.getShape()
	volumeData = volume.getVolume()

	panels = [
		{"id":"range-panel","title":"Altitude Range","content":"Use the slider to select the altitude range for investigation"},
		{"id":"shape-panel","title":"Flight Area","content":"Select the area for the flight path using the rectange tool at the top of the map"},
		{"id":"edit-panel","title":"Edit Area","content":"Edit the shape by selecting the hand tool and draging the rectange corners"}
	]

	data = {
		"altitudeData" : altitudeData,
		"shapeData" : shapeData,
		"volumeData" : volumeData,
		"panels" : panels
		}

	return render(request, 'geographical_area.html', data)

@csrf_exempt
def geographicalSetup(request):
	"view to deal with setting of plane configuration"

	mapCenter = volume.getMapCenter()
	panels = [
		{"id":"home","title":"Home","content":"Please select a home location using a map marker"},
		{"id":"takeoff","title":"Takeoff","content":"Please select a location to takeoff using a map marker"},
		{"id":"landing","title":"Landing","content":"Please select a location to land using a map marker"}
	]

	data = {
		"mapCenter" : mapCenter,
		"panels" : panels
		}

	return render(request, 'geographical_setup.html', data)

@csrf_exempt
def routePreview(request):
	"view to deal with setting of plane configuration"

	data = {
		"test" : "test"
		}

	return render(request, 'route_preview.html', data)

@csrf_exempt
def postShape(request):

	shapeData = request.POST["postField"]
	shapeData = json.loads(shapeData)

	if (shapeData == volume.getShape()):
		return None

	volume.setShape(shapeData)

	altitudeData = volume.getAltitude()
	shapeData = volume.getShape()
	volumeData = volume.getVolume()

	data = {
		"altitudeData" : altitudeData,
		"shapeData" : shapeData,
		"volumeData" : volumeData
		}

	json_data = json.dumps(data)
	# json data is just a JSON string now. 
	return HttpResponse(json_data, mimetype="application/json")

@csrf_exempt
def postAltitude(request):

	altitudeData = request.POST["postField"][1:-1]
	altitudeData = json.loads(altitudeData)

	volume.setAltitude(altitudeData)

	altitudeData = volume.getAltitude()
	shapeData = volume.getShape()
	volumeData = volume.getVolume()

	data = {
		"altitudeData" : altitudeData,
		"shapeData" : shapeData,
		"volumeData" : volumeData
		}

	json_data = json.dumps(data)

	return HttpResponse(json_data, mimetype="application/json")

@csrf_exempt
def postMarker(request):

	markerData = request.POST["postField"]

	marker.setMarker(markerData)
	print(marker.home)
	jsonResponce = marker.getLastMarker()

	print("----------------")
	print(jsonResponce)
	#test = json.loads(jsonResponce)

	return HttpResponse(jsonResponce, mimetype="application/json")


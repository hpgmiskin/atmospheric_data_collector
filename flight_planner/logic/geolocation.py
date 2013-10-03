import json,re

STANDARD_MIN_ALTITUDE,STANDARD_MAX_ALTITUDE = 0,100
DEFAULT_MAP_CENTER = [50.935531, -1.396047]

def average(inputList):
	"returns the average of the object"

	if (type(inputList) != list):
		return inputList
	elif (len(inputList) < 1):
		return inputList[0]

	return sum(inputList)/len(inputList)

def dumpJSON(inputObject):
	"returns the anitised json string for the object"

	jsonString = json.dumps(inputObject)
	#jsonString = re.sub(r'"', "'", jsonString)

	return jsonString

def loadJSON(inputString):
	"returns the JSON string as an object"

	return json.loads(inputString)


class Marker:
	"""class that holds the infromation regarding markers home takeoff and landing"""

	def __init__(self):
		self.home = {	
						"title" : "none",
						"updated" : 0,
						"position" : DEFAULT_MAP_CENTER,
						"icon" : "/static/images/home.png",
						"shadow" : "/static/images/home.shadow.png"
					}
		self.takeoff = {	
						"title" : "none",
						"updated" : 0,
						"position" : DEFAULT_MAP_CENTER,
						"icon" : "/static/images/start.png",
						"shadow" : "/static/images/start.shadow.png"
					}
		self.landing = {	
						"title" : "none",
						"updated" : 0,
						"position" : DEFAULT_MAP_CENTER,
						"icon" : "/static/images/end.png",
						"shadow" : "/static/images/end.shadow.png"
					}

	def setMarker(self,markerData):
		"sets the class data according to the marker data string provided"

		markerData = loadJSON(markerData)

		markerTitle = markerData["title"]
		markerPosition = markerData["position"]
		markerPosition = [markerPosition["lb"],markerPosition["mb"]]

		self.home["updated"] = 0
		self.takeoff["updated"] = 0
		self.landing["updated"] = 0

		if (markerTitle.lower() == "home"):
			self.home["title"] = markerTitle
			self.home["updated"] = 1
			self.home["position"] = markerPosition
		elif (markerTitle.lower() == "takeoff"):
			self.takeoff["title"] = markerTitle
			self.takeoff["updated"] = 1
			self.takeoff["position"] = markerPosition
		elif (markerTitle.lower() == "landing"):
			self.landing["title"] = markerTitle
			self.landing["updated"] = 1
			self.landing["position"] = markerPosition

	def getLastMarker(self):
		"returns the json string of the last update marker"

		if (self.home["updated"] == 1):
			return dumpJSON(self.home)
		elif (self.takeoff["updated"] == 1):
			return dumpJSON(self.takeoff)
		elif (self.landing["updated"] == 1):
			return dumpJSON(self.landing)
		else:
			return None

	def getAllMarker(self):
		"returns the json sting for all the marker data"


class Volume:
	"""
	class that ties together altitude and shape to produce a Volume
	"""

	def __init__(self):
		self.volume = 0
		self.shape = Shape(None)
		self.altitude = Altitude(None)
		
	def setShape(self,shapeData):
		self.shape = Shape(shapeData)
		self.setVolume()

	def setAltitude(self,altitudeData):
		self.altitude = Altitude(altitudeData)
		self.setVolume()

	def setVolume(self):
		"sets the value from class variables"

		altitude = self.altitude
		shape = self.shape

		altitudeRange = altitude.getRange()
		areaSize = shape.getArea()

		self.area = areaSize
		self.range = altitudeRange
		self.volume =  altitudeRange * areaSize

	def getVolume(self):
		"returns the volume of the area"

		self.setVolume()

		altitudeRange = int(self.range)
		areaSize = int(self.area)
		volumeSize = int(self.volume)

		output = dumpJSON({"range":altitudeRange,"area":areaSize,"volume":volumeSize})

		return output

	def getMapCenter(self):
		"returns the current map center"

		return self.shape.getMapCenter()


	def getAltitude(self):
		return self.altitude.getAltitude()

	def getShape(self):
		return self.shape.getShape()

class Altitude:
	"""
	class that defines the altitude of the expected area
	"""

	def __init__(self,altitudeData):
		if (altitudeData == None):
			self.type="none"
			self.minAltitude = STANDARD_MIN_ALTITUDE
			self.maxAltitude = STANDARD_MAX_ALTITUDE
		else:
			self.type = "altitude"
			self.minAltitude = altitudeData[0]
			self.maxAltitude = altitudeData[1]

	def getRange(self):
		"returns the range between the max and min altitudes"

		minAltitude = self.minAltitude
		maxAltitude = self.maxAltitude

		altitudeRange = abs(maxAltitude-minAltitude)

		print(altitudeRange)
		return altitudeRange

	def getAltitude(self):
		"returns a list of max and min altitudes"

		minAltitude = self.minAltitude
		maxAltitude = self.maxAltitude

		return [minAltitude,maxAltitude]


class Shape:
	"""
	class to define all interactions with the shape drawn in google maps

	"""

	def __init__(self,shapeData):
		if ((shapeData == None) or (shapeData["type"] == "none")):
			self.type = "none"
			self.area = 0
			self.mapCenter = DEFAULT_MAP_CENTER
		else:
			self.type = shapeData["type"]
			self.path = shapeData["path"]
			self.area = float(shapeData["area"])
			self.setPath()

	def setPath(self):
		"standardises the path to be a lsit of tuples of lat lng"

		originalPath = self.path

		if (type(originalPath) == str):
			originalPath = json.loads(originalPath)

		if (self.type == "polygon") and (type(originalPath) == dict):
			if ("b" in originalPath.keys()):
				originalPath = originalPath["b"]

		if (type(originalPath[0]) == list):
			return None

		newPath = []

		for point in originalPath:
			newPath.append((point["lb"],point["mb"]))

		self.path = newPath
		self.setMapCenter()

	def setMapCenter(self):
		"calculates the average LatLng of the points on the path"

		shapePath = self.path

		latList = []
		lngList = []

		for point in shapePath:
			latList.append(point[0])
			lngList.append(point[1])

		mapCenter = [average(latList),average(lngList)]
		#print("----------------- {}".format(mapCenter))

		self.mapCenter = mapCenter

	def getType(self):
		"returns the type of shape"

		shapeType = self.type
		return shapeType

	def getPath(self):
		"returns the points of the path of the shape"

		shapePath = self.path
		return shapePath

	def getArea(self):
		"returns the area of the shape in m^2"

		shapeArea = self.area
		print(shapeArea)
		return shapeArea

	def getMapCenter(self):
		"returns the average LatLng of the points on the path"

		mapCenter = self.mapCenter
		return mapCenter

	def getShape(self):

		shapeType = self.getType()
		mapCenter = self.getMapCenter()

		if (shapeType == "none"):
			return {"type":shapeType,"mapCenter":mapCenter}

		shapePath = self.getPath()
		mapCenter = self.getMapCenter()

		output = dumpJSON({"type":shapeType,"path":shapePath,"mapCenter":mapCenter})

		#print(output)
		return output
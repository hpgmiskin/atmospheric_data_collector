from geopie import geocoders,point,distance

googleV3 = geocoders.GoogleV3()
place1, (lat1,lng1) = googleV3.geocode("GL5 2LX")
place2, (lat2,lng2) = googleV3.geocode("GL5 2LX")

print("PLace: {} - ({},{})".format(place1,lat1,lng1))
print("PLace: {} - ({},{})".format(place2,lat2,lng2))

lat2,lng2,altitude = point.point([50.935531, -1.396047])

kmDistance = distance.distance(place1,place2)
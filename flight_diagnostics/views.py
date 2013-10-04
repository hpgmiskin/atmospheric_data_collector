# Create your views here.

from django.shortcuts import render
from flight_diagnostics.logic import plotting

def home(request):

	filename = "test_graph"

	#filetype = "png"
	#filepath = "/static/images/{}.{}".format(filename,filetype)

	filepath = plotting.testPlot(filename)

	data = {
		"filepath" : filepath
	}

	return render(request,"flight_diagnostics_index.html",data)
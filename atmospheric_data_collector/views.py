from django.shortcuts import render
import os

def home(request):

	content = "test"

	return render(request,"index.html",{
		"content" : content
		})
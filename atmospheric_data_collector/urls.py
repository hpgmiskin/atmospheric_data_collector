from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

ROOT_URL = "atmospheric_data_collector"

urlpatterns = patterns(ROOT_URL,
	url(r'^{}/$'.format(ROOT_URL), 'views.home', name='home'),
	url(r'^{}/flight_planner/'.format(ROOT_URL), include('flight_planner.urls')),
	url(r'^{}/flight_diagnostics/'.format(ROOT_URL), include('flight_diagnostics.urls')),
	url(r'^{}/control_panel/'.format(ROOT_URL), include('control_panel.urls'))
	
)

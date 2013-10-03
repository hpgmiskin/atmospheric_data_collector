from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('control_panel',

    url(r'^$', 'views.home', name='home'),
    url(r'^user_settings$', 'views.userSettings', name='userSettings'),
    url(r'^plane_configuration$', 'views.planeConfiguration', name='planeConfiguration'),
    url(r'^location_services$', 'views.locationServices', name='locationServices'),
    url(r'^flight_archive$', 'views.flightArchive', name='flightArchive'),

    # SERVICES
    url(r'^post_data$', 'views.postData', name='postData')
    
)
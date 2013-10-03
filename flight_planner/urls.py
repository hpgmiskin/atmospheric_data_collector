from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('flight_planner',

    url(r'^$', 'views.home', name='home'),
    url(r'^plane_setup$', 'views.planeSetup', name='planeSetup'),
    url(r'^geographical_setup$', 'views.geographicalSetup', name='geographicalSetup'),
    url(r'^route_preview$', 'views.routePreview', name='routePreview'),

    # SERVICES
    url(r'^post_shape$', 'views.postShape', name='postShape'),
    url(r'^post_altitude$', 'views.postAltitude', name='postAltitude')
    
)

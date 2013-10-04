from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('flight_diagnostics',

    url(r'^$', 'views.home', name='home'),
    url(r'^route_analysis$', 'views.routeAnalysis', name='routeAnalysis'),
    url(r'^data_feed$', 'views.dataFeed', name='dataFeed'),
    url(r'^flight_results$', 'views.flightResults', name='flightResults'),

    # SERVICES
    url(r'^post_data$', 'views.postData', name='postData')
    
)
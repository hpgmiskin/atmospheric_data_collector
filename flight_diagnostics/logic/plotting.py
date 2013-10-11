import matplotlib
from mpl_toolkits.mplot3d import Axes3D
import numpy
import matplotlib.pyplot as pyplot

#from settings import ROOT


class Plotting:

	def __init__(self):
		self.filename = None

def testPlot(filename):
	"test plotting function to see 3D graphs"

	matplotlib.rcParams['legend.fontsize'] = 10

	fig = pyplot.figure()
	ax = fig.gca(projection='3d')
	theta = numpy.linspace(-4 * numpy.pi, 10 * numpy.pi, 100)
	z = numpy.linspace(-2, 2, 100)
	r = z**2 + 1
	x = r * numpy.sin(theta)
	y = r * numpy.cos(theta)
	ax.plot(x, y, z, label='parametric curve')
	ax.legend()

	module = "flight_diagnostics"
	filetype = "png"
	filepath = "/static/images/{}.{}".format(filename,filetype)

	pyplot.savefig(module+filepath)

	return filepath
#! /usr/bin/python

from __future__ import division
from random import random
from math import pi
from tabulate import tabulate
import matplotlib.pyplot as plt 

def rainDrop(lengthOfField = 1):
    """Simular la caída de una gota de lluvia
    (Numeros pseudoaleatorios)"""
    return [(0.5- random())*lengthOfField, (0.5 - random())*lengthOfField]

def isPointInCircle(point, lengthOfField):
    """Devuelve true si el punto esta inscrito en el círculo"""
    return (point[0] ** 2 + point[1] ** 2 <= (lengthOfField/2) ** 2)

def plotRainDrops(dropInCircle, dropsOutOfCircle, lengthOfField=1, format = 'pdf'):
    numberOfDropsInCircle = len(dropInCircle)
    numberOfDropsOutCircle = len(dropInCircle)
    numberOfDrops = numberOfDropsInCircle + numberOfDropsOutCircle
    plt.figure()
    plt.xlim(-lengthOfField/2, lengthOfField/2)
    plt.ylim(-lengthOfField/2, lengthOfField/2)
    plt.scatter([e[0] for e in dropInCircle], [e[1] for e in dropInCircle], color = 'black', label = 'Drops en circle')
    plt.scatter([e[0] for e in dropsOutOfCircle], [e[1] for e in dropsOutOfCircle], color = 'red', label = 'Drops fuera circle')
    plt.legend(loc='center')
    plt.title("%s drop: %s landed in circle, estimating $\pi$ as %.4f" %(numberOfDrops, numberOfDropsInCircle, 4 * numberOfDropsInCircle/numberOfDrops))
    plt.savefig("%s_drops.%s" % (numberOfDrops, format))

table = []

def rain(numberOfDrops=100, lengthOfField = 1, plot=True, format = 'pdf', dynamic=False):
    numberOfDropsInCircle = 0
    dropsInCircle = []
    dropsOutOfCircle = []
    piEstimate = []
    row = []
    for k in range(numberOfDrops):
        row.append(k + 1)
        d=(rainDrop(lengthOfField))
        row.append(d[0].__round__(4))
        row.append(d[1].__round__(4))
        if isPointInCircle(d, lengthOfField):
            dropsInCircle.append(d)
            row.append('Si')
            numberOfDropsInCircle +=1
        else:
            row.append('No')
            dropsOutOfCircle.append(d)
        row.append(numberOfDropsInCircle)
        if dynamic:
            print("Plotting drop number: %s", (k + 1))
            plotRainDrops(dropsInCircle, dropsOutOfCircle, lengthOfField, format)
        piEstimate.append(4*numberOfDropsInCircle/(k + 1))
        table.append(row)
        row = []
    print(tabulate(table))

    plt.figure()
    plt.scatter(range(1, numberOfDrops+ 1), piEstimate)
    maxX = plt.xlim()[1]
    plt.hlines(pi, 0, maxX, color = 'white')
    plt.xlim(0, maxX)
    plt.title("$\pi$ estimate agains number of rain drops")
    plt.xlabel("Number of rain drops")
    plt.ylabel("$\pi$")
    plt.savefig("PiEstimateFor%sDropsThrown.pdf" %numberOfDrops)

    if plot and not dynamic:
        plotRainDrops(dropsInCircle, dropsOutOfCircle, lengthOfField, format)
    return[numberOfDropsInCircle, numberOfDrops]

if __name__ == "__main__":
    from sys import argv
    numberOfDrops = 100
    if len(argv)>1:
        numberOfDrops = eval(argv[1])
    r = rain(numberOfDrops, plot=True, format='png', dynamic=False)

    print("-------------------")
    print("%s drops" % numberOfDrops)
    print("Pi estimated as: ")
    print("\t%s" %(4*r[0]/r[1]))
    print("-------------------")
from random import random

def monteCarloEstimacio():
    pointsInCircle = 1
    totalPoints = 0
    pi = 0
    numIterations = 100000

    for z in range(0, numIterations):
        x = random.uniform(0,2)
        y = random.uniform(0,2)
        inCircle = math.pow((x-1), 2) + math.pow((y-1), 2) <=1
        if inCircle:
            pointsInCircle +=1
        totalPoints +=1
        pi = 4*(pointsInCircle / totalPoints)
    
    print('Estimate' + str(pi)) 

monteCarloEstimacio()
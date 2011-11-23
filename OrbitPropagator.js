 var OrbitPropagator = {

    /**
     *
     *
     * @param state                    double[]
     * @param elapsedTime              double
     * @param dt                       double
     * @param timeAtStartOfPropagation date
     *
     * @returns Array of doubles
     */
    rungeKuttaFehlbergIntegrator: function(state, elapsedTime, dt, timeAtStartOfPropagation)
    {
        //fifth order runge-kutta-fehlberg integrator
        var tempState = state;

        var f = new Array();          //array of doubles[9]
        var deltaState = new Array(); //array of doubles[9]
        var dtPrime = 0.0;            //double

        var N = 1;  //int
        var h = dt; //double

        //if the timestep is too big, reduce it to a smaller timestep and loop through the updates at the smaller timestep to add up to the total timestep
        var maxResolution = 0.02; //double

        if (dt > maxResolution)
        {
            h = maxResolution;
        }

        var newMilliseconds = timeAtStartOfPropagation.getTime(); //long

        N = elapsedTime / h;

        var j = 1;

        for (j = 1; j <= N; j++)
        {
            newMilliseconds = newMilliseconds + (h * 1000.0); //keep in millis
            var simTime = new Date(newMilliseconds);
            GST = CoordinateConversionTools.convertTimeToGMST(simTime); //double

            var k1 = new Array(); //double[9]
            var k2 = new Array(); //double[9]
            var k3 = new Array(); //double[9]
            var k4 = new Array(); //double[9]
            var k5 = new Array(); //double[9]
            var k6 = new Array(); //double[9]

            //for loop counter
            var i = 0;

            //build k1
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i];
            }

            dtPrime = h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k1[i] = h * f[i];
            }

            //build k2
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + 0.25 * k1[i];
            }

            dtPrime = 0.25 * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k2[i] = h * f[i];
            }

            //build k3
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + (3.0 / 32.0) * k1[i] + (9.0 / 32.0) * k2[i];
            }

            dtPrime = 0.375 * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k3[i] = h * f[i];
            }

            //build k4
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + ((1932.0 / 2197.0) * k1[i]) -
                    ((7200.0 / 2197.0) * k2[i]) + ((7296.0 / 2197.0) * k3[i]);
            }

            dtPrime = 0.9230769230769231 * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k4[i] = h * f[i];
            }

            //build k5
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + ((439.0 / 216.0) * k1[i]) -
                    (8.0 * k2[i]) + ((3680.0 / 513.0) * k3[i]) - ((845.0 / 4104.0) * k4[i]);
            }

            dtPrime = h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k5[i] = h * f[i];
            }

            //build k6
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] - ((8.0 / 27.0) * k1[i]) +
                    ((2.0) * k2[i]) - ((3544.0 / 2565.0) * k3[i]) +
                    ((1859.0 / 4104.0) * k4[i]) - ((11.0 / 40.0) * k5[i]);
            }

            dtPrime = (0.5) * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k6[i] = h * f[i];
            }

            //generate the estimate for this step in time
            for (i = 0; i < 9; i++)
            {
                //http://en.wikipedia.org/wiki/Runge%E2%80%93Kutta%E2%80%93Fehlberg_method
                tempState[i] = tempState[i] + ((16.0 / 135.0) * k1[i]) +
                    ((6656.0 / 12825.0) * k3[i]) + ((28561.0 / 56430.0) * k4[i]) -
                    ((9.0 / 50.0) * k5[i]) + ((2.0 / 55.0) * k6[i]);
            }
        }

        return tempState;
    },

    /**
     *
     *
     * @param state double[]
     * @param dt    double
     * @param GST   double
     *
     * @returns double[]
     */
    generateStateUpdate: function(state, dt, GST)
    {
        //state is 9x1
        //state structure is x,y,z,vx,vy,vz,ax,ay,az
        var stateRateOfChange = new Array(); //double[9]
        var mu = Constants.muEarth;     //double
        var r = Math.sqrt((state[0] * state[0]) + (state[1] * state[1]) +
            (state[2] * state[2])); //double

        //figure out the rate of change of x,y,z,vx,vy,vz
        stateRateOfChange[0] = state[3]; //vx
        stateRateOfChange[1] = state[4]; //vy
        stateRateOfChange[2] = state[5]; //vz
        stateRateOfChange[3] = -mu * state[0] / (r * r * r); //ax
        stateRateOfChange[4] = -mu * state[1] / (r * r * r); //ay
        stateRateOfChange[5] = -mu * state[2] / (r * r * r); //az
        stateRateOfChange[6] = 0.0;
        stateRateOfChange[7] = 0.0;
        stateRateOfChange[8] = 0.0;
       
        return stateRateOfChange;
    },

    /**
     *
     * @param eci                      ECICoordinates
     * @param elapsedTime              double
     * @param dt                       double, time-step
     * @param timeAtStartOfPropagation Date
     *
     * @returns ECICoordinates
     */
    propagateOrbit: function(eci, elapsedTime, dt, timeAtStartOfPropagation)
    {
        
        var kep = CoordinateConversionTools.convertECIToKeplerian(eci);
console.log('eccentricity: ' + JSON.stringify(kep));
        //timespan is in seconds
        if (elapsedTime == 0.0)
        {
            return eci;
        }
        else if(kep.getEccentricity() <= 0.05) {
            
            var MA = kep.getMeanAnomaly()+kep.getMeanMotion()*elapsedTime; //update the mean anomaly (deg)
            var w = MathTools.toRadians(kep.getArgOfPerigee());
            var ra = MathTools.toRadians(kep.getRaan());
            var inc = MathTools.toRadians(kep.getInclination());
            var ecc=kep.getEccentricity();
            var mu=Constants.muEarth;
            //System.out.println("elapsed time: "+elapsedTime+" dt: "+dt+" ecc: "+kep.getEccentricity());
            console.log("MA: "+kep.getMeanAnomaly()+" meanMotion: "+kep.getMeanMotion()+" new MA: "+MA);
            MA = MathTools.toRadians(MA);  //convert the mean anomaly to radians
            //iterate to solve for the eccentric anomaly
            var EA = MA * 0.95; //fist guess at the eccentric anomaly (rads)
            var errorThreshold = 1e-5;  //how accurately do we need to solve for the eccentric anomaly?
            for (var i = 0; i < 500; i++)
            {
                var myerror = MA - (EA - ecc * Math.sin(EA));
                if (Math.abs(myerror) > errorThreshold)
                {
                    if (myerror > 0)
                    {
                        EA = EA + Math.abs(MA - EA) / 2;
                    }
                    else
                    {
                        if (myerror < 0)
                        {
                            EA = EA - Math.abs(MA - EA) / 2;
                        }
                    }
                }
                else
                {
                    break;
                }

            }

            var f = 2 * Math.atan(Math.sqrt((1 + ecc) / (1 - ecc)) * Math.tan(EA / 2));
            var p = kep.getSemimajorAxis() * (1 -ecc * ecc);
            var r = kep.getSemimajorAxis() * (1 -ecc* Math.cos(EA)); //radius
            var h = Math.sqrt(mu * kep.getSemimajorAxis() * (1 - ecc* ecc));
            var x = r * (Math.cos(ra) * Math.cos(w + f) - Math.sin(ra) * Math.sin(w + f) * Math.cos(inc));
            var y = r * (Math.sin(ra) * Math.cos(w + f) + Math.cos(ra) * Math.sin(w + f) * Math.cos(inc));
            var z = r * Math.sin(inc) * Math.sin(w + f);
            var xdot = ((x * h * ecc) / (r * p)) * Math.sin(f) - (h / r) * (Math.cos(ra) * Math.sin(w + f) + Math.sin(ra) * Math.cos(w + f) * Math.cos(inc));
            var ydot = ((y * h * ecc) / (r * p)) * Math.sin(f) - (h / r) * (Math.sin(ra) * Math.sin(w + f) - Math.cos(ra) * Math.cos(w + f) * Math.cos(inc));
            var zdot = ((z * h * ecc) / (r * p)) * Math.sin(f) + (h / r) * (Math.sin(inc) * Math.cos(w + f));

            //System.out.println(vehicleName+","+x+","+y+","+z+","+xdot+","+ydot+","+zdot);
            var eciState = new ECICoordinates();

            eciState.setX(x);
            eciState.setY(y);
            eciState.setZ(z);
            eciState.setVX(xdot);
            eciState.setVY(ydot);
            eciState.setVZ(zdot);
            eciState.setAX(0.0);
            eciState.setAY(0.0);
            eciState.setAZ(0.0);
            return eciState;
        }
        else
        {
            var state = new Array();     //double[9]

            //establish the starting state vector;
            state[0] = eci.x;
            state[1] = eci.y;
            state[2] = eci.z;
            state[3] = eci.vx;
            state[4] = eci.vy;
            state[5] = eci.vz;
            state[6] = eci.ax;
            state[7] = eci.ay;
            state[8] = eci.az;

            //call the integrator
            var updatedState =  //double[]
               this.rungeKuttaFehlbergIntegrator(state, elapsedTime, dt, timeAtStartOfPropagation);

            //console.log("updatedState: " + JSON.stringify(updatedState));
            //translate the integrated values into the correct class structure
            var newEci = new ECICoordinates(
                updatedState[0], 
                updatedState[1], 
                updatedState[2], 
                updatedState[3], 
                updatedState[4], 
                updatedState[5], 
                updatedState[6], 
                updatedState[7], 
                updatedState[8]); //ECICoordinates
            //console.log("newEci: " + JSON.stringify(newEci));
            return newEci;
        }
    }
};
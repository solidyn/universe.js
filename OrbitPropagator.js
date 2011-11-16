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

        for (int j = 1; j <= N; j++)
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

            f = generateStateUpdate(deltaState, dtPrime, GST);

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

            f = generateStateUpdate(deltaState, dtPrime, GST);

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

            f = generateStateUpdate(deltaState, dtPrime, GST);

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

            f = generateStateUpdate(deltaState, dtPrime, GST);

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

            f = generateStateUpdate(deltaState, dtPrime, GST);

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

            f = generateStateUpdate(deltaState, dtPrime, GST);

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
        var mu = Constants.getMuEarth();     //double
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
     * @param dt                       double
     * @param timeAtStartOfPropagation Date
     *
     * @returns ECICoordinates
     */
    propagateOrbit: function(eci, elapsedTime, dt, timeAtStartOfPropagation)
    {
        //timespan is in seconds
        if (elapsedTime == 0.0)
        {
            return eci;
        }
        else
        {
            var newEci = ECICoordinates; //ECICoordinates
            var state = new Array();     //double[9]

            //establish the starting state vector;
            state[0] = eci.getX();
            state[1] = eci.getY();
            state[2] = eci.getZ();
            state[3] = eci.getVx();
            state[4] = eci.getVy();
            state[5] = eci.getVz();
            state[6] = eci.getAx();
            state[7] = eci.getAy();
            state[8] = eci.getAz();

            //call the integrator
            var updatedState =  //double[]
               rungeKuttaFehlbergIntegrator(state, elapsedTime, dt, timeAtStartOfPropagation);

            //translate the integrated values into the correct class structure
            newEci.setX(updatedState[0]);
            newEci.setY(updatedState[1]);
            newEci.setZ(updatedState[2]);
            newEci.setVx(updatedState[3]);
            newEci.setVy(updatedState[4]);
            newEci.setVz(updatedState[5]);
            newEci.setAx(updatedState[6]);
            newEci.setAy(updatedState[7]);
            newEci.setAz(updatedState[8]);

            return newEci;
        }
    }
};
var MathTools = {

    /**
     *
     * @param x double[]
     * @param a double
     *
     * @returns Array of double
     */
    scalarMultiply: function(x, a)
    {
        var N = x.length;          //int
        var xTimesA = new Array(); //Double[N];

        for (var i = 0; i < N; i++)
        {
            xTimesA[i] = x[i] * a;
        }

        return xTimesA;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns double
     */
    dotMultiply: function(x,  y)
    {
        if (x.length != y.length)
        {
            //console.log("lengths not the same");
            return 0.0;
        }
        else
        {
            var N = x.length; //int
            var xDotY = 0.0;  //double

            for (var i = 0; i < N; i++)
            {
                //console.log("x[" + i + "]: " + x[i])
                //console.log("y[" + i + "]: " + y[i])

                xDotY += (x[i] * y[i]);
                //console.log("xDotY: " + xDotY);
            }

            return xDotY;
        }
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns double
     */
    angleBetweenTwoVectors: function(x, y)
    {
        var angle = 0;                 //double
        var magX = magnitude(x);       //double
        var magY = magnitude(y);       //double
        var xDotY = dotMultiply(x, y); //double

        angle = Math.toDegrees(Math.acos(xDotY / (magX * magY)));

        return angle; //deg
    },

    /**
     *
     * @param x Double[]
     *
     * @returns double
     */
    magnitude: function(x)
    {
        var vectorMagnitude = 0; //double
        vectorMagnitude = Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);

        return vectorMagnitude;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns Array of double
     */
    cross: function(x, y)
    {
        var result = new Array(); //Double[3];

        //returns the cross product of x cross y
        result[0] = x[1] * y[2] - y[1] * x[2];    //i
        result[1] = -(x[0] * y[2] - y[0] * x[2]); //j
        result[2] = x[0] * y[1] - y[0] * x[1];    //k

        return result;
    },

    /**
     *
     * @param x   double
     * @param vec Double[]
     *
     * @returns Array of double
     */
    rot1: function(x, vec)
    {
        x = MathTools.toRadians(x);

        var result = new Array(); //Double[3];
        result[0] = vec[0];
        result[1] = Math.cos(x) * vec[1] + Math.sin(x) * vec[2];
        result[2] = -Math.sin(x) * vec[1] + Math.cos(x) * vec[2];

        return result;
    },

    /**
     *
     * @param x   double
     * @param vec Double[]
     *
     * @returns Array of double
     */
    rot2: function(x, vec)
    {
        x = MathTools.toRadians(x);
        
        var result = new Array(); //Double[3];

        result[0] = Math.cos(x) * vec[0] - Math.sin(x) * vec[2];
        result[1] = vec[1];
        result[2] = Math.sin(x) * vec[0] + Math.cos(x) * vec[2];

        return result;
    },

    /**
     *
     * @param x   double
     * @param vec Double[]
     *
     * @returns Array of double
     */
    rot3: function(x, vec)
    {
        x = MathTools.toRadians(x);

        var result = new Array(); //Double[3];

        result[0] = Math.cos(x) * vec[0] + Math.sin(x) * vec[1];
        result[1] = -Math.sin(x) * vec[0] + Math.cos(x) * vec[1];
        result[2] = vec[2];

        return result;
    },
    
    toRadians: function(valueInDegrees) {
        return valueInDegrees * Math.PI / 180.0;
    },
    
    toDegrees: function(valueInRadians) {
        return valueInRadians * 180 / Math.PI;
    }
}
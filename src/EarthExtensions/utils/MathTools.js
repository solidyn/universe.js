
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

    scalarMultiplyVector: function(x, a)
    {
        return {
            x: x.x * a,
            y: x.y * a,
            z: x.z * a
        }
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
            return 0.0;
        }
        else
        {
            var N = x.length; //int
            var xDotY = 0.0;  //double

            for (var i = 0; i < N; i++)
            {
                xDotY += (x[i] * y[i]);
            }

            return xDotY;
        }
    },

    dotMultiplyVector: function(x, y)
    {
        var xDotY = x.x * y.x + x.y * y.y + x.z * y.z;

        return xDotY;
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
        var magX = MathTools.magnitude(x);       //double
        var magY = MathTools.magnitude(y);       //double
        var xDotY = MathTools.dotMultiply(x, y); //double

        angle = MathTools.toDegrees(Math.acos(xDotY / (magX * magY)));

        if (angle > 90)
        {
            angle = 180 - angle;
        }

        return angle; //deg
    },

    /**
    * @param x - vector in {x, y, z}
    * @param y - vector in {x, y, z}
    * @return distance betewen points
    */
    distanceBetweenTwoPoints: function(x, y)
    {
        var vectorBetweenPoints = {
            x: x.x - y.x,
            y: x.y - y.y,
            z: x.z - y.z
        };

        return MathTools.magnitudeVector(vectorBetweenPoints);
    },

    /**
    * @param x1 object 1's x coordinate
    * @param x1 object 2's x coordinate
    * @param x2 object 1's y coordinate
    * @param x2 object 2's y coordinate
    * @param x3 object 1's z coordinate
    * @param x3 object 2's z coordinate
    * @return distance betewen points
    */
    distanceBetweenTwoPoints2: function(x1, y1, z1, x2, y2, z2)
    {
        var xdiff = x1 - x2;
        var ydiff = y1 - y2;
        var zdiff = z1 - z2;
        return Math.sqrt(xdiff*xdiff + ydiff*ydiff + zdiff*zdiff);
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

    magnitudeVector: function(x)
    {
        return Math.sqrt(x.x*x.x + x.y * x.y + x.z * x.z);
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

    /**
     *
     * @param valueInDegrees   double
     *
     * @returns double
     */
    toRadians: function(valueInDegrees)
    {
        // return valueInDegrees * Math.PI / 180.0;
            return valueInDegrees * Constants.piOverOneEighty;
    },

    /**
     *
     * @param valueInRadians double
     *
     * @returns double
     */
    toDegrees: function(valueInRadians)
    {
        //return valueInRadians * 180 / Math.PI;
          return valueInRadians * Constants.oneEightyOverPi;
    },

    /**
     *
     * @param x double
     *
     * @returns double[3][3]
     */
    buildRotationMatrix1: function(x)
    {
        x = MathTools.toRadians(x);
        var result = new Array(); //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = new Array();
        }

        result[0][0] = 1.0;
        result[0][1] = 0.0;
        result[0][2] = 0.0;
        result[1][0] = 0.0;
        result[1][1] = Math.cos(x);
        result[1][2] = -Math.sin(x);
        result[2][0] = 0.0;
        result[2][1] = Math.sin(x);
        result[2][2] = Math.cos(x);

        return result;
    },

    /**
     *
     * @param x double
     *
     * @returns double[3][3]
     */
    buildRotationMatrix2: function(x)
    {
        x = MathTools.toRadians(x);
        var result = new Array(); //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = new Array();
        }

        result[0][0] = Math.cos(x);
        result[0][1] = 0.0;
        result[0][2] = Math.sin(x);
        result[1][0] = 0.0;
        result[1][1] = 1.0;
        result[1][2] = 0.0;
        result[2][0] = -Math.sin(x);
        result[2][1] = 0.0;
        result[2][2] = Math.cos(x);

        return result;
    },

    /**
     *
     * @param x double
     *
     * @returns Double[][]
     */
    buildRotationMatrix3: function(x)
    {
        x = MathTools.toRadians(x);
        var result = new Array(); //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = new Array();
        }

        result[0][0] = Math.cos(x);
        result[0][1] = -Math.sin(x);
        result[0][2] = 0.0;
        result[1][0] = Math.sin(x);
        result[1][1] = Math.cos(x);
        result[1][2] = 0.0;
        result[2][0] = 0.0;
        result[2][1] = 0.0;
        result[2][2] = 1.0;

        return result;
    },

    /**
     *
     * @param N int
     *
     * @returns Double[][]
     */
    ones: function(N)
    {
        var x = new Array(); //Double[N][N];

        var i = 0;
        var j = 0;

        for(i = 0; i < N; i++)
        {
           result[i] = new Array(N);
        }

        for (i = 0; i < N; i++)
        {
            for (j = 0; j < N; j++)
            {
                if (i != j)
                {
                    x[i][j] = 0.0;
                }
                else
                {
                    x[i][j] = 1.0;
                }
            }
        }

        return x;
    },

    /**
     *
     * @param N int
     *
     * @returns Double[][]
     */
    zeros: function(N)
    {
        var x = new Array(N); //Double[3][3];

        var i = 0;
        var j = 0;

        for(i = 0; i < N; i++)
        {
           result[i] = new Array(N);
        }

        for (i = 0; i < N; i++)
        {
            for (j = 0; j < N; j++)
            {
                x[i][j] = 0.0;
            }
        }

        return x;
    },

    /**
     *
     * @param M int
     * @param N int
     *
     * @returns Double[][]
     */
    zeros: function(M, N)
    {
        var x = new Array(M); //Double[M][N];

        var i = 0;
        var j = 0;

        for(i = 0; i < M; i++)
        {
           result[i] = new Array(N);
        }

        for (i = 0; i < M; i++)
        {
            for ( j = 0; j < N; j++)
            {
                x[i][j] = 0.0;
            }
        }

        return x;
    },

    /**
     *
     * @param x 1d array
     * @param y 2d array
     *
     * @returns Double[]
     */
    multiply1dBy2d: function(x, y)
    {
        var x1 = x.length;
        var y1 = y.length;
        var y2 = y[0].length;

        if (x1 != y1)
        {
            return null;
        }

        var returnVal = new Array(y2); //Double[y2];

        for (var i = 0; i < y2; i++)
        {
            var val = 0;

            for (var j = 0; j < x1; j++)
            {
                val = val + x[j] * y[j][i];
            }

            returnVal[i] = val;
        }

        return returnVal;
    },

    /**
     *
     * @param x 2d array
     * @param y 1d array
     *
     * @returns Double[]
     */
    multiply2dBy1d: function(x, y)
    {
        //where x is MxN and Y is Nx1
        var M_x1 = x.length;
        var N_x2 = x[0].length;
        var N_y1 = y.length;

        if (N_x2 != N_y1)
        {
            return null;
        }

        var returnVal = new Array(M_x1); //Double[M_x1];

        for (var i = 0; i < M_x1; i++)
        {
            var val = 0;

            for (var j = 0; j < N_y1; j++)
            {
                val = val + x[i][j] * y[j];
            }

            returnVal[i] = val;
        }

        return returnVal;
    },

    /**
     *
     * @param h double
     * @param x 2d array
     *
     * @returns Double[][]
     */
    multiplyDoubleBy2d: function(h, x)
    {
        var M = x.length;
        var N = x[0].length;
        var hTimesX = new Array(M); //Double[M][N];

        var i = 0;
        var j = 0;

        for(i = 0; i < M; i++)
        {
           hTimesX[i] = new Array(N);
        }

        for (i = 0; i < M; i++)
        {
            for (j = 0; j < N; j++)
            {
                if (x[i][j] == 0)
                {
                    hTimesX[i][j] = 0.0;
                }
                else
                {
                    hTimesX[i][j] = h * x[i][j];
                }
            }
        }

        return hTimesX;
    },

    /**
     *
     * @param x Double[][]
     * @param y Double[][]
     *
     * @returns Double[][] 
     */
    multiply2dBy2d: function(x, y)
    {
        var x1 = x.length;
        var x2 = x[0].length;
        var y1 = y.length;
        var y2 = y[0].length;

        if (x2 != y1)
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[3][3];

        var i = 0;
        var j = 0;

        for(i = 0; i < x1; i++)
        {
           returnVal[i] = new Array(y2);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {
            //each column of the target matrix
            for (j = 0; j < y2; j++)
            {
                var val = 0;
                var k = 0;

                //the components of the target cell
                for (k = 0; k < y1; k++)
                {
                    val = val + x[i][k] * y[k][j];
                }

                returnVal[i][j] = val;
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[][]
     *
     * @returns Double[][]
     */
    transposeMatrix: function(x)
    {
        var x1 = x.length;
        var x2 = x[0].length;

        var returnVal = new Array(x2); //Double[x2][x1];

        var i = 0;
        var j = 0;

        for(i = 0; i < x2; i++)
        {
           returnVal[i] = new Array(x1);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {  
            //each column of the target matrix
            for (j = 0; j < x2; j++)
            { 
                returnVal[j][i] = x[i][j];
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns Double[]
     */
    add1dTo1d: function(x, y)
    {
        var x1 = x.length;
        var y1 = y.length;

        if (x1 != y1)
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1];
        var i = 0;

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {  
            returnVal[i] = x[i] + y[i];
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[][]
     * @param y Double[][]
     *
     *
     * @returns Double[][]
     */
    add2dTo2d: function(x, y)
    {
        var x1 = x.length;
        var x2 = x[0].length;
        var y1 = y.length;
        var y2 = y[0].length;

        if ((x1 != y1) || (x2 != y2))
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1][x2];
        var i = 0;
        var j = 0;

        for(i = 0; i < x1; i++)
        {
           returnVal[i] = new Array(x2);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {
            //each column of the target matrix
            for (j = 0; j < x2; j++)
            { 
                returnVal[i][j] = x[i][j] + y[i][j];
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[][]
     * @param y Double[][]
     *
     * @returns Double[][]
     */
    subtract2dMinus2d: function(x, y)
    {
        var x1 = x.length;
        var x2 = x[0].length;
        var y1 = y.length;
        var y2 = y[0].length;

        if ((x1 != y1) || (x2 != y2))
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1][x2];
        var i = 0;
        var j = 0;

        for(i = 0; i < x1; i++)
        {
           returnVal[i] = new Array(x2);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {
            //each column of the target matrix
            for (j = 0; j < x2; j++)
            { 
                returnVal[i][j] = x[i][j] - y[i][j];
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns Double[]
     */
    subtract1dMinus1d: function(x, y)
    {
        var x1 = x.length;
        var y1 = y.length;

        if (x1 != y1)
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1];
        var i = 0;

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {  
            returnVal[i] = x[i] - y[i];
        }

        return returnVal;
    }
}
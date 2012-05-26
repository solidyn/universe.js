
var MathTools = {
    
    /**
     * returns the angle between two vectors
     * @param {vector} x (unitless)
     * @param {vector} y (unitless)
     *
     * @returns {Number} angle
     */
    angleBetweenTwoVectorsVector: function(x, y)
    {
        var angle = 0;                 //double
        var magX = x.length();       //double
        var magY = y.length();       //double
        var xDotY = x.dot(y); //double

        angle = MathTools.toDegrees(Math.acos(xDotY / (magX * magY)));

        if (angle > 90)
        {
            angle = 180 - angle;
        }

        return angle; //deg
    },

    /**
     * rotates vector 'vec' about the x-axis by 'x' degrees
     * @param {Number} x (degrees)
     * @param {Double[]} vec (an array of length 3, assumed to be x,y,z values)
     *
     * @returns {Double[]} result (3x1)
     */
    rot1: function(x, vec)
    {
        x = MathTools.toRadians(x);

        var result = []; //Double[3];
        result[0] = vec[0];
        result[1] = Math.cos(x) * vec[1] + Math.sin(x) * vec[2];
        result[2] = -Math.sin(x) * vec[1] + Math.cos(x) * vec[2];

        return result;
    },

    /**
     * rotates vector 'vec' about the y-axis by 'x' degrees
     * @param {Number} x (degrees)
     * @param {Double[]} vec (an array of length 3, assumed to be x,y,z values)
     *
     * @returns {Double[]} result (3x1)
     */
    rot2: function(x, vec)
    {
        x = MathTools.toRadians(x);
        
        var result = []; //Double[3];

        result[0] = Math.cos(x) * vec[0] - Math.sin(x) * vec[2];
        result[1] = vec[1];
        result[2] = Math.sin(x) * vec[0] + Math.cos(x) * vec[2];

        return result;
    },

    /**
     * rotates vector 'vec' about the z-axis by 'x' degrees
     * @param {Number} x (degrees)
     * @param {Double[]} vec (an array of length 3, assumed to be x,y,z values)
     *
     * @returns {Double[]} result (3x1)
     */
    rot3: function(x, vec)
    {
        x = MathTools.toRadians(x);

        var result = []; //Double[3];

        result[0] = Math.cos(x) * vec[0] + Math.sin(x) * vec[1];
        result[1] = -Math.sin(x) * vec[0] + Math.cos(x) * vec[1];
        result[2] = vec[2];

        return result;
    },

    /**
     * returns the radian equivalent of an angle provided in degrees
     * @param {Number} valueInDegrees 
     *
     * @returns {Number} valueInRadians
     */
    toRadians: function(valueInDegrees)
    {
        // return valueInDegrees * Math.PI / 180.0;
            return valueInDegrees * Constants.piOverOneEighty;
    },

    /**
     * returns the degree equivalent of an angle provided in radians
     * @param {Number} valueInRadians 
     *
     * @returns {Number} valueInDegrees
     */
    toDegrees: function(valueInRadians)
    {
        //return valueInRadians * 180 / Math.PI;
          return valueInRadians * Constants.oneEightyOverPi;
    },

    /**
     * returns the 3x3 rotation matrix that is used to rotate a vector
     * about the x-axis by 'x' degrees
     * @param {Number} x (degrees)
     *
     * @returns {Number[][]} rotationMatrix  (3x3)
     */
    buildRotationMatrix1: function(x)
    {
        x = MathTools.toRadians(x);
        var result = []; //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = [];
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
     * returns the 3x3 rotation matrix that is used to rotate a vector
     * about the y-axis by 'x' degrees
     * @param {Number} x (degrees)
     *
     * @returns {Number[][]} rotationMatrix  (3x3)
     */
    buildRotationMatrix2: function(x)
    {
        x = MathTools.toRadians(x);
        var result = []; //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = [];
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
     * returns the 3x3 rotation matrix that is used to rotate a vector
     * about the z-axis by 'x' degrees
     * @param {Number} x (degrees)
     *
     * @returns {Number[][]} rotationMatrix  (3x3)
     */
    buildRotationMatrix3: function(x)
    {
        x = MathTools.toRadians(x);
        var result = []; //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = [];
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
     * returns an identity matrix (a matrix of all zeros with ones on the diagonals)
     * of size (NxN)
     * @param {int} N size of the desired identity matrix (NxN)
     *
     * @returns {Number[][]} identityMatrix (size NxN)
     */
    ones: function(N)
    {
        var x = []; //Double[N][N];

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
     * returns a matrix full of zeros (no null values) of size (NxN)
     * @param {int} N size of the desired matrix (NxN)
     *
     * @returns {Number[][]} zerosMatrix (size NxN)
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
     * returns a matrix full of zeros (no null values) of size (MxN)
     * @param {int} M number of rows in the desired matrix (MxN)
     * @param {int} N number of columns the desired matrix (MxN)
     *
     * @returns {Number[][]} zerosMatrix (size MxN)
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
     * returns the product of two arrays where the first array is 1xN in size and the
     * second array is NxM in size
     * @param {Number[]} x 1d array of size (1xN)
     * @param {Number[][]} y 2d array of size (NxM)
     *
     * @returns {Number[]} product 1d array of size (1xM)
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
     * returns the product of two arrays where the first array is MxN in size and the
     * second array is Nx1 in size
     * @param {Number[][]} x 2d array of size (MxN)
     * @param {Number[]} y 1d array of size (Nx1)
     *
     * @returns {Number[]} product 1d array of size (Mx1)
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
     * returns a matrix multiplied by a scalar
     * @param {Number} h scalar
     * @param {Number[][]} x 2d array of size (MxN)
     *
     * @returns {Number[][]} product 2d array of size (MxN)
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
                if (x[i][j] === 0)
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
     * returns the product of two arrays where the first array is MxN in size and the
     * second array is NxP in size
     * @param {Number[][]} x 2d array of size (MxN)
     * @param {Number[][]} y 2d array of size (NxP)
     *
     * @returns {Number[][]} product 2d array of size (MxP)
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
     * returns the transpose of an array
     * given an array of size (MxN), this will transpose the matrix to size (NxM)
     * @param {Number[][]} x 2d array of size (MxN)
     *
     * @returns {Number[][]} transpose 2d array of size (NxM)
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
     * returns the sum of two arrays of size (Nx1)
     * NOTE: both arrays must be of the same size
     * @param {Number[]} x 1d array of size (Nx1)
     * @param {Number[]} y 1d array of size (Nx1)
     *
     * @returns {Number[]} sum 1d array of size (Nx1)
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
     * returns the sum of two arrays of size (MxN)
     * NOTE: both arrays must be of the same size
     * @param {Number[][]} x 2d array of size (MxN)
     * @param {Number[][]} y 2d array of size (MxN)
     *
     * @returns {Number[][]} sum 1d array of size (MxN)
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
     * returns the difference of two arrays of size (MxN)  (x - y)
     * NOTE: both arrays must be of the same size
     * @param {Number[][]} x 2d array of size (MxN)
     * @param {Number[][]} y 2d array of size (MxN)
     *
     * @returns {Number[][]} difference 2d array of size (MxN) representing x-y
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
     * returns the difference of two arrays of size (Nx1)  (x - y)
     * NOTE: both arrays must be of the same size
     * @param {Number[]} x 1d array of size (Nx1)
     * @param {Number[]} y 1d array of size (Nx1)
     *
     * @returns {Number[]} difference 1d array of size (Nx1) representing x-y
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
};
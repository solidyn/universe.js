var QuaternionMath = {

    /**
     *
     * @param q1 Quaternion
     * @param q2 Quaternion
     *
     * @returns Quaternion
     */
    multiplyQuaternions: function(q1, q2)
    {
        //multiplies q1 by q2;
        if (q1.isZero())
        {
            return q2;
        }
        else if (q2.isZero())
        {
            return q1;
        }
        else
        {
            var w1 = q1.getW(); //double
            var x1 = q1.getX(); //double
            var y1 = q1.getY(); //double
            var z1 = q1.getZ(); //double
            var w2 = q2.getW(); //double
            var x2 = q2.getX(); //double
            var y2 = q2.getY(); //double
            var z2 = q2.getZ(); //double

            //now that each quaternion has an axis of rotation that is a unit vector, multiply the two:
            var quaternionProduct = new Quaternion();
            quaternionProduct.setW(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2);
            quaternionProduct.setX(w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2);
            quaternionProduct.setY(w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2);
            quaternionProduct.setZ(w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2);

            return quaternionProduct;
        }
    },

    /**
     *
     * @param qRotation Quaternion
     * @param inputVector Double[]
     *
     * @returns Double[]
     */
    applyQuaternionRotation: function(qRotation, inputVector)
    {
        //applies qRotation q1 to the vector inputVector (3x1)
        var q0 = qRotation.getW(); //double
        var q1 = qRotation.getX(); //double
        var q2 = qRotation.getY(); //double
        var q3 = qRotation.getZ(); //double

        var A = new Array(3); //Double[3][3];
        var i = 0;
        for(i = 0; i < 3; i++)
        {
            A[i] = new Array(3);
        }

        A[0][0] = 2*q0*q0-1+2*q1*q1;
        A[0][1] = 2*q1*q2+2*q0*q3;
        A[0][2] = 2*q1*q3-2*q0*q2;
        A[1][0] = 2*q1*q2-2*q0*q3;
        A[1][1] = 2*q0*q0-1+2*q2*q2;
        A[1][2] = 2*q2*q3+2*q0*q1;
        A[2][0] = 2*q1*q3+2*q0*q2;
        A[2][1] = 2*q2*q3-2*q0*q1;
        A[2][2] = 2*q0*q0-1+2*q3*q3;

        var matrixProduct = MathTools.multiply2dBy1d(A, [inputVector.x, inputVector.y, inputVector.z]);

        return {
            x: matrixProduct[0],
            y: matrixProduct[1],
            z: matrixProduct[2]
        };
    },

    /**
     *
     * @param q Quaternion
     *
     * @returns Double[]
     */
    getEulerAngles: function(q)
    {
        //------DETERMINING THE EQUIVALENT EULER ROTATION ANGLES------
        //translate the net (final) quaternion back to euler angles
        var q0 = q.getW(); //double
        var q1 = q.getX(); //double
        var q2 = q.getY(); //double
        var q3 = q.getZ(); //double

        var phi = Math.atan2((2 * (q0 * q1 + q2 * q3)),
            (1 - 2 * (q1 * q1 + q2 * q2)));   //rad  (rotation about the x-axis)
        var theta = Math.asin(2 * (q0 * q2 - q3 * q1)); //rad  (rotation about the y-axis)
        var gamma = Math.atan2((2 * (q0 * q3 + q1 * q2)),
            (1 - 2 * (q2 * q2 + q3 * q3))); //rad  (rotation about the z-axis)

        //equivalentRotationMatrix=Rot3(gamma*180/pi)*Rot2(theta*180/pi)*Rot1(phi*180/pi);
        var EulerAngles = new Array(3); //Double[3];
        EulerAngles[0] = MathTools.toDegrees(phi);     //deg  (rotation about the x-axis)
        EulerAngles[1] = MathTools.toDegrees(theta);   //deg  (rotation about the y-axis)
        EulerAngles[2] = MathTools.toDegrees(gamma);   //deg  (rotation about the z-axis)

        //remember, the equivalentRotationMatrix=Rot3(gamma*180/pi)*Rot2(theta*180/pi)*Rot1(phi*180/pi);
        return EulerAngles;
    },

    /**
     *
     * @param m Double[][]
     *
     * @returns Quaternion
     */
    convertRotationMatrixToQuaternion: function(m)
    {
        //converts a 3x3 rotation matrix to an equivalent quaternion
        var q = new Quaternion();
        var m11 = m[0][0]; //double
        var m12 = m[0][1]; //double
        var m13 = m[0][2]; //double
        var m21 = m[1][0]; //double
        var m22 = m[1][1]; //double
        var m23 = m[1][2]; //double
        var m31 = m[2][0]; //double
        var m32 = m[2][1]; //double
        var m33 = m[2][2]; //double

        // q.setW(0.5 * Math.sqrt(m11+m22+m33+1));
        //         q.setX((m23 - m32) / (4 * q.getW()));
        //         q.setY((m31 - m13) / (4 * q.getW()));
        //         q.setZ((m12 - m21) / (4 * q.getW()));

        q.setW(0.5*Math.sqrt(1+m11-m22-m33));
        q.setX((m12+m21)/(4*q.getW()));
        q.setY((m13+m31)/(4*q.getW()));
        q.setZ((m32-m23)/(4*q.getW()));

        return q;
    }
};
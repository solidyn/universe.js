/*jslint browser: true, sloppy: true */
/*global MathTools, Constants */
var NearCircularPropagator = {

    propagateOrbit: function (kep, elapsedTime, dt, timeAtStartOfPropagation) {
        //console.log('keping it up');
        var MA = kep.getMeanAnomaly() + kep.getMeanMotion() * elapsedTime, //update the mean anomaly (deg)
            w = MathTools.toRadians(kep.getArgOfPerigee()),
            ra = MathTools.toRadians(kep.getRaan()),
            inc = MathTools.toRadians(kep.getInclination()),
            ecc = kep.getEccentricity(),
            mu = Constants.muEarth,
            EA,
            errorThreshold = 1e-5,  //how accurately do we need to solve for the eccentric anomaly?
            i,
            myerror,
            f,
            p,
            r,
            h,
            x,
            y,
            z,
            xdot,
            ydot,
            zdot,
            eciState = new UNIVERSE.ECICoordinates();

        MA = MathTools.toRadians(MA);  //convert the mean anomaly to radians
        //iterate to solve for the eccentric anomaly
        EA = MA * 0.95; //fist guess at the eccentric anomaly (rads)

        for (i = 0; i < 500; i += 1) {
            myerror = MA - (EA - ecc * Math.sin(EA));
            if (Math.abs(myerror) > errorThreshold) {
                if (myerror > 0) {
                    EA = EA + Math.abs(MA - EA) / 2;
                } else {
                    if (myerror < 0) {
                        EA = EA - Math.abs(MA - EA) / 2;
                    }
                }
            } else {
                break;
            }

        }

        f = 2 * Math.atan(Math.sqrt((1 + ecc) / (1 - ecc)) * Math.tan(EA / 2));
        p = kep.getSemimajorAxis() * (1 - ecc * ecc);
        r = kep.getSemimajorAxis() * (1 - ecc * Math.cos(EA)); //radius
        h = Math.sqrt(mu * kep.getSemimajorAxis() * (1 - ecc * ecc));
        x = r * (Math.cos(ra) * Math.cos(w + f) - Math.sin(ra) * Math.sin(w + f) * Math.cos(inc));
        y = r * (Math.sin(ra) * Math.cos(w + f) + Math.cos(ra) * Math.sin(w + f) * Math.cos(inc));
        z = r * Math.sin(inc) * Math.sin(w + f);
        xdot = ((x * h * ecc) / (r * p)) * Math.sin(f) - (h / r) * (Math.cos(ra) * Math.sin(w + f) + Math.sin(ra) * Math.cos(w + f) * Math.cos(inc));
        ydot = ((y * h * ecc) / (r * p)) * Math.sin(f) - (h / r) * (Math.sin(ra) * Math.sin(w + f) - Math.cos(ra) * Math.cos(w + f) * Math.cos(inc));
        zdot = ((z * h * ecc) / (r * p)) * Math.sin(f) + (h / r) * (Math.sin(inc) * Math.cos(w + f));


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
};
var NearCircularPropagator = {
    
    propagateOrbit: function(kep, elapsedTime, dt, timeAtStartOfPropagation) {
        //console.log('keping it up');
        var MA = kep.getMeanAnomaly() + kep.getMeanMotion() * elapsedTime; //update the mean anomaly (deg)
        var w = MathTools.toRadians(kep.getArgOfPerigee());
        var ra = MathTools.toRadians(kep.getRaan());
        var inc = MathTools.toRadians(kep.getInclination());
        var ecc = kep.getEccentricity();
        var mu = Constants.muEarth;
        //System.out.println("elapsed time: "+elapsedTime+" dt: "+dt+" ecc: "+kep.getEccentricity());
        //console.log("MA: "+kep.getMeanAnomaly()+" meanMotion: "+kep.getMeanMotion()+" new MA: "+MA + " elapsedTime: " + elapsedTime);
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
        var p = kep.getSemimajorAxis() * (1 - ecc * ecc);
        var r = kep.getSemimajorAxis() * (1 - ecc* Math.cos(EA)); //radius
        var h = Math.sqrt(mu * kep.getSemimajorAxis() * (1 - ecc * ecc));
        var x = r * (Math.cos(ra) * Math.cos(w + f) - Math.sin(ra) * Math.sin(w + f) * Math.cos(inc));
        var y = r * (Math.sin(ra) * Math.cos(w + f) + Math.cos(ra) * Math.sin(w + f) * Math.cos(inc));
        var z = r * Math.sin(inc) * Math.sin(w + f);
        var xdot = ((x * h * ecc) / (r * p)) * Math.sin(f) - (h / r) * (Math.cos(ra) * Math.sin(w + f) + Math.sin(ra) * Math.cos(w + f) * Math.cos(inc));
        var ydot = ((y * h * ecc) / (r * p)) * Math.sin(f) - (h / r) * (Math.sin(ra) * Math.sin(w + f) - Math.cos(ra) * Math.cos(w + f) * Math.cos(inc));
        var zdot = ((z * h * ecc) / (r * p)) * Math.sin(f) + (h / r) * (Math.sin(inc) * Math.cos(w + f));

        //System.out.println(vehicleName+","+x+","+y+","+z+","+xdot+","+ydot+","+zdot);
        var eciState = new UNIVERSE.ECICoordinates();

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
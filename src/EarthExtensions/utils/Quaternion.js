/*jslint browser: true, sloppy: true */

function Quaternion(wVal, xVal, yVal, zVal) {

    this.w = wVal || 0.0;
    this.x = xVal || 0.0;
    this.y = yVal || 0.0;
    this.z = zVal || 0.0;
    this.q = [];

    /**
     *
     */
    this.updateQ = function () {
        this.q[0] = this.w;
        this.q[1] = this.x;
        this.q[2] = this.y;
        this.q[3] = this.z;
    };

    /**
     *
     * @returns
     */
    this.getQ = function () {
        return this.q;
    };

    /**
     *
     * @param q Double[]
     */
    this.setQ = function (q) {
        this.w = q[0];
        this.x = q[1];
        this.y = q[2];
        this.z = q[3];
        this.q = q;
    };

    /**
     *
     *
     * @returns double
     */
    this.getW = function () {
        return this.w;
    };

    /**
     *
     * @param newW double
     */
    this.setW = function (newW) {
        this.w = newW;
        this.updateQ();
    };

    /**
     *
     * @returns double
     */
    this.getX = function () {
        return this.x;
    };

    /**
     *
     * @param newX double
     */
    this.setX = function (newX) {
        this.x = newX;
        this.updateQ();
    };

    /**
     *
     * @returns double
     */
    this.getY = function () {
        return this.y;
    };

    /**
     *
     * @param newY double
     */
    this.setY = function (newY) {
        this.y = newY;
        this.updateQ();
    };

    /**
     *
     * @returns double
     */
    this.getZ = function () {
        return this.z;
    };

    /**
     *
     * @param newZ double
     */
    this.setZ = function (newZ) {
        this.z = newZ;
        this.updateQ();
    };

    /**
     *
     * @returns boolean
     */
    this.isZero = function () {
        var i;
        for (i = 0; i < 4; i += 1) {
            if (this.q[i] && this.q[i] !== 0) {
                return false;
            }
        }

        return true;
    };
}
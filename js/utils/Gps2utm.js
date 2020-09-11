var Longlat2xy = function () {
    this.lonLat2WebGL = function (lng, lat, level = 1) {
        var Lon0 = 118.988809400000;      //tangshan port #25
        var Lat0 = 39.1988620000000;      //tangshan port #25
        // double H0 = 0;
        var pi = 3.1415926;
        var R_Earth = 6371004;
        var Factor_x = Math.cos(Lat0 * pi / 180) * R_Earth * pi / 180;
        var Factor_y = R_Earth * pi / 180;
        var x0 = Lon0 * Factor_x;
        var y0 = Lat0 * Factor_y;
        var x = lng * Factor_x - x0;
        var y = lat * Factor_y - y0;
        var result = {
            x: x,
            y: y
        };
        return result;
    }
}
export { Longlat2xy };
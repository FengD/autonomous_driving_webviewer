var Longlat2xy = function () {
    this.computeMap = function (log, lat, level) {
        var mer = lonLat2WebMercator(log, lat);
        console.log("mer", mer);
        var res = webMercator2TileimageInfo(mer.x, mer.y, level);
        console.log("res", res);
        return res;
    }

    function lonLat2WebMercator(lng, lat) {
        // x range [-EQUATORHALF,EQUATORHALF]
        var EQUATORHALF = 20037508.3427892;
        var x = (lng / 180.0) * EQUATORHALF;
        // y range angles[-85.05112877980659，85.05112877980659]
        var y;
        if (lat > 85.05112877980659) {
            lat = 85.05112877980659;
        }
        if (lat < -85.05112877980659) {
            lat = -85.05112877980659;
        }
        var tmp = Math.PI / 4.0 + (Math.PI / 2.0) * lat / 180.0;
        // y range meters[-EQUATORHALF,EQUATORHALF]
        y = EQUATORHALF * Math.log(Math.tan(tmp)) / Math.PI;
        var result = {
            x: x,
            y: y
        };
        return result;
        // return [x, y, z];
    }
    function webMercator2TileimageInfo(x, y, level) {
        var EQUATORHALF = 20037508.3427892;
        y = EQUATORHALF - y;
        x = EQUATORHALF + x;
        var size = Math.pow(2, level) * 256,
            imgx = x * size / (EQUATORHALF * 2),
            imgy = y * size / (EQUATORHALF * 2),
            col = Math.floor(imgx / 256),
            row = Math.floor(imgy / 256),
            imgdx = imgx % 256,
            imgdy = imgy % 256,
            position = {
                x: imgx,
                y: imgy
            },
            tileinfo = {
                x: col,
                y: row,
                level: level
            },
            offset = {
                x: imgdx,
                y: imgdy
            },
            result = {
                position: position,
                tileinfo: tileinfo,
                offset: offset
            };
        return result;
    }
    this.lonLat2WebGL = function (lng, lat, level) {
        var centerLng = 118.9888094;
        var centerLat = 39.198862;
        var tileSize = 100;
        var webMercator = lonLat2WebMercator(lng, lat);
        var tilePos = webMercator2TileimageInfo(webMercator.x, webMercator.y, level).position;
        var centerWM = lonLat2WebMercator(centerLng, centerLat);
        var centerTP = webMercator2TileimageInfo(centerWM.x, centerWM.y, level);
        var x = (tilePos.x - centerTP.position.x + (centerTP.offset.x - 256 / 2)) * tileSize / 256;
        var y = (tilePos.y - centerTP.position.y + (-centerTP.offset.y + 256 / 2)) * tileSize / 256;
        var result = {
            x: -x,
            y: y
        };
        return result;
    }

}

export { Longlat2xy };
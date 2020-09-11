import * as THREE from "../threejs/three.module.js";
import { Longlat2xy } from "./Lonlat2xy.js";
// import { Longlat2xy } from "./Gps2utm.js";
import { ObjectAction } from "./ObjectAction.js";

var HDMap = function () {

    // read shp
    this.loadShapefileFeatures = function (file, callback) {
        let features = [];
        let handleFinish = () => {
            // get file name
            file = file.slice(11, -4);
            callback(features, file);
        };
        shapefile.open(file)
            .then(source => {
                source.read()
                    .then(function log(result) {
                        if (result.done) {
                            handleFinish();
                            return;
                        }
                        // console.log(result.value);
                        if (result.value && result.value.type === 'Feature' && result.value.geometry !== undefined) {
                            features.push(result.value);
                        }
                        return source.read().then(log);
                    });
            });
    }

    // longlat to xy in dif kind
    this.features2xy = function (features) {
        var longlat2xy = new Longlat2xy();
        if (features[0].geometry.type == "PointZ") {
            for (var i in features) {
                var result = longlat2xy.lonLat2WebGL(features[i].geometry.coordinates[0],
                    features[i].geometry.coordinates[1], 18);
                features[i].geometry.coordinates[0] = result.x;
                features[i].geometry.coordinates[1] = result.y;
            }
        }
        // 1*1 array  linestring
        if (features[0].geometry.type == "LineString") {
            for (var i in features) {
                for (var w = 0; w < features[i].geometry.coordinates.length; w++) {
                    var result = longlat2xy.lonLat2WebGL(features[i].geometry.coordinates[w][0],
                        features[i].geometry.coordinates[w][1], 18);
                    features[i].geometry.coordinates[w][0] = result.x;
                    features[i].geometry.coordinates[w][1] = result.y;
                }
            }
        }
        // 1*1*1 polygon
        else {
            for (var i in features) {
                for (var w = 0; w < features[i].geometry.coordinates[0].length; w++) {
                    var result = longlat2xy.lonLat2WebGL(features[i].geometry.coordinates[0][w][0],
                        features[i].geometry.coordinates[0][w][1], 18);
                    features[i].geometry.coordinates[0][w][0] = result.x;
                    features[i].geometry.coordinates[0][w][1] = result.y;
                }
            }
        }
        return features;
    }

    this.features2objects = function (features, file) {
        var objectAction = new ObjectAction();
        var name = file;
        if (features[0].geometry.type == "PointZ") {
            switch (file) {
                case "HD_POINT":
                    var mesh = updateHD_POINT(features, file);
                    break;
                default:
                    var points = objectAction.addPoints(name);
                    var mesh = updatePointZ(points, features);
                    break;
            }
        }
        else if (features[0].geometry.type == "LineString") {
            var lines = objectAction.addLines(name, features.length);
            var mesh = updateLineString(lines, features);
        }
        else {
            switch (file) {
                case "HD_POLYGON":
                    var polygons = addPolygon(name, features.length);
                    var mesh = updateHD_POLYGON(polygons, features);
                    break;
                case "HD_TOPO_LANEGROUP":
                    var polygons = objectAction.addLines(name, features.length);
                    var mesh = updateHD_TOPO_LANEGROUP(polygons, features);
                    break;
                default:
                    var polygons = addPolygon(name, features.length);
                    var mesh = updatePolygon(polygons, features);
                    break;
            }
        }
        return mesh;
    }

    function addPolygon(name, length) {
        var group = new THREE.Group();
        group.name = name;
        for (var i = 0; i < length; i++) {
            var geometry = new THREE.Geometry();
            var material = new THREE.MeshBasicMaterial({
                color: 0x708090,
                transparent: true,
                opacity: 0.5,
                side: THREE.DoubleSide,
            });
            var element = new THREE.Mesh(geometry, material);
            group.add(element);
        }
        return group;
    }

    function updatePointZ(mesh, features) {
        var positions = [];
        for (var i = 0; i < features.length; i++) {
            positions.push(features[i].geometry.coordinates[0],
                features[i].geometry.coordinates[1],
                features[i].geometry.coordinates[2]);
        }
        mesh.geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        );
        mesh.geometry.size = 10;
        return mesh;
    }

    function updateLineString(mesh, features) {
        for (var i = 0; i < features.length; i++) {
            var positions = [];
            for (var ii = 0; ii < features[i].geometry.coordinates.length; ii++) {
                var x = features[i].geometry.coordinates[ii][0];
                var y = features[i].geometry.coordinates[ii][1];
                var z = features[i].geometry.coordinates[ii][2];
                positions.push(x, y, z);
            }
            mesh.children[i].geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            mesh.children[i].geometry.linewidth = 10;
            mesh.children[i].visible = true;
        }
        return mesh;
    }

    function updatePolygon(mesh, features) {
        for (var i = 0; i < features.length; i++) {
            for (var ii = 0; ii < features[i].geometry.coordinates[0].length; ii++) {
                mesh.children[i].geometry.vertices.push(new THREE.Vector3(features[i].geometry.coordinates[0][ii][0],
                    features[i].geometry.coordinates[0][ii][1],
                    features[i].geometry.coordinates[0][ii][2]));
            }
            for (var ii = 0; ii < features[i].geometry.coordinates[0].length - 1; ii++) {
                // mesh.children[i].geometry.faces.push(new THREE.Face3(ii, ii + 1, features[i].geometry.coordinates[0].length - 1 - ii));
                mesh.children[i].geometry.faces.push(new THREE.Face3(0, ii + 1, ii + 2));
            }
        }
        return mesh;
    }

    function updateHD_POINT(features, file) {
        var group = new THREE.Group();
        group.name = file;
        for (var i = 0; i < features.length; i++) {
            // draw line
            var x = features[i].geometry.coordinates[0],
                y = features[i].geometry.coordinates[1],
                z = features[i].geometry.coordinates[2];
            var positions = [];
            var geometry = new THREE.BufferGeometry();
            var material = new THREE.LineBasicMaterial({
                color: 0xf0f8ff,
                linewidth: 1,
            });
            positions.push(x, y, z);
            positions.push(x, y, z - features[i].properties.HEIGHT);
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            var line = new THREE.Line(geometry, material);
            // console.log("line", line);
            group.add(line);

            // draw cube
            var geometry = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
            var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            // geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            var cube = new THREE.Mesh(geometry, material);
            cube.position.set(x, y, z + 0.25)
            // console.log("cube", cube);
            group.add(cube);

        }
        return group;
    }

    function updateHD_POLYGON(mesh, features) {
        for (var i = 0; i < features.length; i++) {
            for (var ii = 0; ii < features[i].geometry.coordinates[0].length; ii++) {
                mesh.children[i].geometry.vertices.push(new THREE.Vector3(features[i].geometry.coordinates[0][ii][0],
                    features[i].geometry.coordinates[0][ii][1],
                    features[i].geometry.coordinates[0][ii][2]));
            }
            for (var ii = 0; ii < features[i].geometry.coordinates[0].length - 1; ii++) {
                // mesh.children[i].geometry.faces.push(new THREE.Face3(ii, ii + 1, features[i].geometry.coordinates[0].length - 1 - ii));
                mesh.children[i].geometry.faces.push(new THREE.Face3(0, ii + 1, ii + 2));
            }
            // console.log("features[i].properties.TYPE", features[i].properties.TYPE);
            switch (features[i].properties.TYPE) {
                case 7:
                    var color = 0xf8f8ff;
                    break;
                case 8:
                    var color = 0xffff00;
                    break;
                case 9:
                    var color = 0xffa500;
                    break;
                default:
                    var color = 0xfaf0e6;
                    break;
            }
            mesh.children[i].material.color.setHex(color);
        }
        return mesh;
    }

    function updateHD_TOPO_LANEGROUP(mesh, features) {
        for (var i = 0; i < features.length; i++) {
            var positions = [];
            for (var ii = 0; ii < features[i].geometry.coordinates[0].length; ii++) {
                positions.push(features[i].geometry.coordinates[0][ii][0],
                    features[i].geometry.coordinates[0][ii][1],
                    features[i].geometry.coordinates[0][ii][2]);
            }
            mesh.children[i].geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            mesh.children[i].geometry.linewidth = 10;
            mesh.children[i].visible = true;
        }
        return mesh;
    }

}
export { HDMap };
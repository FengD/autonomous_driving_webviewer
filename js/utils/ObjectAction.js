import * as THREE from "../threejs/three.module.js";
import { Longlat2xy } from "./Lonlat2xy.js";
import { Intensity2RGB } from "./Intensity2RGB.js";
// import { Longlat2xy } from "./Gps2utm.js";
var ObjectAction = function () {
    var intensity2RGB = new Intensity2RGB();
    function angPos(r, ang) {
        let _ang = THREE.Math.degToRad(ang);
        let x = r * Math.sin(_ang),
            y = r * Math.cos(_ang);
        return [x, y];
    }

    // add action

    this.addPoint = function (name) {
        var geometry = new THREE.BufferGeometry();
        var material = new THREE.PointsMaterial({ size: 1 });
        var mesh = new THREE.Points(geometry, material);
        mesh.name = name;
        return mesh;
    }

    this.addPoints = function (name) {
        var geometry = new THREE.BufferGeometry();
        var material = new THREE.PointsMaterial({ size: 0.1 });
        var mesh = new THREE.Points(geometry, material);
        mesh.name = name;
        return mesh;
    }

    this.addLine = function (name) {
        var geometry = new THREE.BufferGeometry();
        var material = new THREE.LineBasicMaterial({
            color: 0xff0000,
            linewidth: 1,
        });
        var line = new THREE.Line(geometry, material);
        line.name = name;
        return line;
    }

    this.addLines = function (name, count = 30) {
        var group = new THREE.Group();
        group.name = name;
        for (var i = 0; i < count; i++) {
            var geometry = new THREE.BufferGeometry();
            var material = new THREE.LineBasicMaterial({
                // color: 0xff0000,
                color: 0xF8F8FF,
                linewidth: 1,
            });
            var line = new THREE.Line(geometry, material);
            line.visible = false;
            group.add(line);
        }
        return group;
    }

    this.addPolygon = function (name) {
        var geometry = new THREE.BufferGeometry();
        var material = new THREE.LineBasicMaterial({
            color: 0xff0000,
            linewidth: 1,
        });
        var polygon = new THREE.Line(geometry, material);
        polygon.name = name;
        return polygon;
    }

    this.addPolygons = function (name) {
        var group = new THREE.Group();
        group.name = name;
        for (var i = 0; i < 30; i++) {
            var geometry = new THREE.BufferGeometry();
            var material = new THREE.LineBasicMaterial({
                color: 0xff0000,
                linewidth: 1,
            });
            var polygon = new THREE.Line(geometry, material);
            polygon.visible = false;
            group.add(polygon);
        }
        return group;
    }

    this.addPose = function (name) {
        var dir = new THREE.Vector3(-1, 0, 0);
        // // 规格化方向向量(转换为长度为1的向量)
        dir.normalize();
        // // 箭头开始的点
        // var origin = new THREE.Vector3(0, 0, 0);
        // // 箭头的长度。默认值为1
        // var length = 30;
        // // 用于定义颜色的十六进制值。默认值为0xffff00
        // var hex = 0xffabcd;
        // // 箭头的长度。默认值为0.2 *length
        // var headLength = 0.5;
        // // 箭头宽度的长度。默认值为0.2 * headLength。
        // var headWidth = 0.2;
        // var arrowHelper1 = new THREE.ArrowHelper(dir, origin, length, hex, headLength, headWidth);
        var arrowHelper = new THREE.ArrowHelper(dir);
        // arrowHelper.position.set(10, 10, 10);
        // arrowHelper.setColor(0, 1, 0);
        // arrowHelper.setColor(0xffabcd);
        arrowHelper.name = name;
        arrowHelper.visible = false;
        return arrowHelper;
    }

    this.addGps84 = function (name) {
        var dir = new THREE.Vector3(-1, 0, 0);
        dir.normalize();
        var arrowHelper = new THREE.ArrowHelper(dir);
        arrowHelper.name = name;
        arrowHelper.visible = false;
        return arrowHelper;
    }

    this.addPoses = function (name) {
        var group = new THREE.Group();
        group.name = name;
        for (var i = 0; i < 30; i++) {
            var arrowHelper = new THREE.ArrowHelper();
            group.add(arrowHelper);
        }
        return group;
    }

    this.addBoundingBox = function (name) {
        var box = new THREE.Box3();
        var helper = new THREE.Box3Helper(box, 0xffff00);
        helper.visible = false;
        helper.name = name;
        // helper.material.color.setRGB(12, 11, 10);
        return helper;
    }

    this.addBoundingBoxes = function (name) {
        var group = new THREE.Group();
        group.name = name;
        for (var i = 0; i < 30; i++) {
            var box = new THREE.Box3();
            var helper = new THREE.Box3Helper(box, 0xffff00);
            helper.visible = false;
            group.add(helper);
        }
        // var trackID = this.addTrackID("TrackID");
        return group;
    }

    this.addPointCloud = function (name) {
        var geometry = new THREE.BufferGeometry();
        var material = new THREE.PointsMaterial({
            size: 1,
            vertexColors: THREE.VertexColors,
            color: 0xffff00,
            // needsUpdate: true,
        });

        var mesh = new THREE.Points(geometry, material);
        mesh.frustumCulled = false;
        mesh.name = name;
        return mesh;
    }


    this.addFreespace = function (name) {
        var geometry = new THREE.Geometry();
        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
        });
        for (var i = 0; i <= 360; i++) {
            geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        }

        for (var i = 0; i < 359; i++) {
            geometry.faces.push(new THREE.Face3(0, i + 1, i + 2));
        }

        geometry.faces.push(new THREE.Face3(0, 360, 1));
        var element = new THREE.Mesh(geometry, material);
        element.name = name;
        element.visible = true;
        return element;
    }

    // update action

    this.updatePoint = function (point, data) {
        var cloud = [data.x, data.y, data.z];
        point.geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(cloud, 3)
        );
    }

    this.updatePoints = function (points, data) {
        var positions = [];
        for (var i = 0; i < data.geometry.count; i++) {
            positions.push(data.geometry.x[i], data.geometry.y[i], data.geometry.z[i]);
        }
        points.geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        );
    }

    this.updateLine = function (line, data) {
        var positions = [];
        for (var i = 0; i < data.geometry.count; i++) {
            positions.push(data.geometry.x[i], data.geometry.y[i], data.geometry.z[i]);
        }
        line.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    }

    this.updateLines = function (lines, data) {
        // refresh lines,default 30 lines a group
        for (var i = data.numberLines; i < 30; i++) {
            lines.children[i].visible = false;
        }
        // update lines
        for (var i = 0; i < data.numberLines; i++) {
            var positions = [];
            for (var ii = 0; ii < data.line[i].geometry.count; ii++) {
                positions.push(data.line[i].geometry.x[ii], data.line[i].geometry.y[ii], data.line[i].geometry.z[ii]);
            }
            lines.children[i].geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            lines.children[i].visible = true;
        }
    }

    this.updatePolygon = function (polygon, data) {
        var positions = [];
        for (var i = 0; i < data.geometry.count; i++) {
            positions.push(data.geometry.x[i], data.geometry.y[i], data.geometry.z[i]);
        }
        // add first point to create a polygon
        positions.push(data.geometry.x[0], data.geometry.y[0], data.geometry.z[0]);
        polygon.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    }

    this.updatePolygons = function (polygons, data) {
        // refresh polygons,default 30 polygons a group
        for (var i = data.numberPolygons; i < 30; i++) {
            polygons.children[i].visible = false;
        }
        // update polygons
        for (var i = 0; i < data.numberPolygons; i++) {
            var positions = [];
            for (var ii = 0; ii < data.polygon[i].geometry.count; ii++) {
                positions.push(data.polygon[i].geometry.x[ii], data.polygon[i].geometry.y[ii], data.polygon[i].geometry.z[ii]);
            }
            // add first point to create a polygon
            positions.push(data.polygon[i].geometry.x[0], data.polygon[i].geometry.y[0], data.polygon[i].geometry.z[0]);
            polygons.children[i].geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            polygons.children[i].visible = true;
        }
    }

    this.updatePose = function (pose, data, cgroup, car, controls) {
        // setColor (hex)
        // setLength (length, headLength, headWidth)
        // length -- The desired length
        // headLength -- The length of the head of the arrow
        // headWidth -- The length of the width of the arrow
        // setDirection (dir)
        pose.position.set(data.x, data.y, data.z + 1);
        // pose.rotation.x = 2 * Math.PI - data.roll;
        // pose.rotation.y = 2 * Math.PI - data.pitch;
        pose.rotation.z = data.yaw - 1.57;

        cgroup.position.set(data.x, data.y, data.z);
        cgroup.rotation.z = data.yaw - 3.14;
        car.position.set(data.x, data.y, data.z + 1);
        car.rotation.y = data.yaw * Math.PI / 180 - 1.57;

        if ("camera_" + pose.name == cgroup.name) {
            // camera.position.set(data.x + 50, data.y + 50, data.z + 50);
            // camera.lookAt(new THREE.Vector3(data.x, data.y, data.z + 1));
            controls.target = new THREE.Vector3(data.x, data.y, data.z + 1);
        }
    }

    this.updateGps84 = function (pose, data, cgroup, car, controls) {
        // console.log("updateGps84", pose, data, cgroup, car, camera);
        var lonlatToxy = new Longlat2xy();
        var result = lonlatToxy.lonLat2WebGL(data.longitude, data.latitude, 18);
        pose.position.set(result.x, result.y, 1);
        // pose.rotation.z = data.altitude * Math.PI / 180 - 1.57;
        pose.rotation.z = data.altitude * Math.PI / 180 + 1.57;

        cgroup.position.set(result.x, result.y, 1);
        cgroup.rotation.z = data.altitude * Math.PI / 180 - 3.14;
        car.position.set(result.x, result.y, 2);
        car.rotation.y = data.altitude * Math.PI / 180 - 1.57;

        if ("camera_" + pose.name == cgroup.name) {
            // camera.position.set(result.x - 5, result.y, 300);
            // camera.lookAt(new THREE.Vector3(result.x, result.y, 2));
            controls.target = new THREE.Vector3(result.x, result.y, 2);
        }
    }

    this.updatePoses = function (poses, data) {
        // refresh poses,default 30 poses a group
        for (var i = data.number; i < 30; i++) {
            poses.children[i].visible = false;
        }
        // update poses
        for (var i = 0; i < data.number; i++) {
            poses.children[i].position.set(data.x[i], data.y[i], data.z[i]);
            poses.children[i].rotation.x = 2 * Math.PI - data.roll[i];
            poses.children[i].rotation.y = 2 * Math.PI - data.pitch[i];
            poses.children[i].rotation.z = 2 * Math.PI - data.yaw[i];
            poses.children[i].visible = true;
        }
    }

    this.updateBoundingBox = function (boundingbox, data) {
        var l = data.l;
        var w = data.w;
        var h = data.h;
        boundingbox.box.setFromCenterAndSize(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(l, w, h || 0)
        );
        boundingbox.box.translate(
            new THREE.Vector3(data.x, data.y, data.z || 0)
        );
        boundingbox.rotation.x = 2 * Math.PI - (data.roll || 0);
        boundingbox.rotation.y = 2 * Math.PI - (data.pitch || 0);
        boundingbox.rotation.z = 2 * Math.PI - (data.yaw * Math.PI) / 180;
        boundingbox.visible = true;
    }

    this.updateBoundingBoxes = function (boundingboxes, groupId, data) {
        // refresh boundingboxes,default 30 boundingboxes a group
        for (var i = data.number; i < 30; i++) {
            boundingboxes.children[i].visible = false;
        }

        for (var i = 0; i < 22; i++) {
            groupId.children[i].visible = false;
        }
        // update boundingboxes
        for (var i = 0; i < data.number; i++) {
            boundingboxes.children[i].box.setFromCenterAndSize(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(data.l[i], data.w[i], data.h[i] || 0.01)
            );
            boundingboxes.children[i].box.translate(
                new THREE.Vector3(data.x[i], data.y[i], data.z[i] || 0)
            );
            boundingboxes.children[i].rotation.x = 2 * Math.PI - (data.roll[i] || 0);
            boundingboxes.children[i].rotation.y = 2 * Math.PI - (data.pitch[i] || 0);
            boundingboxes.children[i].rotation.z = 2 * Math.PI - (data.yaw[i] * Math.PI) / 180;
            boundingboxes.children[i].visible = true;

            var trackId = parseInt(data.id[i]);
            // console.log("trackId", trackId);
            groupId.children[trackId].position.set(data.x[i], data.y[i], 0);
            groupId.children[trackId].visible = true;
        }

    }

    this.updatePointCloud = function (points, data, showIntensity) {
        var cloud = [];
        var RGB = [];
        for (var i = 0; i < data.width; i++) {
            cloud.push(data.x[i], data.y[i], data.z[i]);
        }

        points.geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(cloud, 3)
        );

        let color = points.material.color;
        if (showIntensity) {
            for (var m = 0; m < data.width; m++) {
                let intensity = data.intensity[m];
                let rgb = intensity2RGB.intensity2rgb(intensity);
                RGB.push(rgb[0], rgb[1], rgb[2]);
            }
            points.geometry.setAttribute(
                "color",
                new THREE.Float32BufferAttribute(RGB, 3)
            );
        }
        else {
            for (var m = 0; m < data.width; m++) {
                RGB.push(color.r, color.g, color.b);
            }
            points.geometry.setAttribute(
                "color",
                new THREE.Float32BufferAttribute(RGB, 3)
            );
        }
    }

    this.updateFreespace = function (fs, data) {
        for (var i = 0; i < data.distance.length; i++) {
            var p = angPos(data.distance[i], i);
            fs.geometry.vertices[i + 1].set(p[1], p[0], 0);
        }
        fs.geometry.verticesNeedUpdate = true;
    }

    // update mesh material
    this.updatePointsMaterial = function (mesh, color, size) {
        mesh.material.size = size;
        mesh.material.color.setHex(color);
    }

    this.updateLineBasicMaterial = function (mesh, color, size) {
        mesh.material.linewidth = size;
        mesh.material.color.setHex(color);
    }

    this.updatePoseMaterial = function (mesh, color, size) {
        mesh.cone.material.color.setHex(color);
        mesh.line.material.color.setHex(color);
        mesh.setLength(size);
        // setLength (length, headLength, headWidth)
        // length -- The desired length
        // headLength -- The length of the head of the arrow
        // headWidth -- The length of the width of the arrow
    }

    this.updateMeshBasicMaterial = function (mesh, color, opacity) {
        mesh.material.opacity = opacity;
        mesh.material.color.setHex(color);
    }
}
export { ObjectAction };

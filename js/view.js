import * as THREE from "./threejs/three.module.js";
import { OrbitControls } from "./threejs/jsm/controls/OrbitControls.js";
import { TrackballControls } from "./threejs/jsm/controls/TrackballControls.js";
import { BinaryLoader } from "./threejs/jsm/loaders/BinaryLoader.js";
import { ObjectAction } from "./utils/ObjectAction.js";
import { HDMap } from "./utils/HDMap.js";
import { Longlat2xy } from "./utils/Lonlat2xy.js";
import { Chart } from "./utils/Chart.js";

var View = function () {
  this.camera = undefined;
  this.controls = undefined;
  this.scene = undefined;
  this.renderer = undefined;
  this.init();
  this.addGrid();
  this.initMap();
  this.createCar();
  // this.drawChart();
  // this.initChart("mychart");
  // this.addTrackID("trakcId");
  // this.loadImageTile(217717, 99999, 18, "pic_gs", 0.6);
  // this.loadImageTile(217717, 99999, 18, "pic_25", 0.4);
  // this.loadImageTile(217717, 99999, 18, "pic_gn_18", 0.6);
  // this.loadImageTile(108858, 49999, 17, "pic_gs", 0.6);
  // this.loadImageTile(108858, 49999, 17, "pic_25", 0.4);
  // this.loadImageTile(54429, 24999, 16, "pic_25", 0.6);
};
Object.assign(View.prototype, {
  constructor: View,

  init: function () {
    var fovDisMax = 10000000;
    var fovDisMin = 0.01;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new THREE.PerspectiveCamera(
      15,
      window.innerWidth / window.innerHeight,
      fovDisMin,
      fovDisMax
    );
    this.camera.position.z = 300;
    this.camera.up.set(0, 0, 1);
    this.scene.add(this.camera);

    this.light = new THREE.PointLight(0x808080, 2);
    this.light.position.set(2000, 1200, 10000);
    this.scene.add(this.light);

    // this.ambientLight = new THREE.AmbientLight(0xffffff); //括号内传入指定颜色
    // this.scene.add(this.ambientLight);

    this.axes = new THREE.AxesHelper(20);
    this.axes.material.linewidth = 5;
    this.axes.name = "axes";
    this.axes.visible = false;
    this.scene.add(this.axes);

    this.gridGroup = new THREE.Group();
    this.gridGroup.name = "grid";
    this.gridGroup.visible = false;
    this.scene.add(this.gridGroup);

    this.mapGroup = new THREE.Group();
    this.mapGroup.name = "map";
    this.mapGroup.visible = false;
    this.scene.add(this.mapGroup);

    // store obj in g to change position
    this.cameraGroup = new THREE.Group();
    this.scene.add(this.cameraGroup);

    // control pointCloud intensity
    this.showIntensity = true;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight - 45);
    document.body.appendChild(this.renderer.domElement);

    var container = $("#view").append(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 3.0;
    this.controls.panSpeed = 1.0;
    this.controls.staticMoving = true;
    this.controls.minDistance = fovDisMin;
    this.controls.maxDistance = fovDisMax;
    this.controls.target.set(0, 0, 0);
    // console.log("this.controls", this.controls);

    this.objectAction = new ObjectAction();
    this.hdMap = new HDMap();

    this.chart = new Chart();

    this.xyFontJsonUrl = "js/threejs/fonts/helvetiker_regular.typeface.json";
    this.loader = new THREE.FontLoader();
    this.temp = this.readFontPromise();
    this.readFontAsync();
    this.testFont = null;
  },

  readFontPromise: function () {
    return new Promise((resolve, reject) => {
      this.loader.load(this.xyFontJsonUrl, (data) => {
        // if (err) {
        //   reject(err);
        // }
        resolve(data);
      })
    })
  },

  readFontAsync: async function () {
    const r1 = await this.temp;
    // console.log("init", r1);
    this.testFont = r1;
    this.addTrackID("trackId", r1);
  },

  getCamera: function () {
    return this.camera;
  },

  getControls: function () {
    return this.controls;
  },

  getScene: function () {
    return this.scene;
  },

  getRenderer: function () {
    return this.renderer;
  },

  getOrigin: function () {
    this.controls.reset();
  },

  // add map
  initMap: function () {
    // var longlat2xy = new Longlat2xy();
    // var Lon0 = 118.9888094;
    // var Lat0 = 39.198862;
    // var final = [];
    // for (var p = 0; p < 21; p++) {
    //   var res = longlat2xy.computeMap(Lon0, Lat0, p);
    //   final.push(res.tileinfo);
    // }
    // console.log("final", final);

    var that = this;
    var fileList = [
      // "source/shp/ADAS_NODE.shp",

      "source/shp/BARRIER_GEOMETRY.shp",
      // "source/shp/C_NODE.shp",

      "source/shp/HD_DIVIDER.shp",
      // "source/shp/HD_DIVIDER_NODE.shp",
      // "source/shp/HD_JUNCTION.shp",
      // "source/shp/HD_LANE.shp",
      // "source/shp/HD_LANE_SCH.shp",

      "source/shp/HD_POINT.shp",

      "source/shp/HD_POLYGON.shp",

      "source/shp/HD_POLYLINE.shp",
      // "source/shp/HD_ROAD_ATTRIBUTE.shp",

      "source/shp/HD_TOPO_LANEGROUP.shp",
      // "source/shp/HD_TRAFFIC_LIGHT.shp",
      // "source/shp/HD_TRAFFICSIGN.shp",
      // "source/shp/ROAD.shp",
      // "source/shp/ROAD_NODE.shp",
      // "source/shp/T_LANEWIDTH.shp",
    ];

    for (var f in fileList) {
      this.hdMap.loadShapefileFeatures(fileList[f], function (features, file) {
        if (features.length != 0) {
          features = that.hdMap.features2xy(features);
          var mesh = that.hdMap.features2objects(features, file);
          that.mapGroup.add(mesh);
        }
      });
    }
  },

  // index.js call
  addMesh: function (topic, name) {
    var name = name;
    // eval("this.add" + topic + "(name);");
    // console.log("sss", topic, name);
    var mesh = eval("this.objectAction.add" + topic + "(name);");
    this.scene.add(mesh);
  },

  updateGeometry: function (topic, name, data) {
    var name = name;
    var data = data;
    var mesh = this.scene.getObjectByName(name);
    var car = this.scene.getObjectByName("car");
    var trackId = this.scene.getObjectByName("trackId");
    // console.log("trackId", trackId);
    if (topic == "Pose" || topic == "Gps84") {
      try {
        eval("this.objectAction.update" + topic + "(mesh, data, this.cameraGroup, car, this.controls);");
      }
      catch (err) {
        console.log("updateGeometryerr", err);
      }
    }
    else if (topic == "BoundingBoxes") {
      try {
        eval("this.objectAction.update" + topic + "(mesh, trackId, data);");
      }
      catch (err) {
        console.log("updateGeometryerr", err);
      }
    }
    else if (topic == "PointCloud") {
      try {
        eval("this.objectAction.update" + topic + "(mesh, data, this.showIntensity);");
      }
      catch (err) {
        console.log("updateGeometryerr", err);
      }
    }
    else {
      try {
        eval("this.objectAction.update" + topic + "(mesh, data);");
      }
      catch (err) {
        console.log("updateGeometryerr", err);
      }
    }
  },

  changeMesh: function (topic, name, color, size) {
    // console.log(color);
    switch (topic) {
      case "Point":
      case "Points":
      case "PointCloud":
        this.changePoints(name, color, size);
        break;
      case "Line":
      case "Lines":
      case "Polygon":
      case "Polygons":
      case "BoundingBox":
      case "BoundingBoxes":
        this.changeLines(name, color, size);
        break;
      case "Pose":
      case "Poses":
      case "Gps84":
        this.changePoses(name, color, size);
        break;
      case "Freespace":
        this.changeFaces(name, color, size);
      default:
        break;
    }
  },

  createCar: function () {
    var car_veyron = {
      name: "Bugatti Veyron",
      url: "source/models/veyron/VeyronNoUv_bin.js",
      init_rotation: [1.57, 1.57, 0],
      scale: 0.013,
      mmap: [
        // tires + inside
        new THREE.MeshLambertMaterial({ color: 0xff0000 }),
        // wheels + extras chrome
        new THREE.MeshLambertMaterial({ color: 0xff0000 }),
        // back / top / front torso
        new THREE.MeshLambertMaterial({ color: 0xff0000, combine: THREE.MultiplyOperation }),
        // glass
        new THREE.MeshLambertMaterial({ color: 0xff0000, opacity: 0.25, transparent: true }),
        // sides torso
        new THREE.MeshLambertMaterial({ color: 0xff0000 }),
        // engine
        new THREE.MeshLambertMaterial({ color: 0xff0000 }),
        // backlights
        new THREE.MeshLambertMaterial({ color: 0xff0000, opacity: 0.5, transparent: true }),
        new THREE.MeshLambertMaterial({ color: 0xff0000, opacity: 0.5, transparent: true })
      ]
    };
    var that = this;
    var loader = new BinaryLoader();
    loader.load(car_veyron.url, function (geometry) {
      geometry.sortFacesByMaterialIndex();
      var car = new THREE.Mesh(geometry, car_veyron.mmap);
      car.name = "car";
      car.rotation.x = car_veyron.init_rotation[0];
      car.rotation.y = car_veyron.init_rotation[1];
      car.rotation.z = car_veyron.init_rotation[2];
      car.position.x = 0;
      car.position.y = 0;
      car.position.z = 0.5;
      car.scale.x = car.scale.y = car.scale.z = car_veyron.scale;
      car.visible = false;
      that.scene.add(car);
      // car.add(that.camera);
      that.camera.position.set(0, 300, -1000);
    });
  },

  loadImageTile: function (x, y, level, name, opacity) {
    var tileMap = new THREE.Group();
    this.scene.add(tileMap);
    // var temp_x = [x - 1, x, x + 1];
    // var temp_y = [y - 1, y, y + 1];
    // var temp_x = [x - 2, x - 1, x, x + 1, x + 1];
    // var temp_y = [y - 2, y - 1, y, y + 1, y + 2];
    var temp_x = [];
    var temp_y = [];
    for (var r = 0; r < 9; r++) {
      temp_x.push(x - 4 + r);
      temp_y.push(y - 4 + r);
    }
    // console.log(temp_x, temp_y);
    for (var ii in temp_y) {
      for (var i in temp_x) {
        // var url = "source/imgs/pic/" + level + "." + temp_x[i] + "." + temp_y[ii] + ".png";
        var url = "source/imgs/" + name + "/" + level + "." + temp_x[i] + "." + temp_y[ii] + ".png";
        // var url = "source/imgs/pic_gs/" + level + "." + temp_x[i] + "." + temp_y[ii] + ".png";
        var loader = new THREE.TextureLoader();
        var texture = loader.load(url);
        var geometry = new THREE.PlaneGeometry(100, 100, 1);
        var material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: opacity,
          side: THREE.DoubleSide
        });
        var mesh = new THREE.Mesh(geometry, material);
        // console.log(temp_x[i], temp_y[ii]);
        mesh.position.x = 100 * (temp_x[i] - x);
        mesh.position.y = - 100 * (temp_y[ii] - y);
        tileMap.add(mesh);
      }
    }
  },

  // sub - unsub
  changeVisibleT: function (name) {
    var mesh = this.scene.getObjectByName(name);
    mesh.visible = true;
  },
  changeVisibleF: function (name) {
    var mesh = this.scene.getObjectByName(name);
    mesh.visible = false;
  },

  // dispose geometry and material remove mesh
  deleteMesh: function (name) {
    var mesh = this.scene.getObjectByName(name);
    // console.log("deleteMesh", mesh);
    this.deleteGroup(mesh);
  },

  // dispose geometry and material remove mesh
  deleteGroup: function (group) {
    // console.log("deleteGroup", group);
    if (group.children.length == 0) {
      group.geometry.dispose();
      group.material.dispose();
      group.parent.remove(group);
    }
    else {
      for (var i = 0; i < group.children.length; i++) {
        this.deleteGroup(group.children[i]);
      }
      group.parent.remove(group);
    }
  },

  bindGroup: function (data) {
    for (var i = this.cameraGroup.children.length - 1; i >= 0; i--) {
      this.scene.add(this.cameraGroup.children[i]);
    }
    for (let v of data) {
      var temp = this.scene.getObjectByName(v);
      this.cameraGroup.add(temp);
    }
    var car = this.scene.getObjectByName("car");
    car.visible = true;
  },

  unbindGroup: function (data) {
    for (let v of data) {
      var temp = this.scene.getObjectByName(v);
      this.scene.add(temp);
    }
    var car = this.scene.getObjectByName("car");
    car.visible = false;
  },

  // change camera to look at other obj
  lockTarget: function (name) {
    this.cameraGroup.name = "camera_" + name;
  },

  unlockTarget: function () {
    this.cameraGroup.name = "stop";
    this.camera.position.z = 300;
    this.camera.up.set(0, 0, 1);
  },

  addGrid: function () {
    var size = 100; //width
    var divisions = 10; //each grid width
    var geometry = new THREE.Geometry(); //创建geometry
    geometry.vertices.push(new THREE.Vector3(-size / 2, 0, 0)); //添加顶点
    geometry.vertices.push(new THREE.Vector3(size / 2, 0, 0));
    for (var i = 0, len = size / divisions; i <= len; i++) {
      var line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: 0x444444,
        })
      );
      line.position.y = i * divisions - size / 2;
      this.gridGroup.add(line);

      var line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: 0x888888,
        })
      );
      line.position.x = i * divisions - size / 2;
      line.rotation.z = Math.PI / 2; //绕y轴旋转90度
      this.gridGroup.add(line);
    }
  },

  //change mesh
  changePoints: function (name, color, size) {
    var points = this.scene.getObjectByName(name);
    this.objectAction.updatePointsMaterial(points, color, size);
  },

  changeLines: function (name, color, size) {
    // line polygon boundingbox use same material
    var mesh = this.scene.getObjectByName(name);;
    if (mesh.type != "Group") {
      this.objectAction.updateLineBasicMaterial(mesh, color, size);
    }
    else if (mesh.type == "Group") {
      for (var i = 0; i < mesh.children.length; i++) {
        this.objectAction.updateLineBasicMaterial(mesh.children[i], color, size);
      }
    }
  },

  changePoses: function (name, color, size) {
    var mesh = this.scene.getObjectByName(name);
    if (mesh.type != "Group") {
      this.objectAction.updatePoseMaterial(mesh, color, size);
    }
    else if (mesh.type == "Group") {
      for (var i = 0; i < mesh.children.length; i++) {
        this.objectAction.updatePoseMaterial(mesh.children[i], color, size);
      }
    }
  },

  changeFaces: function (name, color, opacity) {
    var mesh = this.scene.getObjectByName(name);
    if (mesh.type != "Group") {
      this.objectAction.updateMeshBasicMaterial(mesh, color, opacity);
    }
    else if (mesh.type == "Group") {
      for (var i = 0; i < mesh.children.length; i++) {
        this.objectAction.updateMeshBasicMaterial(mesh.children[i], color, opacity);
      }
    }
  },

  addTrackID: function (name, font) {
    // console.log("addTrackID");
    const initNum = 22;
    var that = this;
    var group = new THREE.Group();
    group.name = name;
    var textMaterial = new THREE.MeshPhongMaterial({
      color: 0x66ff00,
    });

    for (var i = 0; i < initNum; i++) {
      var message = i.toString();
      var geometry = new THREE.TextBufferGeometry(message, {
        size: 1,
        height: 0.1,
        font: font,
      });

      var text = new THREE.Mesh(geometry, textMaterial);
      // text.position.set(Math.random() * 50, 0, 0);
      // text.rotation.x = 0.5 * Math.PI;
      text.visible = false;
      group.add(text);
    }
    that.scene.add(group);
    // return group;
  },

  initChart: function (name) {
    var mesh = this.chart.addChart(name);
    this.scene.add(mesh);
    // console.log("this.scene", this.scene);
  }
});

export { View };

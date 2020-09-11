import * as THREE from "../threejs/three.module.js";
var Chart = function () {
    var xyFontJsonUrl = "js/threejs/fonts/helvetiker_regular.typeface.json";
    var loader = new THREE.FontLoader();
    var temp = readFontPromise();
    readFontAsync();
    var testFont = null;

    function readFontPromise() {
        return new Promise((resolve, reject) => {
            loader.load(xyFontJsonUrl, (data) => {
                // if (err) {
                //   reject(err);
                // }
                resolve(data);
            })
        })
    }

    async function readFontAsync() {
        const r1 = await temp;
        // console.log("init", r1);
        testFont = r1;
    }

    this.addPicChart = function (name) {
        var spriteMaterial = new THREE.SpriteMaterial({
            transparent: true,
            // map: spriteMap,
            side: THREE.DoubleSide
        });

        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(10, 10, 1)
        sprite.position.set(100 * Math.random(), 100 * Math.random(), 100 * Math.random());
        sprite.name = name;
        this.scene.add(sprite);

        var chart = echarts.init($("<canvas width='150' height='150'></canvas>")[0]);
        this.chart.push(chart);
    }

    this.testPicChart = function (name) {
        var test = []
        for (var i = 0; i < 7; i++) {
            test.push(100 * Math.random());
        }
        console.log(test);
        var option2 = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: test,
                type: 'line'
            }],
            // backgroundColor: '#ffffff',
        };
        this.chart[name].setOption(option2);

        var that = this;
        this.chart[name].on('finished', function () {
            var spriteMap = new THREE.TextureLoader().load(that.chart[name].getDataURL());
            var chart = that.scene.getObjectByName(name);
            chart.material.map = spriteMap;
            chart.material.needsUpdate = true
            console.log("chart", chart);
        });

    }

    function axes(x_label, y_label, z_unit, data) {
        var group = new THREE.Group();
        var max_z = 0;
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                if (data[i][j][2] > max_z) {
                    max_z = data[i][j][2];
                }
            }
        }
        var z_length = (max_z - max_z % z_unit) / z_unit + 1;
        // var camera_dis = (x_label.length + 1) * 30 + z_length * 10;
        // this.init(camera_dis);

        //绘制xy坐标面
        var geometry = new THREE.BoxGeometry((x_label.length + 1) * 20, (x_label.length + 1) * 20, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0xB3B3B3, opacity: 0.5, transparent: true });
        var cylinder = new THREE.Mesh(geometry, material);
        cylinder.lookAt(new THREE.Vector3(0, 100, 0));
        cylinder.position.set((x_label.length + 1) * 10, 0, (x_label.length + 1) * 10);
        group.add(cylinder);

        //绘制z轴
        for (var i = 1; i < z_length; i++) {
            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(0, i * 10, 0));
            geometry.vertices.push(new THREE.Vector3(0, i * 10, (x_label.length + 1) * 20));
            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xB3B3B3 }));//绿色 z
            group.add(line);

            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(0, i * 10, 0));
            geometry.vertices.push(new THREE.Vector3((y_label.length + 1) * 20, i * 10, 0));
            var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xB3B3B3 }));//绿色 z
            group.add(line);
        }

        console.log("axes", testFont);
        //标签 


        var text_style = {
            font: testFont,
            size: 4,
            height: 1,
            curveSegments: 12,//曲线上点的数量
            bevelThickness: 0.1, //文本斜面深度
            bevelSize: 0.1, //斜面离轮廓的距离
            bevelEnabled: true //是否打开曲面
        }


        for (var i = 0; i < x_label.length; i++) {
            var textGeo = new THREE.TextGeometry(x_label[i], text_style);
            var textMaterial = new THREE.MeshPhongMaterial({ color: 0xB3B3B3 });
            var mesh = new THREE.Mesh(textGeo, textMaterial);
            //对于文字，先设置lookat和先设置position是不一样的
            mesh.lookAt(new THREE.Vector3(100, 0, 150));
            mesh.position.set((i + 1) * 20, -4, (x_label.length + 1) * 20 + 10);
            // scene.add(mesh);
            group.add(mesh);
        }

        for (var i = 0; i < y_label.length; i++) {
            var textGeo = new THREE.TextGeometry(y_label[i], text_style);
            var textMaterial = new THREE.MeshPhongMaterial({ color: 0xB3B3B3 });
            var mesh = new THREE.Mesh(textGeo, textMaterial);
            //对于文字，先设置lookat和先设置position是不一样的
            mesh.lookAt(new THREE.Vector3(100, 0, 150));
            mesh.position.set((y_label.length + 1) * 20 + 5, -4, (i + 1) * 20);
            // scene.add(mesh);
            group.add(mesh);
        }
        console.log(z_length);

        // for (var i = 0; i < z_length; i++) {
        //     var textGeo = new THREE.TextGeometry(z_unit * i, text_style);
        //     var textMaterial = new THREE.MeshPhongMaterial({ color: 0xB3B3B3 });
        //     var mesh = new THREE.Mesh(textGeo, textMaterial);
        //     mesh.lookAt(new THREE.Vector3(0, 0, 100));
        //     mesh.position.set(-("" + z_unit * i).length * 2, i * 10, (x_label.length + 1) * 20 + 5);
        //     scene.add(mesh);
        // }
        return group;
    }

    this.addChart = function (name) {
        var x_label = ["AP", "ADC", "上单", "打野", "辅助"];
        var x_color = [0x00EE00, 0xEE7AE9, 0xEE0000, 0xB3EE3A, 0x8A2BE2];
        var y_label = ["50分钟", "40分钟", "30分钟", "20分钟", "10分钟"];
        var data = [
            [[1, 1, 5800], [2, 1, 5980], [3, 1, 6020], [4, 1, 4750], [5, 1, 2400]],
            [[1, 2, 3400], [2, 2, 3100], [3, 2, 3300], [4, 2, 2600], [5, 2, 1050]],
            [[1, 3, 2200], [2, 3, 1880], [3, 3, 1620], [4, 3, 1550], [5, 3, 800]],
            [[1, 4, 1600], [2, 4, 1400], [3, 4, 1300], [4, 4, 1000], [5, 4, 500]],
            [[1, 5, 1000], [2, 5, 980], [3, 5, 620], [4, 5, 750], [5, 5, 300]],
        ];
        var z_unit = 1000;

        var group = new THREE.Group();
        group.name = name;

        var axeMesh = axes(x_label, y_label, z_unit, data);
        group.add(axeMesh);

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                //绘制点
                var geometry = new THREE.SphereGeometry(2, 20, 20);
                var material = new THREE.MeshPhongMaterial({ color: x_color[i % (x_label.length)], opacity: 1, transparent: true });
                var cylinder = new THREE.Mesh(geometry, material);
                cylinder.position.set(data[i][j][0] * 20, data[i][j][2] / z_unit * 10, data[i][j][1] * 20);
                // this.scene.add(cylinder);
                group.add(cylinder);

                //连接线段
                // if ((i < data.length - 1)) {
                //   var geometry = new THREE.Geometry();
                //   geometry.vertices.push(new THREE.Vector3(data[i][j][0] * 20, data[i][j][2] / z_unit * 10, data[i][j][1] * 20));
                //   geometry.vertices.push(new THREE.Vector3(data[i + 1][j][0] * 20, data[i + 1][j][2] / z_unit * 10, data[i + 1][j][1] * 20));
                //   var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x7ec0ee }));//绿色 z
                //   this.scene.add(line);
                // }
                //连接线段
                if ((j < data[i].length - 1)) {
                    var geometry = new THREE.Geometry();
                    geometry.vertices.push(new THREE.Vector3(data[i][j][0] * 20, data[i][j][2] / z_unit * 10, data[i][j][1] * 20));
                    geometry.vertices.push(new THREE.Vector3(data[i][j + 1][0] * 20, data[i][j + 1][2] / z_unit * 10, data[i][j + 1][1] * 20));
                    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x7ec0ee }));//绿色 z
                    // this.scene.add(line);
                    group.add(line);
                }
            }
        }
        return group;
    }

    this.updateChart = function (mesh, data) {

    }

}
export { Chart };
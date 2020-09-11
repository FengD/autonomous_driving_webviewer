import {View} from "./view.js";
import {initMain} from "./indexModules/initMain.js";
import {initSwitchs} from "./indexModules/initSwitch.js";
import {initDashBoard} from "./indexModules/dashBoard.js";
import {InitCommonCharts} from "./indexModules/initCommonCharts.js";
import {initMqttFun} from "./indexModules/initMqttFun.js";

$(document).ready(function () {
    var proto;
    var view = new View();
    //存储所有订阅信息
    let topicArray = new Map();
    //store Pose topics
    let poseArray = new Map();
    //store Gps84 topics
    let gpsArray = new Map();
    //store all topics
    let topicStorage = {};
    //localStorage
    let storage = window.localStorage;
    //the topics need init with chart
    const chartTopicArray = ["Pose", "Gps84", "CanSignal"];

    // generate topic list(start)
    function generateTopicList(type, name, ip, port, reName, client, chartObject) {
        if(type!="CanSignal"){
            view.addMesh(type, name);
        }
        let html = `<div class="alert alert-info cloud-list-item" role="alert" id="${name}" title="ip:${ip} port:${port}">
                            <div  class="close-mqtt-btn" title="delete?" id="${"remove" + name}"> <span class="glyphicon glyphicon-trash"></span></div>
                            <div class="item-span" style="width: 200px"><span>type：<b>${type}</b></span></div>
                                <p></p>
                            <div class="item-span" style="width: 240px"><span>name：<b>${name}</b></span></div>
                                <p></p>
                            <div style="float: right;margin-top: 5px">
                                <input type="checkbox"  checked class="${name}" value="${name}" style="float: right"/>
                            </div>
                    </div>`;
        $("#cloud-list").append(html);
        let addForm = $('.add-subscription-form');
        addForm.attr("value", "");
        addForm.addClass('add-form-display');
        $("#addCloudBtn").removeAttr("disabled");

        //init topic without chart
        function initNotChart() {
            let html = `<div id="${name + "-show-editForm"}" class="form-control-btn" title="show modify box">
                            <button  class="glyphicon glyphicon-triangle-bottom"></button>
                        </div>
                        <div  id="${name + "-hide-editForm"}" class="add-form-display form-control-btn" title="hide modify box">
                            <button class="glyphicon glyphicon-triangle-top "></button>
                        </div>
                        <div id="${name + "-form"}" class="add-form-display form-inline" style=" margin-top: 10px;">
                                <div class="form-group" style="float: right"><label for="${name + "-color"}" style="color: #31708f">color:</span><input id="${name + "-color"}"  type="text" class="form-control" style="background-color: #bf3030;width: 60px;padding: 0px 0px;height: 20px;" value="" readonly/></div>
                        </div>
                        `
            $("#" + reName).append(html);
            //初始化color
            $("#" + reName + "-color").colorpicker({
                allowEmpty: true,
                color: "#bf3030",
                showInput: false,
                containerClassName: "full-spectrum",
                showInitial: true,
                showPalette: true,
                showAlpha: false,
                preferredFormat: "hex"
            });

            //control size & capacity
            function editSizeCapacity(reName, flag) {
                let tail;
                let max;
                //size
                if (flag == 1) {
                    tail = "-size";
                    max = 10;
                }//opacity
                else if (flag == 2) {
                    tail = "-opacity";
                    max = 1;
                }
                $("#" + reName + tail).keydown(function () {
                    // Save old value.
                    if (!$(this).val() || (parseInt($(this).val()) <= max && parseInt($(this).val()) >= 0))
                        $(this).data("old", $(this).val());
                });
                $("#" + reName + tail).keyup(function () {
                    // Check correct, else revert back to old value.
                    if (!$(this).val() || (parseInt($(this).val()) <= max && parseInt($(this).val()) >= 0)) {
                        let color = $("#" + reName + "-color").val();
                        let sizeOrOpacity = $("#" + reName + tail).val();
                        //set when this item is empty
                        if (sizeOrOpacity < 0.001) {
                            sizeOrOpacity = 0.01
                        }
                        color = "0x" + color.slice(1);
                        view.changeMesh(type, name, color, sizeOrOpacity);
                    } else
                        $(this).val($(this).data("old"));
                });
            }

            if (type == "Freespace") {
                let html = `<div class="form-group" title="size must >0.01 <=1"><label for="${name + "-opacity"}" style="color: #31708f">opacity:</span><input id="${name + "-opacity"}" type="number" class="form-control" style="width: 60px;padding: 0px 0px;height: 20px;" value="0.7"/></div>`;
                $("#" + reName + "-form").append(html);
                editSizeCapacity(reName, 2);
            } else {
                let html = `<div class="form-group" title="size must >0.01 <10"><label for="${name + '-size'}" style="color: #31708f">size:</span><input id="${name + "-size"}" type="number" class="form-control" style="width: 60px;padding: 0px 0px;height: 20px;" value="1" /></div>`;
                $("#" + reName + "-form").append(html);
                editSizeCapacity(reName, 1);
            }
            $("#" + reName + "-color").on('change', function (event) {
                $("#" + reName + "-color").css('background-color', event.color.toString());
                let color = event.color.toString();
                color = "0x" + color.slice(1);
                let sizeOrOpacity;
                if (type == "Freespace") {
                    sizeOrOpacity = $("#" + reName + "-opacity").val();
                } else {
                    sizeOrOpacity = $("#" + reName + "-size").val();
                }
                view.changeMesh(type, name, color, sizeOrOpacity);
            });
            if(type=="PointCloud")
            {
                html=`<div class="form-group" style="float: right;margin-top: 2px;margin-left: 4px;" title="check to change color"><div class="checkbox"><label><input type="checkbox" id="${name+"-color-checkbox"}"></label></div></div>
                      `
                $("#" + reName + "-color").after(html);
                document.getElementById(name + "-color").setAttribute("disabled","true");
                $("#"+reName+"-color-checkbox").click((obj)=>{
                    if(obj.currentTarget.checked)
                    {
                        document.getElementById(name + "-color").removeAttribute("disabled");
                        view.showIntensity=false;
                    }else {
                        document.getElementById(name + "-color").setAttribute("disabled","true");
                        view.showIntensity=true;
                    }

                })
            }
        }

        //init topic need chart
        function initChart() {
            //define
            let initCommonCharts = new InitCommonCharts(name, type);
            initCommonCharts.initChartPreDom();
            chartObject = initCommonCharts.initChartMain(chartObject);
            //show bigger chart
            $("#" + reName + "-chart-body").click(() => {
                $('#chartModal').modal("toggle");
                document.getElementById(name + "-chart-modal-body").style.display = "block";
                setTimeout(() => {
                    chartObject["topicBigCharts"].resize()
                }, 200)
            })
            //close bigger chart
            $('#chartModal').on('hide.bs.modal', function () {
                document.getElementById(name + "-chart-modal-body").style.display = "none";
            });
        }

        if (chartTopicArray.includes(type)) {
            initChart();
        } else {
            initNotChart();
        }
        //显示修改参数的表单
        $("#" + reName + "-show-editForm").click(() => {
            $("#" + reName + "-show-editForm").toggleClass("add-form-display");
            $("#" + reName + "-hide-editForm").toggleClass("add-form-display");
            $("#" + reName + "-form").toggleClass("add-form-display");
            if (chartTopicArray.includes(type)) {
                setTimeout(() => {
                    chartObject["topicCharts"].resize()
                }, 100)
            }
        });
        $("#" + reName + "-hide-editForm").click(() => {
            $("#" + reName + "-show-editForm").toggleClass("add-form-display");
            $("#" + reName + "-hide-editForm").toggleClass("add-form-display");
            $("#" + reName + "-form").toggleClass("add-form-display");
        });
        //添加移除响应事件
        $("#remove" + reName).click(() => {
            let res = confirm("Whether to delete this information?");
            if (res == true) {
                $("#" + reName).remove();
                if(type!="CanSignal"){
                    view.deleteMesh(name);
                }
                if (poseArray.has(name)) {
                    poseArray.delete(name);
                } else if (gpsArray.has(name)) {
                    gpsArray.delete(name);
                } else {
                    topicArray.delete(name);
                }
                delete topicStorage[name];
                storage.setItem("topicStorage", JSON.stringify(topicStorage));
                try {
                    client.disconnect();
                } catch (e) {
                    console.log(e);
                }

            }
        });
    }

    // generate topic list(end)
    $.getJSON("source/jsons/config.json", function (data) {
        let protoInit = new Promise((resolve, reject) => {
            protobuf.load(data.communication_config.protobuf_file_path, function (
                err,
                root
            ) {
                if (err) {
                    reject(err);
                }
                proto = root;
                resolve(proto);
            });
        })
        protoInit.then((proto) => {
            $("#homepage").createNavHtml(data.nav);
            $("#homepage").createViewHtml();
            //"back to center" button
            $("#navbar").append(`<button type="button" class="btn btn-sm" id="back-btn" style="margin: 8px;background-color: #101010;color: #9d9d9d;border: 1px solid #ccc;height: 33px">Origin</button>`);
            $("#back-btn").click(() => {
                view.getOrigin();
            })
            animate();
            createDetections();

            function animate() {
                requestAnimationFrame(animate);
                view.getControls().update();
                // console.log("test", view.getControls().keys);
                view.getRenderer().render(view.getScene(), view.getCamera());
            }

            function createDetections() {
                for (var element of data.view.detections.elements) {
                    checkAction(element.name, element.check);
                }
            }

            function checkAction(names, check) {
                $("." + check).change(function () {
                    if ($(this).is(":checked")) {
                        for (var name of names) {
                            view.getScene().getObjectByName(name).visible = true;
                        }
                    } else {
                        for (var name of names) {
                            view.getScene().getObjectByName(name).visible = false;
                        }
                    }
                });
            }

            window.addEventListener(
                "resize",
                function () {
                    view.getCamera().aspect = window.innerWidth / window.innerHeight;
                    view.getCamera().updateProjectionMatrix();
                    view
                        .getRenderer()
                        .setSize(window.innerWidth, window.innerHeight - 45);
                },
                false
            );
            //init main component
            initMain(topicArray, poseArray, gpsArray, view, proto);
            //init main component
            //get topics from localStorage
            (function getTopicStorage() {
                if (storage.getItem("topicStorage")) {
                    topicStorage = JSON.parse(storage.getItem("topicStorage"));
                    for (let key in topicStorage) {
                        if (topicStorage[key]["type"] == "Pose") {
                            poseArray.set(key, 0);
                        } else if (topicStorage[key]["type"] == "Gps84") {
                            gpsArray.set(key, 0);
                        } else {
                            topicArray.set(key, 0);
                        }
                        let type = topicStorage[key]["type"];
                        let name = topicStorage[key]["name"];
                        let ip = topicStorage[key]["ip"];
                        let port = topicStorage[key]["port"];
                        let reName = name.replace(/\//g, '\\/');
                        let client;
                        let chartObject = {};
                        let initMqttFuns = new initMqttFun(name, ip, port, type);
                        generateTopicList(type, name, ip, port, reName, client, chartObject);
                        client = initSwitchs(name, ip, port, proto, type, reName, false, client, chartObject, view, chartTopicArray, initMqttFuns);
                    }
                    console.log(topicStorage);
                } else {
                    topicStorage = {};
                    console.log(topicStorage);
                }
            })()

            $(".addSubscriptionBtn").click(function () {
                let nameDom = $("#topic-name");
                let ipDom = $("#topic-ip");
                let portDom = $("#topic-port");
                let type = $("#topic-type option:selected").val();
                let name = nameDom.val().trim();
                let ip = ipDom.val().trim();
                let port = parseInt(portDom.val());
                let reName = name.replace(/\//g, '\\/');
                let client;
                let chartObject = {};
                let initMqttFuns = new initMqttFun(name, ip, port, type);
                let addPromise = new Promise(function (resolve, reject) {
                    $('#loading').modal('show');
                    if (name == "" || name == null || ip == "" || ip == null || port == "" || port == null) {
                        reject("Please enter full information");
                    } else if (name in topicStorage) {
                        reject("you have subscribed this topic");
                    } else {
                        try {
                            client = new Paho.MQTT.Client(ip, port, "");
                            client.onConnectionLost = onConnectionLost;
                            client.onMessageArrived = onMessageArrived;
                            client.connect({
                                onSuccess: onConnect,
                                onFailure: function () {
                                    reject("Connection timed out,please check whether the information is correct");
                                }
                            });
                        } catch (err) {
                            reject("Please check whether the information is correct");
                        }
                    }

                    function onConnect() {
                        //structure view
                        $('#loading').modal('hide');
                        if (type == "Pose") {
                            poseArray.set(name, 0);
                        } else if (type == "Gps84") {
                            gpsArray.set(name, 0);
                        } else {
                            topicArray.set(name, 0);
                        }
                        //generate topic list
                        try {
                            generateTopicList(type, name, ip, port, reName, client, chartObject);
                        } catch (e) {
                            console.log(e);
                        }
                        topicStorage[name] = {"type": type, "name": name, "ip": ip, "port": port};
                        storage.setItem("topicStorage", JSON.stringify(topicStorage));
                        //添加点云信息
                        resolve(true);
                        try {
                            client.subscribe(name, {
                                qos: 0,
                                onSuccess: function () {
                                },
                                onFailure: function () {
                                    alert("连接成功，订阅主题失败！")
                                }

                            });
                        } catch (e) {
                            console.log(e);
                        }
                    }

                    function onConnectionLost(responseObject) {
                        if (responseObject.errorCode !== 0) {
                            $("." + name).bootstrapSwitch('state', false);
                            alert("onConnectionLost:" + "Please check whether the network or service is normal");
                        }
                    }

                    function onMessageArrived(message) {
                        // console.log(message);
                        let messageFile = proto.lookupType("itd.communication.protobuf." + type);
                        let m = messageFile.decode(message.payloadBytes);
                        chartObject = initMqttFuns.messageArrived(m, chartObject, chartTopicArray, view);
                    }

                    //输入框赋为空值
                    nameDom.val("");
                });
                addPromise.then(res => {
                    //init switch
                    try {
                        client = initSwitchs(name, ip, port, proto, type, reName, res, client, chartObject, view, chartTopicArray, initMqttFuns);

                    } catch (e) {
                        console.log(e);
                    }
                }, err => {
                    $('#loading').modal('hide');
                    alert("Tips： Please check whether the information is correct");
                })
            });
        })


    });
});

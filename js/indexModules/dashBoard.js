var initDashBoard = function (name, ip, port, proto) {
    let dashBoardChart = null;
    let dashBoardClient = null;
    var initDashBoardPromise = new Promise((resolve, reject) => {
        dashBoardChart = echarts.init(document.getElementById("dashBoard-list"));
        let option = {
            backgroundColor: '#1b1b1b',
            tooltip: {
                formatter: '{a} <br/>{c} {b}'
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            series: [
                {
                    name: '速度',
                    type: 'gauge',
                    min: 0,
                    max: 210,
                    splitNumber: 7,
                    radius: '80%',
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: [[0.09, 'lime'], [0.82, '#1e90ff'], [1, '#ff4500']],
                            width: 3,
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    axisLabel: {            // 坐标轴小标记
                        textStyle: {
                            fontSize: 13,
                        },
                        fontWeight: 'bolder',
                        color: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 10
                    },
                    axisTick: {            // 坐标轴小标记
                        length: 15,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 25,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            width: 3,
                            color: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    pointer: {
                        width: 3,
                        length: "60%",
                        shadowColor: '#fff',
                        shadowBlur: 5
                    },
                    title: {
                        offsetCenter: [0, "-20%"],
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize: 13,
                            fontStyle: 'italic',
                            color: '#fff',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    detail: {
                        backgroundColor: 'rgba(30,144,255,0.8)',
                        borderWidth: 1,
                        borderColor: '#fff',
                        shadowColor: '#fff', //默认透明
                        shadowBlur: 5,
                        offsetCenter: [0, '65%'],       // x, y，单位px
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            color: '#fff',
                            fontSize: 15
                        }
                    },
                    data: [{value: 40, name: 'km/h'}]
                }
            ]
        }
        setInterval(() => {
            option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
            dashBoardChart.setOption(option);
        }, 2000);
        let html = `<div style="position: absolute; top: 120px; left: 20px;">
                          <input type="checkbox"  checked class="${name}" value="${name}" style="float: right"/>
                  </div>`;
        $("#dashBoard").append(html);
        html = `<div class="dashBoardContent">
                    <span>gear:</span>
                    <div class="dashBoardItem">
                       3
                    </div>
              </div>
              <div class="dashBoardContent">
                    <span>course:</span>
                    <div class="dashBoardItem">
                      northeast
                    </div>
              </div>`
        $("#dashBoard").append(html);
        resolve();
    })

    function initSwitch() {
        $("." + name).bootstrapSwitch({
            state: false,
            onText: "on",
            offText: "off",
            onColor: "success",
            offColor: "danger",
            size: "mini",
            handleWidth: "20",
            onSwitchChange: function (event, state) {
                if (state == true) {
                    try {
                        dashBoardClient.subscribe(name);
                    } catch (e) {
                        try {
                            //reConnect
                            dashBoardClient = new Paho.MQTT.Client(ip, port, "");
                            dashBoardClient.onConnectionLost = function (responseObject) {
                                if (responseObject.errorCode !== 0) {
                                    alert("onConnectionLost:" + "Please check whether the network or service is normal");
                                }
                            };
                            dashBoardClient.onMessageArrived = function (message) {
                                let messageFile = proto.lookupType("itd.communication.protobuf." + type);
                                let m = messageFile.decode(message.payloadBytes);
                                console.log(m);
                            };
                            dashBoardClient.connect({
                                onSuccess: function () {
                                    try {
                                        dashBoardClient.subscribe(name);
                                    } catch (e) {
                                        console.log(e);
                                    }
                                }, onFailure: function () {
                                    alert("Connection timed out");
                                }
                            });
                        } catch (err) {
                            $("." + name).bootstrapSwitch('state', false);
                            console.log("Unable to connect,Please check whether the network or service is normal");
                        }
                        console.log(e);
                    }

                } else {
                    try {
                        dashBoardClient.unsubscribe(name);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        });
    }

    initDashBoardPromise.then(() => {
        initSwitch();
    })
}
export {initDashBoard}
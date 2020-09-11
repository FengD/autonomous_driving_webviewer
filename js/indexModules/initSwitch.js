var initSwitchs = function (name, ip, port, proto, type, reName, flag, client, chartObject, view, chartTopicArray, initMqttFuns) {
    $("." + reName).bootstrapSwitch({
        state: flag,
        onText: "on",
        offText: "off",
        onColor: "success",
        offColor: "danger",
        size: "mini",
        handleWidth: "20",
        onSwitchChange: function (event, state) {
            if (state == true) {
                try {
                    client.subscribe(name, {
                        onSuccess: function () {
                            view.changeVisibleT(name);
                        }, onFailure: function () {
                        }
                    });
                } catch (e) {
                    try {
                        //reConnect
                        client = new Paho.MQTT.Client(ip, port, "");
                        client.onConnectionLost = function (responseObject) {
                            if (responseObject.errorCode !== 0) {
                                $("." + reName).bootstrapSwitch('state', false);
                                alert("onConnectionLost:" + "Please check whether the network or service is normal");
                            }
                        };
                        client.onMessageArrived = function (message) {
                            // console.log(message);
                            let messageFile = proto.lookupType("itd.communication.protobuf." + type);
                            let m = messageFile.decode(message.payloadBytes);
                            initMqttFuns.messageArrived(m, chartObject, chartTopicArray, view);
                        };
                        client.connect({
                            onSuccess: function () {
                                try {
                                    client.subscribe(name, {
                                        onSuccess: function () {
                                            $("." + reName).bootstrapSwitch('state', true);
                                        }, onFailure: function () {
                                            alert("连接成功，订阅主题失败！")
                                        }
                                    });
                                } catch (e) {
                                    $("." + reName).bootstrapSwitch('state', false);
                                    console.log(e);
                                }
                            }, onFailure: function () {
                                $("." + reName).bootstrapSwitch('state', false);
                                alert("Connection timed out");
                            }
                        });
                    } catch (err) {
                        $("." + reName).bootstrapSwitch('state', false);
                        console.log("Unable to connect,Please check whether the network or service is normal");
                    }
                }

            } else {
                try {
                    client.unsubscribe(name);
                    if(type!="CanSignal")
                    {
                        view.changeVisibleF(name);
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
    });
    return client;
}

export {initSwitchs}

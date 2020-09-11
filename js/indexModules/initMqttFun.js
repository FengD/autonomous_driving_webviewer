var initMqttFun = function (name, ip, port, type) {
    this.name = name;
    this.ip = ip;
    this.port = port;
    this.type = type;
}
initMqttFun.prototype.messageArrived = function (m, chartObject, chartTopicArray, view) {
    if (chartTopicArray.includes(this.type)) {
        let options = [];
        if (this.type != "CanSignal") {
            for (let key in chartObject) {
                if (key != "topicCharts" & key != "topicBigCharts") {
                    chartObject[key].shift();
                    if (typeof m[key] == "undefined") {
                        chartObject[key].push(0);
                    } else {
                        chartObject[key].push(m[key]);
                    }
                    options.push({data: chartObject[key]});
                }
            }
            chartObject["topicCharts"].setOption({series: options})
            chartObject["topicBigCharts"].setOption({series: options})
            view.updateGeometry(this.type, this.name, m);
        } else {
            if (chartObject["dataMap"].has(m.id)) {
                for (let i = 0; i < m["nb_signal"]; i++) {
                    chartObject["dataMap"].get(m.id)[i].pop();
                    chartObject["dataMap"].get(m.id)[i].push(m.signal[i]);
                    options.push({"name": m.id, data: chartObject["dataMap"].get(m.id)[i]});
                }
                chartObject["topicCharts"].setOption({series: options})
                chartObject["topicBigCharts"].setOption({series: options})
            } else {
                let dataArr = []
                options = chartObject["topicBigCharts"].getOption();
                let topicChartOption = chartObject["topicCharts"].getOption();
                for (let i = 0; i < m["nb_signal"]; i++) {
                    let dataItem = new Array(100).fill(0);
                    dataItem.pop()
                    dataItem.push(m.signal[i]);
                    dataArr.push(dataItem)
                    options.legend[0].data.push(m.id);
                    options.series.push({'name': m.id, "type": 'line', "data": dataItem});
                    topicChartOption.series.push({'name': m.id, "type": 'line', "data": dataItem});
                }
                chartObject["topicCharts"].setOption(topicChartOption);
                chartObject["topicBigCharts"].setOption(options);
                chartObject["dataMap"].set(m.id, dataArr)
            }
        }

    } else {
        view.updateGeometry(this.type, this.name, m);
    }
    return chartObject;
}
export {initMqttFun}
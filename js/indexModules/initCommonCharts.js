function InitCommonCharts(name, type) {
    this.name = name;
    this.type = type;
}

InitCommonCharts.prototype.initChartPreDom = function () {
    let reName = this.name.replace(/\//g, '\\/');
    let html = `<div id="${this.name + "-show-editForm"}" class="form-control-btn" title="show modify box">
                    <button  class="glyphicon glyphicon-triangle-bottom"></button>
                 </div>
                 <div  id="${this.name + "-hide-editForm"}" class="add-form-display form-control-btn" title="hide modify box">
                     <button class="glyphicon glyphicon-triangle-top "></button>
                 </div>
                 <div id="${this.name + "-form"}" class="add-form-display form-inline" style=" margin-top: 10px;cursor: pointer">
                     <div id="${this.name + '-chart-body'}" style="height: 230px;width: 100%;margin: 0;"> </div>
                 </div>`;

    $("#" + reName).append(html);
    html = `<div id="${this.name + "-chart-modal-body"}" style="display: none;width: 100%;height: 100%"></div>`
    $("#chart-modal-body").append(html);
}
InitCommonCharts.prototype.initChartsOptions = function (chartObject, type) {
    let titles = [];
    for (let i = 0; i < 100; i++) {
        titles.push(i);
    }
    let commonOption = {
        backgroundColor: "#ffff",
        tooltip: {
            trigger: 'axis',
            position: 'right'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '8%',
            containLabel: true
        },
        dataZoom: [
            {
                type: 'inside',
                start: 94,
                end: 100
            }
        ],
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: titles
        },
        yAxis: {
            type: 'value'
        }
    };
    let series = [];
    let data = [];
    let legend = {};
    if (type != "CanSignal") {
        for (let key in chartObject) {
            if (key != "topicCharts" & key != "topicBigCharts") {
                series.push({"name": key, "type": 'line', "data": chartObject[key]});
                data.push(key);
            }
        }
        commonOption.series = series;
    } else {
        legend.type = "scroll";
    }
    legend.data = data;
    chartObject["topicCharts"].setOption(commonOption);
    chartObject["topicBigCharts"].setOption(commonOption);
    chartObject["topicBigCharts"].setOption({
        title: {
            text: name + '折线图',
            top: 20
        },
        grid: {
            top: '14%',
        },
        legend: legend
    })

    return chartObject;
}
InitCommonCharts.prototype.initChartMain = function (chartObject) {
    // let reName = this.name.replace(/\//g, '\\/');
    let topicCharts = echarts.init(document.getElementById(this.name + '-chart-body'));
    let topicBigCharts = echarts.init(document.getElementById(this.name + '-chart-modal-body'));
    chartObject["topicCharts"] = topicCharts;
    chartObject["topicBigCharts"] = topicBigCharts;
    let i = null;
    switch (this.type) {
        case "Pose":
            chartObject.x = [];
            chartObject.y = [];
            chartObject.z = [];
            chartObject.roll = [];
            chartObject.pitch = [];
            chartObject.yaw = [];
            for (i = 0; i < 100; i++) {
                chartObject.x.push(0);
                chartObject.y.push(0);
                chartObject.z.push(0);
                chartObject.roll.push(0);
                chartObject.pitch.push(0);
                chartObject.yaw.push(0);
            }
            chartObject = this.initChartsOptions(chartObject);
            break;
        case "Gps84":
            chartObject["latitude"] = [];
            chartObject["longitude"] = [];
            chartObject["altitude"] = [];
            chartObject["pitch"] = [];
            chartObject["utc_sec"] = [];
            for (i = 0; i < 100; i++) {
                chartObject["latitude"].push(0);
                chartObject["longitude"].push(0);
                chartObject["altitude"].push(0);
                chartObject["pitch"].push(0);
                chartObject["utc_sec"].push(0);
            }
            chartObject = this.initChartsOptions(chartObject);
            break;
        case "CanSignal":
            let map = new Map();
            chartObject["dataMap"] = map;
            chartObject = this.initChartsOptions(chartObject, this.type);
            break;
    }
    return chartObject;

}
export {InitCommonCharts}
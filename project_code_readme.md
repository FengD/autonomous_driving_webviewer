### Project Code Readme


## index.js (用来定义整个基础框架及基础界面)
1. 调用各个子模块，以达到界面构建，通信构建，localstorage构建的目的；
2. localStorage用于在浏览器刷新时保存相关订阅话题及信息；
3. cansignal 表格显示功能未开发完，需要进一步优化

详细说明：

```
// 定义订阅生效后元素尺寸和颜色的调整功能工具
function editSizeCapacity(reName, flag)
```


## view.js (用来渲染整个threejs 渲染的3d场景)
1. View类型，初始化相机，控制器，场景，渲染器，网格，原点，高精地图，车辆模型等，用于index.js调用；

2. Object类型：
init初始化，场景背景，相机尺寸大小位置，光源角度尺寸颜色，网格，控制器控制精度，圖表，文字地圖等

readFontPromise 加载文字信息，用于objectbbox
readFontAsync 加载测试信息文字
initMap 加载初始化地图 shp文件
addMesh 被index.js调用，用于加载场景元素的纹理信息
updateGeometry 被initMqttFun.js调用，在话题会调函数或者按钮事件响应中更新场景元素信息，包括位置
changeMesh 被index.js调用，在话题会调函数或者按钮事件响应中更新场景元素信息，包括大小颜色
createCar 添加车辆模型，用于场景绑定时，显示小车
changeVisibleT 在订阅按钮切换时调整对应元素的可见性为true
changeVisibleF 在订阅按钮切换时调整对应元素的可见性为false
deleteMesh 删除纹理
组的概念为多个元素绑定定位信息时的位置结合，以下函数均用于绑定和解绑时各个元素的替换情况
deleteGroup 删除组
bindGroup 绑定组
unbindGroup 解绑组
lockTarget 将相机绑定在某个目标上
unlockTarget 将相机解绑
addGrid 添加网格
changePoints 更新点集
changeLines 更新线集
changePoses 更新位置集
changeFaces
addTrackID

## component.js (用来渲染这个html静态界面的)
## dashBoard.js.tobecontinue (用于之后的仪表显示，目前处于废弃状态)
## initCommonCharts.js (用于显示和创建can信号的图表)
## initMain.js（创建侧边栏功能）
## initMqttFun.js (定义mqtt链接及话题更新调用)
## initSwitch.js (定义侧边栏订阅按钮)

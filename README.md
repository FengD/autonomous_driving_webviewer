# ITD IPD WEBVIEW

## Author
丁丰 王博 徐嘉丰

## Description
环境感知可视化WEB工具；
可在浏览器中直接运行；
数据通信采用mqtt协议；
可视化采用three.js库，按照view.proto文件接收并显示各类数据；


## Notice

* 在未经master所有者授权情况下，禁止泄露源码到工程成员以外人员

## 版本说明

| Version | Update | Contractor | Description | Remark |
| ------- | ------ |   :----:   |   --------  | ------ |
| V1.0.0  | 2020/5/29   |    丁丰 王博 徐嘉丰  | 通信链路 界面样式交互操作 three.js元素显示||


## 怎样使用

1. clone 项目工程至/var/www/html下，或clone至挂载到镜像/var/www/html目录的本地目录
2. 在浏览器中输入localhost:port/itd_ipd_webview_master/,若为原始nginx使用则为80，若使用镜像，则输入映射的端口号，如9980
3. 按住 ctrl + shift + i 进入开发者模式，在刷新处采用hrad reload刷新

## 主要依赖
mqttws31.js
protobuf.min.js
three.js
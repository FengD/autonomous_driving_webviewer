import {initDashBoard} from "./dashBoard.js";
//init main component html
var initMain=function (topicArray,poseArray,gpsArray,view,proto) {
    let htmlContent = `
                    <div class="modal fade" id="loading" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop='static'>
                        <div class="modal-dialog" role="document">
                             <div class="modal-content">
                                  <div class="modal-header">
                                   <h4 class="modal-title" id="myModalLabel">tips</h4>
                                  </div>
                                  <div class="modal-body">
                                   Connecting,please wait
                                  </div>
                             </div>
                            </div>
                   </div>
                   <!--   group modal-->
                   <div class="modal fade" id="groupModal" tabindex="-1" role="dialog" aria-labelledby="groupModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                             <div class="modal-content">
                                  <div class="modal-header">
                                       <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                                        &times;
                                       </button>
                                       <h4 class="modal-title" id="groupModalLabel">
                                        Group management
                                       </h4>
                                  </div>
                                  <div id="group-modal-body" class="modal-body">
                                     <div>Please assign Pose topic</div>
                                  </div>
                                  <div class="modal-footer">
                                       <button type="button" class="btn btn-default group-edit-btn" data-dismiss="modal" >
                                       cancel
                                       </button>
                                       <button id="edit-group-look-btn" type="button" class="btn btn-success group-edit-btn" >
                                        bind
                                       </button>
                                       <button id="edit-group-unlook-btn" type="button" class="btn btn-warning  group-edit-btn" >
                                        unbind
                                       </button>
                                  </div>
                             </div><!-- /.modal-content -->
                        </div><!-- /.modal -->
                   </div> 
                   <!-- chart modal-->
                   <div class="modal fade" id="chartModal" tabindex="-1" role="dialog" aria-labelledby="chartModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                             <div class="modal-content">
                                  <div class="modal-header">
                                       <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                                        &times;
                                       </button>
                                       <h4 class="modal-title" id="chartModalLabel">
                                       charts
                                       </h4>
                                  </div>
                                  <div class="modal-body" id="charts-modal-body" style="width: 100%">
                                      <div id="chart-modal-body" style="height: 400px;width: 100%;margin: 0">
                                      </div>
                                  </div>
                                  <div class="modal-footer">
                                       <button type="button" class="btn btn-default" data-dismiss="modal" id="chart-cancel-btn">
                                       cancel
                                       </button>
                                  </div>
                             </div><!-- /.modal-content -->
                        </div><!-- /.modal -->
                   </div>
                   <div id="wrapper">
                <!--    <div class="overlay"></div>-->
                    <!-- Sidebar -->
                    <nav class="navbar navbar-inverse navbar-fixed-top" id="sidebar-wrapper" role="navigation">
                     <ul class="nav sidebar-nav">
                      <div class="add-subscription " >
                       <div style="margin-top: 20px"> 
                           <!-- Nav tabs -->
                              <ul class="nav nav-tabs" role="tablist" style="width: 270px;margin:  0 auto">
                                <li role="presentation" class="active control-div"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">topics</a></li>
                                <li role="presentation" id="show-dashBoard" class="control-div" ><a href="#dashBoard" aria-controls="dashBoard" role="tab" data-toggle="tab">Dashboard</a></li>
                              </ul> 
                              <!-- Tab panes -->
                              <div class="tab-content">
                                <div role="tabpanel" class="tab-pane active" id="home">
                                    <div class="container-fluid" style="width: 250px;margin: 20px auto;">
                                     <div class="row">
                                      <div class="col-sm-6 col-xs-6"><button  id="addCloudBtn"  class="btn btn-default btn-sm glyphicon glyphicon-plus-sign" style="float: left;width: 58px;font-size: 18px;padding: 0px;text-align: center" ></button></div>
                                      <div class="col-sm-6 col-xs-6" ><button  id="addGroupBtn"  class="btn btn-default btn-sm" style="float: right;">group</button></div>
                                     </div>
                                    </div>
                                    <div class="add-subscription-form add-form-display" style="width: 250px;margin: 20px auto;height: 230px">
                                     <div class="form-group">
                                       <select class="form-control" id="topic-type">
                                        <option>Point</option>
                                        <option>Points</option>
                                        <option>Line</option>
                                        <option>Lines</option>
                                        <option>Polygon</option>
                                        <option>Polygons</option>
                                        <option>Pose</option>
                                        <option>Poses</option>
                                        <option>BoundingBox</option>
                                        <option>BoundingBoxes</option>
                                        <option>PointCloud</option>
                                        <option>Freespace</option>
                                        <option>Gps84</option>
                                        <option>CanSignal</option>
                                       </select>
                                     </div>
                                     <div class="form-group">
                                       <input type="text" class="form-control" id="topic-name" placeholder="please enter name">
                                     </div>
                                     <div class="form-group">
                                       <input type="text" class="form-control" id="topic-ip" placeholder="please enter ip">
                                     </div>
                                     <div class="form-group">
                                       <input type="number" class="form-control" id="topic-port" placeholder="please enter port">
                                     </div>
                                     <div style="width: 100%">
                                      <button  class="btn btn-sm addSubscriptionBtn" style="width: 58px;float: left">sub</button>
                                      <button  class="btn btn-sm btn-warning removeBtn" style="width: 58px;float: right">cancel</button>
                                     </div>
                                    </div>
                                    <div id="cloud-list"></div>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="dashBoard">
                                    <div class="chart-list" id="dashBoard-list" style="width: 280px;height:280px;margin:20px 10px">  </div>
                                </div>
                              </div> 
                       </div>
                      </div>
                     </ul> 
                    </nav>
                    <!-- /#sidebar-wrapper -->
                    <!-- Page Content -->
                    <div id="page-content-wrapper">
                     <button type="button" class="hamburger is-closed animated fadeInLeft" data-toggle="offcanvas">
                      <span class="hamb-top"></span>
                      <span class="hamb-middle"></span>
                      <span class="hamb-bottom"></span>
                     </button>
                
                     <div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                     </div>
                    </div>
                    <!-- /#page-content-wrapper -->
                   </div>`
    $("#homepage").append(htmlContent);
    var trigger = $('.hamburger'),
        overlay = $('.overlay'),
        isClosed = false;
    trigger.click(function () {
        hamburger_cross();
    });
    function hamburger_cross() {
        if (isClosed == true) {
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
            isClosed = false;
        } else {
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
            isClosed = true;
        }
    }
    $('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
    });
    $('#addCloudBtn').click(function () {
        $('.add-subscription-form').toggleClass('add-form-display');
    });
    $("#addCloudBtn").click(function () {
        $("#addCloudBtn").attr("disabled", "disabled");
    });
    $(".removeBtn").click(function () {
        //重置信息
        $('#addCloudBtn').removeAttr('disabled');
        $("#topic-name").val("");
        $("#topic-ip").val("");
        $("#topic-port").val("");
        $('.add-subscription-form').addClass('add-form-display');
    });
    //init dashBoard start
    initDashBoard();
    //init dashBoard end

    //control group modal start
    $("#addGroupBtn").click(() => {
        if (topicArray.size == 0 && poseArray.size == 0 && gpsArray.size == 0) {
            alert("No topic is currently subscribed");
        }
        else {
            $("#group-modal-body").append(`<div id="group-modal-child"><div id="pose-radio-child"></div><hr class="hr1"/><div>Please assign other topics</div></div>`);
            let groupChildHtml = $("#group-modal-child");
            let htmls;
            poseArray.forEach((value, key) => {
                if (value == 0) {
                    htmls = `<label class="radio-inline">
                                <input type="radio" id="${key + "-radio"}" name="poseGpsRadios" value="${key}"> ${key}
                              </label>`
                } else {
                    htmls = `<label class="radio-inline">
                                <input type="radio" id="${key + "-radio"}" name="poseGpsRadios" value="${key}" checked> ${key}
                              </label>`
                }
                $("#pose-radio-child").append(htmls);
            });
            gpsArray.forEach((value, key) => {
                if (value == 0) {
                    htmls = `<label class="radio-inline">
                                <input type="radio" id="${key + "-radio"}" name="poseGpsRadios" value="${key}"> ${key}
                              </label>`
                } else {
                    htmls = `<label class="radio-inline">
                                <input type="radio" id="${key + "-radio"}" name="poseGpsRadios" value="${key}" checked> ${key}
                              </label>`
                }
                $("#pose-radio-child").append(htmls);
            });
            topicArray.forEach((value, key) => {
                if (value == 0) {
                    htmls = `<label class="checkbox-inline">
                                <input type="checkbox" id="${key + "-checkbox"}" value="${value}"> ${key}
                              </label>`
                } else {
                    htmls = `<label class="checkbox-inline">
                                <input type="checkbox" id="${key + "-checkbox"}" value="${value}" checked> ${key}
                              </label>`
                }
                groupChildHtml.append(htmls);
            });
            $('#groupModal').modal("toggle");
        }
    });
    $("#edit-group-look-btn").click(() => {
        let groupNames = [];
        let poseGpsName = $("input[name='poseGpsRadios']:checked").val();
        if (poseGpsName != '' && poseGpsName != undefined && poseGpsName != null) {
            // groupNames.push(poseName);
            poseArray.forEach((value, key) => {
                if (key == poseGpsName) {
                    poseArray.set(key, 1);
                } else {
                    poseArray.set(key, 0);
                }
            });
            gpsArray.forEach((value, key) => {
                if (key == poseGpsName) {
                    gpsArray.set(key, 1);
                } else {
                    gpsArray.set(key, 0);
                }
            });
            topicArray.forEach((value, key) => {
                if ($("#" + key.replace(/\//g, '\\/') + "-checkbox")[0].checked == true) {
                    //topicArray.delete(key);
                    topicArray.set(key, 1);
                    groupNames.push(key);
                } else {
                    topicArray.set(key, 0);
                }
            });
            view.bindGroup(groupNames);
            $('#groupModal').modal("toggle");
        } else {
            alert("Please choose Pose topic");
        }
    });
    $("#edit-group-unlook-btn").click(() => {
        let groupNames = [];
        let poseGpsName = $("input[name='poseGpsRadios']:checked").val();
        if (poseGpsName != '' && poseGpsName != undefined && poseGpsName != null) {
            // groupNames.push(poseName);
            poseArray.forEach((value, key) => {
                poseArray.set(key, 0);
            });
            gpsArray.forEach((value, key) => {
                gpsArray.set(key, 0);
            });
            topicArray.forEach((value, key) => {
                if ($("#" + key.replace(/\//g, '\\/') + "-checkbox")[0].checked == true) {
                    //topicArray.delete(key);
                    topicArray.set(key, 0);
                    groupNames.push(key);
                } else {
                    topicArray.set(key, 0);
                }
            });
            view.unbindGroup(groupNames);
            $('#groupModal').modal("toggle");
        } else {
            alert("Please choose Pose topic");
        }
    });
    $("#groupModal").on('hide.bs.modal', function () {
        $("#group-modal-child").remove();
    });
    //control group modal end
}
export {initMain}
(function ($) {
  "use strict";

  function Nav(obj, parameters) {
    this.tiggerObj = obj;
    this.param = parameters;
    this.createDom();
  }

  Nav.prototype.createDom = function () {
    var $nav = $('<nav class=\"navbar navbar-inverse navbar-fixed-top\"  tabindex=\"-1\"></nav>');
    var $navContainer = $('<div class="container" style="width: 100%"></div>');
    this.tiggerObj.append($nav);
    $nav.append($navContainer);
    $navContainer.append(this.createNavHeader());
    $navContainer.append(this.createNavHtml());
  };

  Nav.prototype.createNavHeader = function () {
    var navbarHeaderHtml = "<div class=\"navbar-header\">";
    navbarHeaderHtml += "<img src=\"" + this.param.logo_img_path + "\" class=\"navbar-brand logo img-rounded\">";
    navbarHeaderHtml += "<button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">";
    navbarHeaderHtml += "<span class=\"sr-only\">Toggle navigation</span>";
    navbarHeaderHtml += "<span class=\"icon-bar\"></span>";
    navbarHeaderHtml += "<span class=\"icon-bar\"></span>";
    navbarHeaderHtml += "<span class=\"icon-bar\"></span>";
    navbarHeaderHtml += "</button>";
    navbarHeaderHtml += "<a class=\"navbar-brand\" href=\"#\">" + this.param.navbar_brand + "</a>";
    navbarHeaderHtml += "</div>";
    return navbarHeaderHtml;
  };

  Nav.prototype.createNavHtml = function (obj) {
    var $navDiv = $('<div id=\"navbar\" class=\"collapse navbar-collapse\"></nav>');
    var $navUl = $('<ul class="nav navbar-nav"></nav>');
    // $navUl.append("<li class=\"active\"><a href=\"#\">" + this.param.navbar_sub_brand + "</a></li>");
    $.each(this.param.button_groups, function(index, button_group) {
      var $btnLi = $('<li></li>');
      var $btn = $('<div class="btn-group" tabindex="-1"></div>');
      var btnHtml = "<button type=\"button\" class=\"btn-head btn btn-default\">" + button_group.button_name + "</button>";
      btnHtml += "<button type=\"button\" class=\"btn-head btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">";
      btnHtml += "<span class=\"caret\"></span>";
      btnHtml += "</button>";
      var $menu = $('<ul class=\"dropdown-menu\" role=\"menu\"></ul>');
      $.each(button_group.dropdown_menu, function(index, item) {
        var itemHtml = "<li>";
        itemHtml += "<div class=\"row display-drop-item\">";
        itemHtml += "<div>";
        itemHtml += "<label class=\"form-inline\"><input class=\"mui-switch mui-switch-animbg " + item.check + "\" type=\"checkbox\" ";
        if (item.init_check) {
          itemHtml += item.init_check;
        }
        itemHtml += ">" + item.item_name + "</label>";
        itemHtml += "</div>";
        itemHtml += "</div>";
        itemHtml += "</li>";
        $menu.append(itemHtml);
      });
      $btn.append(btnHtml);
      $btn.append($menu);
      $btnLi.append($btn);
      $navUl.append($btnLi);
    });
    $navDiv.append($navUl);
    return $navDiv;
  }

  $.fn.createNavHtml = function (options) {
    var nav = new Nav(this, options);
    return nav;
  };

  $.fn.createViewHtml = function () {
    var viewHtml = "<div class=\"container-fluid\">";
    viewHtml += "<div class=\"row\">";
    viewHtml += "<div class=\"col-12 center\">";
    viewHtml += "<div id=\"view\" class=\"map\" />";
    viewHtml += "</div>";
    viewHtml += "</div>";
    viewHtml += "</div>";
    this.append(viewHtml);
  };

})(jQuery);

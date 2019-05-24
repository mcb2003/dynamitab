"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// this is the dynamitab.js class file..
// this is a class definition for a Tab. Tabs can be added to TabView objects.
var Tab =
/*#__PURE__*/
function () {
  function Tab(tabview, id, title) {
    var description = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;

    _classCallCheck(this, Tab);

    this._id = id;
    this.title = title;
    this.description = description;
    this.class_prefix = tabview.class_prefix;
    this._tabview_id = tabview.id;
    this.panel_heading_level = tabview.panel_heading_level;
    this.panel_heading_class = tabview.panel_heading_class;
    this.tab_id = tabview.id + "-tab" + id;
    this.tab_class = tabview.class_prefix + "-tab";
    this.panel_id = tabview.id + "-panel" + id;
    this.panel_class = tabview.class_prefix + "-panel";
  }

  _createClass(Tab, [{
    key: "select",
    value: function select() {
      var tab = document.querySelector("#" + this.tab_id);

      if (tab && tab.getAttribute("aria-selected") != "true") {
        // get all tabs.
        var tabs = tab.parentElement.children; // deselect them all.

        for (var i = 0; i < tabs.length; i++) {
          tabs[i].setAttribute("aria-selected", "false");
        } // select the one that's clicked.


        tab.setAttribute("aria-selected", "true"); // get the current tab panel.

        var panelid = tab.getAttribute("aria-controls");
        var current_panel = document.querySelector("#" + panelid); // from this, get all the panels.

        var panels = current_panel.parentElement.children; // hide all panels.

        for (var j = 0; j < panels.length; j++) {
          panels[j].setAttribute("aria-hidden", "true");
        } // show the correct panel.


        current_panel.setAttribute("aria-hidden", "false"); // finally, focus the newly selected tab.

        tab.focus();
      }
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    },
    set: function set(value) {
      this._id = value;
      this.tab_id = this.tabview_id + "-tab" + value;
      this.panel_id = this.tabview_id + "-panel" + value;
    }
  }, {
    key: "tabview_id",
    get: function get() {
      return this._tabview_id;
    },
    set: function set(value) {
      this._tabview_id = value;
      this.tab_id = value + "-tab" + this.id;
      this.tab_class = value + "-tab";
      this.panel_id = value + "-panel" + this.id;
      this.panel_class = value + "-panel";
    }
  }, {
    key: "tab_element",
    get: function get() {
      var tabobj = document.createElement("li");
      tabobj.setAttribute("role", "tab");
      tabobj.setAttribute("id", this.tab_id);
      tabobj.setAttribute("class", this.tab_class);
      tabobj.setAttribute("data-tabid", this.id);
      tabobj.setAttribute("tabindex", "0");
      tabobj.setAttribute("aria-controls", this.panel_id);

      if (this.description != undefined) {
        tabobj.setAttribute("title", this.description);
      }

      tabobj.textContent = this.title;
      return tabobj;
    }
  }, {
    key: "panel_element",
    get: function get() {
      var panelobj = document.createElement("section");
      panelobj.setAttribute("id", this.panel_id);
      panelobj.setAttribute("class", this.panel_class);
      panelobj.setAttribute("aria-labelledby", this.tab_id);
      panelobj.setAttribute("role", "tabpanel");
      panelobj.setAttribute("data-tabid", this.id);
      var panelheading = document.createElement("h" + this.panel_heading_level);
      panelheading.setAttribute("class", this.panel_heading_class);
      panelheading.textContent = this.title;
      panelobj.appendChild(panelheading);
      return panelobj;
    }
  }, {
    key: "selected",
    get: function get() {
      var tab = document.querySelector("#" + this.tab_id);

      if (tab && tab.getAttribute("aria-selected") == "true") {
        return true;
      } else {
        return false;
      }
    }
  }]);

  return Tab;
}(); // this is the class definition for TabView objects (the main object used when constructing a TabView).


var TabView =
/*#__PURE__*/
function () {
  function TabView(id) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      class_prefix: undefined,
      default_tab: 1,
      expand_tabs: true,
      panel_heading_level: 2,
      panel_heading_class: undefined
    };

    _classCallCheck(this, TabView);

    this._id = id;

    if (options.class_prefix === undefined) {
      this.class_prefix = id;
    } else {
      this.class_prefix = options.class_prefix;
    }

    this.panel_heading_level = options.panel_heading_level;

    if (options.panel_heading_class === undefined) {
      this.panel_heading_class = this.class_prefix + "-panelheading";
    } else {
      this.panel_heading_class = options.panel_heading_class;
    }

    this.tabs = Array();
    this.expand_tabs = options.expand_tabs;
    this.default_tab = options.default_tab;
    this.tablist_id = id + "-tablist";
    this.tablist_class = this.class_prefix + "-tablist";
  }

  _createClass(TabView, [{
    key: "getTabById",
    value: function getTabById(id) {
      for (var i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].id == id) {
          return this.tabs[i];
        }
      }

      return undefined;
    }
  }, {
    key: "registerEvents",
    value: function registerEvents() {
      var tab_elements = document.querySelector("#" + this.tablist_id);
      tab_elements = tab_elements.children;
      var self = this;

      for (var i = 0; i < tab_elements.length; i++) {
        tab_elements[i].addEventListener("click", function () {
          var id = this.getAttribute("data-tabid");

          if (id) {
            var tab = self.getTabById(id);
            tab.select();
          }
        });
        tab_elements[i].addEventListener("keydown", function (event) {
          if (event.which === 13) {
            event.preventDefault();
            this.click();
          } else if (event.which === 37) {
            event.preventDefault();
            self.previousTab();
          } else if (event.which === 39) {
            event.preventDefault();
            self.nextTab();
          }
        });
      }
    }
  }, {
    key: "previousTab",
    value: function previousTab() {
      // get the index of the current tab.
      var index = this.tabs.indexOf(this.currentTab); // check if it's 0 and create a new_index variable depending on the result.

      if (index === 0) {
        var new_index = this.tabs.length - 1;
      } else {
        var new_index = index - 1;
      } // select this new tab.


      this.tabs[new_index].select();
    }
  }, {
    key: "nextTab",
    value: function nextTab() {
      // get the index of the current tab.
      var index = this.tabs.indexOf(this.currentTab); // check if it's the last element and create a new_index variable depending on the result.

      if (index === this.tabs.length - 1) {
        var new_index = 0;
      } else {
        var new_index = index + 1;
      } // select this new tab.


      this.tabs[new_index].select();
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    },
    set: function set(value) {
      this._id = value;

      if (this.tabs.length != 0) {
        for (var i = 0; i < this.tabs.length; i++) {
          this.tabs[i].tabview_id = value;
        }
      }
    }
  }, {
    key: "tablist",
    get: function get() {
      var tablist = document.createElement("ul");
      tablist.setAttribute("role", "tablist");
      tablist.setAttribute("id", this.tablist_id);
      tablist.setAttribute("class", this.tablist_class);

      for (var i = 0; i < this.tabs.length; i++) {
        var child = this.tabs[i].tab_element;

        if (child.getAttribute("data-tabid") == this.default_tab) {
          child.setAttribute("aria-selected", "true");
        } else {
          child.setAttribute("aria-selected", "false");
        }

        if (this.expand_tabs) {
          child.style.width = "calc(98% / " + this.tabs.length + ")";
        }

        tablist.appendChild(child);
      }

      return tablist;
    }
  }, {
    key: "tabview",
    get: function get() {
      var tabview = document.createElement("section");
      tabview.setAttribute("id", this.id);
      tabview.appendChild(this.tablist);
      var tabpanel_container = document.createElement("div");

      for (var i = 0; i < this.tabs.length; i++) {
        var panel = this.tabs[i].panel_element;

        if (panel.getAttribute("data-tabid") == this.default_tab) {
          panel.setAttribute("aria-hidden", "false");
        } else {
          panel.setAttribute("aria-hidden", "true");
        }

        tabpanel_container.appendChild(panel);
      }

      tabview.appendChild(tabpanel_container);
      return tabview;
    }
  }, {
    key: "currentTab",
    get: function get() {
      for (var i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].selected === true) {
          return this.tabs[i];
        }
      }

      return undefined;
    }
  }]);

  return TabView;
}();
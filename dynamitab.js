// this is the dynamitab.js class file..

// this is a class definition for a Tab. Tabs can be added to TabView objects.
class Tab {
  constructor(tabview, id, title, description=undefined) {
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
  
  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value;
    this.tab_id = this.tabview_id + "-tab" + value;
    this.panel_id = this.tabview_id + "-panel" + value;
  }
  
  get tabview_id() {
    return this._tabview_id;
  }
  set tabview_id(value) {
    this._tabview_id = value;
    this.tab_id = value + "-tab" + this.id;
    this.tab_class = value + "-tab";
    this.panel_id = value + "-panel" + this.id;
    this.panel_class = value + "-panel";
  } 
  
  get tab_element() {
    var tabobj = document.createElement("li");
    tabobj.setAttribute("role", "tab");
    tabobj.setAttribute("id", this.tab_id);
    tabobj.setAttribute("class", this.tab_class);
    tabobj.setAttribute("data-tabid", this.id);
    tabobj.setAttribute("tabindex", "0");
    tabobj.setAttribute("aria-controls", this.panel_id);
    if(this.description != undefined) {
      tabobj.setAttribute("title", this.description);
    }
    tabobj.textContent = this.title;
    return tabobj;
  }
  
  get panel_element() {
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
  
  select() {
    var tab = document.querySelector("#" + this.tab_id);
    if(tab && tab.getAttribute("aria-selected") != "true") {
      // get all tabs.
      var tabs = tab.parentElement.children;
      // deselect them all.
      for(var j = 0; j < tabs.length; j++) {
        tabs[j].setAttribute("aria-selected", "false");
      }
      // select the one that's clicked.
      tab.setAttribute("aria-selected", "true");
      
      // get the current tab panel.
      var panelid =tab.getAttribute("aria-controls"); 
      var current_panel = document.querySelector("#" + panelid);
      // from this, get all the panels.
      var panels = current_panel.parentElement.children;
      // hide all panels.
      for(var j = 0; j < panels.length; j++) {
        panels[j].setAttribute("aria-hidden", "true");
      }
      // show the correct panel.
      current_panel.setAttribute("aria-hidden", "false");

      // finally, focus the newly selected tab.
      tab.focus();

    }
  }

}

// this is the class definition for TabView objects (the main object used when constructing a TabView).
class TabView {
  constructor(id, class_prefix=undefined, default_tab=1, expand_tabs=true, panel_heading_level=2, panel_heading_class=undefined) {
    this._id = id;
    if(class_prefix === undefined) {
      this.class_prefix = id;
    } else {
      this.class_prefix = class_prefix;
    }
    this.panel_heading_level = panel_heading_level;
    if(panel_heading_class === undefined) {
      this.panel_heading_class = this.class_prefix + "-panelheading";
    } else {
      this.panel_heading_class = panel_heading_class;
    }
    this.tabs = Array();
    this.expand_tabs = expand_tabs;
    this.default_tab = default_tab;
    
    this.tablist_id = id + "-tablist";
    this.tablist_class = this.class_prefix + "-tablist";
  }
  
  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value;
    if(this.tabs.length != 0) {
      for(var i = 0; i < this.tabs.length; i++) {
        this.tabs[i].tabview_id = value;
      }
    }
  }
   
  get tablist() {
    var tablist = document.createElement("ul");
    tablist.setAttribute("role", "tablist");
   tablist.setAttribute("id", this.tablist_id);
    tablist.setAttribute("class", this.tablist_class);
    for(var i = 0; i < this.tabs.length; i++) {
      var child = this.tabs[i].tab_element;
      if(child.getAttribute("data-tabid") == this.default_tab) {
        child.setAttribute("aria-selected", "true");
      } else {
        child.setAttribute("aria-selected", "false");
      }
      if(this.expand_tabs) {
        child.style.width = "calc(98% / " + this.tabs.length + ")";
      }
      tablist.appendChild(child);
    }
    return tablist
  }
  
  get tabview() {
    var tabview = document.createElement("section");
    tabview.setAttribute("id", this.id);
    tabview.appendChild(this.tablist);
    var tabpanel_container = document.createElement("div");
    for(var i = 0; i < this.tabs.length; i++) {
      var panel =this.tabs[i].panel_element;
      if(panel.getAttribute("data-tabid") == this.default_tab) {
        panel.setAttribute("aria-hidden", "false");
      } else {
        panel.setAttribute("aria-hidden", "true");
      }
      tabpanel_container.appendChild(panel);
    }
    tabview.appendChild(tabpanel_container);
    return tabview;
  }
  
  getTabById(id) {
    for(var i = 0; i < this.tabs.length; i++) {
      if(this.tabs[i].id == id) {
        return this.tabs[i];
      }
    }
    return undefined;
  }
  
  registerEvents() {
    var tab_elements = document.querySelector("#" + this.tablist_id)
    tab_elements = tab_elements.children;
    var self = this;
    for(var i = 0; i < tab_elements.length; i++) {
      tab_elements[i].addEventListener("click", function() {
        var id = this.getAttribute("data-tabid");
        if(id) {
          var tab = self.getTabById(id);
          tab.select();
        }
      });
    }
  }
}

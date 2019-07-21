// this is the dynamitab.js class file..

// this is a class definition for a Tab. Tabs can be added to TabView objects.
class Tab {
  constructor(tabview, id, title, description = undefined, content = undefined) {
    this._id = id;
    this.title = title;
    this.description = description;
    this.content = content;

    this.class_prefix = tabview.class_prefix;
    this.all_in_tabbing_order = tabview.all_in_tabbing_order;
    this.use_bootstrap = tabview.use_bootstrap;
    this.bootstrap_fade = tabview.bootstrap_fade;
    this._tabview_id = tabview.id;
    this.panel_heading_level = tabview.panel_heading_level;
    this.panel_heading_class = tabview.panel_heading_class;
    this.tab_id = tabview.id + '-tab' + id;
    this.tab_class = tabview.class_prefix + '-tab';
    this.panel_id = tabview.id + '-panel' + id;
    this.panel_class = tabview.class_prefix + '-panel';
  }

  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value;
    this.tab_id = this.tabview_id + '-tab' + value;
    this.panel_id = this.tabview_id + '-panel' + value;
  }

  get tabview_id() {
    return this._tabview_id;
  }
  set tabview_id(value) {
    this._tabview_id = value;
    this.tab_id = value + '-tab' + this.id;
    this.tab_class = value + '-tab';
    this.panel_id = value + '-panel' + this.id;
    this.panel_class = value + '-panel';
  }

  get_tab_element(selected = false) {
    var tabobj = document.createElement('li');
    tabobj.setAttribute('role', 'tab');
    tabobj.setAttribute('id', this.tab_id);
    tabobj.classList.add(this.tab_class);
    // Add the bootstrap classes if requested.
    if (this.use_bootstrap) {
      tabobj.classList.add('nav-item', 'nav-link');
    }
    tabobj.setAttribute('data-tabid', this.id);
    if (this.all_in_tabbing_order || selected) {
      tabobj.setAttribute('tabindex', '0');
    } else {
      tabobj.setAttribute('tabindex', '-1');
    }
    tabobj.setAttribute('aria-selected', selected.toString());
    // Add the bootstrap active class if the tab is selected.
    if (this.use_bootstrap && selected) {
      tabobj.classList.add('active');
    }
    tabobj.setAttribute('aria-controls', this.panel_id);
    if (this.description != undefined) {
      tabobj.setAttribute('title', this.description);
    }
    tabobj.textContent = this.title;
    return tabobj;
  }

  get_panel_element(visible = false) {
    var panelobj = document.createElement('section');
    panelobj.setAttribute('id', this.panel_id);
    panelobj.classList.add(this.panel_class);
    if (this.use_bootstrap && this.bootstrap_fade) {
      panelobj.classList.add('fade');
    }
    panelobj.setAttribute('aria-labelledby', this.tab_id);
    panelobj.setAttribute('aria-hidden', !visible);
    if (!visible) {
      panelobj.style.display = 'none';
    } else {
      panelobj.style.display = 'block';
    }
    panelobj.setAttribute('role', 'tabpanel');
    panelobj.setAttribute('data-tabid', this.id);
if(this.panel_heading_level !== 0) {
    var panelheading = document.createElement('h' + this.panel_heading_level);
    panelheading.classList.add(this.panel_heading_class);
    panelheading.textContent = this.title;
    panelobj.appendChild(panelheading);
}

    // If content was provided at the tab's instanciation:
    if (this.content != undefined && this.content instanceof HTMLElement) {
      panelobj.appendChild(this.content);
    } else if (this.content != undefined && this.content instanceof Array) {
      for (i = 0; i < this.content.length; i++) {
        panelobj.appendChild(this.content[i]);
      }
    }

    return panelobj;
  }

  select() {
    var tab = document.querySelector('#' + this.tab_id);
    if (tab && tab.getAttribute('aria-selected') != 'true') {
      // get all tabs.
      var tabs = document.querySelectorAll('.' + this.tab_class);;
      // deselect them all.
      for (var i = 0; i < tabs.length; i++) {
        tabs[i].setAttribute('aria-selected', 'false');
        // Also get rid of the tabindex if only the focused tab should have it.
        if (!this.all_in_tabbing_order) {
          tabs[i].setAttribute('tabindex', '-1');
        }
        // Remove the bootstrap active class if requested.
        if (this.use_bootstrap) {
          tabs[i].classList.remove('active');
        }
      }
      // select the one that's clicked.
      tab.setAttribute('aria-selected', 'true');
      if (!this.all_in_tabbing_order) {
        tab.setAttribute('tabindex', '0');
      }
      if (this.use_bootstrap) {
        tab.classList.add('active');
      }

      // get the current tab panel.
      var current_panel = document.querySelector('#' + this.panel_id);
      var panels = document.querySelectorAll('.' + this.panel_class);;
      // hide all panels.
      for (var j = 0; j < panels.length; j++) {
        panels[j].setAttribute('aria-hidden', 'true');
        panels[j].style.display = 'none';
      }
      // show the correct panel.
      current_panel.setAttribute('aria-hidden', 'false');
      current_panel.style.display = 'block';

      // finally, focus the newly selected tab.
      tab.focus();
    }
  }

  get selected() {
    var tab = document.querySelector('#' + this.tab_id);
    if (tab && tab.getAttribute('aria-selected') == 'true') {
      return true;
    } else {
      return false;
    }
  }
}

// this is the class definition for TabView objects (the main object used when constructing a TabView).
class TabView {
  constructor(id, argument_options = {}) {
    this._id = id;

    // These are the default options:
    var default_options = {
      class_prefix: undefined,
      default_tab: 0,
      expand_tabs: true,
      all_in_tabbing_order: true,
      panel_heading_level: 0,
      panel_heading_class: undefined,
      use_bootstrap: false,
      bootstrap_fade: true
    };
    // Merge the defaults with the provided options
    var options = {
      ...default_options, ...argument_options
    };

    if (options.class_prefix === undefined) {
      this.class_prefix = id;
    } else {
      this.class_prefix = options.class_prefix;
    }
    this.panel_heading_level = options.panel_heading_level;
    if (options.panel_heading_class === undefined) {
      this.panel_heading_class = this.class_prefix + '-panelheading';
    } else {
      this.panel_heading_class = options.panel_heading_class;
    }
    this.tabs = Array();
    this.expand_tabs = options.expand_tabs;
    this.all_in_tabbing_order = options.all_in_tabbing_order;
    this.default_tab = options.default_tab;
    this.use_bootstrap = options.use_bootstrap;

    this.tablist_id = id + '-tablist';
    this.tablist_class = this.class_prefix + '-tablist';
  }

  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value;
    if (this.tabs.length != 0) {
      for (var i = 0; i < this.tabs.length; i++) {
        this.tabs[i].tabview_id = value;
      }
    }
  }

  get tablist() {
    var tablist = document.createElement('ul');
    tablist.setAttribute('role', 'tablist');
    tablist.setAttribute('id', this.tablist_id);
    tablist.classList.add(this.tablist_class);
    // Add the bootstrap classes if requested.
    if (this.use_bootstrap) {
      tablist.classList.add('nav', 'nav-tabs');
      // If expand_tabs is also set, use the nav-justified class as well.
      if (this.expand_tabs) {
        tablist.classList.add('nav-justified');
      }
    }
    for (var i = 0; i < this.tabs.length; i++) {
      var child = this.tabs[i].get_tab_element(this.tabs[i].id == this.default_tab);
      if (this.tabs[i].id == this.default_tab) {
        this.tabs[i].select();
      }
      if (this.expand_tabs && !this.use_bootstrap) {
        child.style.width = 'calc(98% / ' + this.tabs.length + ')';
      }
      tablist.appendChild(child);
    }
    return tablist
  }

  get tabview() {
    var tabview = document.createElement('section');
    tabview.setAttribute('id', this.id);
    tabview.appendChild(this.tablist);
    var tabpanel_container = document.createElement('div');
    for (var i = 0; i < this.tabs.length; i++) {
      var panel = this.tabs[i].get_panel_element(this.tabs[i].id == this.default_tab);
      tabpanel_container.appendChild(panel);
    }
    tabview.appendChild(tabpanel_container);
    return tabview;
  }

  getTabById(id) {
    for (var i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].id == id) {
        return this.tabs[i];
      }
    }
    return undefined;
  }

  registerEvents() {
    var tab_elements = document.querySelector('#' + this.tablist_id)
    tab_elements = tab_elements.children;
    var self = this;
    for (var i = 0; i < tab_elements.length; i++) {
      tab_elements[i].addEventListener('click', function () {
        var id = this.getAttribute('data-tabid');
        if (id) {
          var tab = self.getTabById(id);
          tab.select();
        }
      });
      tab_elements[i].addEventListener('keydown', function (event) {
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


  previousTab() {
    // get the index of the current tab.
    var index = this.tabs.indexOf(this.currentTab);
    // check if it's 0 and create a new_index variable depending on the result.
    if (index === 0) {
      var new_index = this.tabs.length - 1;
    } else {
      var new_index = index - 1;
    }
    // select this new tab.
    this.tabs[new_index].select();

  }

  nextTab() {
    // get the index of the current tab.
    var index = this.tabs.indexOf(this.currentTab);
    // check if it's the last element and create a new_index variable depending on the result.
    if (index === this.tabs.length - 1) {
      var new_index = 0;
    } else {
      var new_index = index + 1;
    }
    // select this new tab.
    this.tabs[new_index].select();

  }

  get currentTab() {
    for (var i = 0; i < this.tabs.length; i++) {
      if (this.tabs[i].selected === true) {
        return this.tabs[i];
      }
    }
    return undefined;
  }
}

function Menu() {
  this._home = null;
  this._complete = null;
}

Menu.prototype.init = function() {
  if (this._home && this._complete) return false;
  
  if (!this._home) {
    this._home = document.getElementById('menu_home');
    if (this._home) {
      this._home.addEventListener('touchstart', this._homeHandle.bind(this));
    }
  }
  
  if (!this._complete) {
    this._complete = document.getElementById('menu_complete');
    if (this._complete) {
      this._complete.addEventListener('touchstart',
                                      this._completeHandle.bind(this));
    }
  }
  
  return (this._home !== null && this._complete !== null);
}

Menu.prototype.showHome = function() {
  utils.showElement(this._home);
}

Menu.prototype.hideHome = function() {
  utils.hideElement(this._home);
}

Menu.prototype.showComplete = function() {
  utils.showElement(this._complete);
}

Menu.prototype.hideComplete = function() {
  utils.hideElement(this._complete);
}

Menu.prototype._homeHandle = function() {
  dashboard.show();
};

Menu.prototype._completeHandle = function() {
  dashboard.completeCurrent();
};

var menu = new Menu();
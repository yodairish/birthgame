function Menu() {
  this._home = null;
  this._complete = null;
  this._completeAnswer = null;
  this._completeButton = null;
  this._completeCollapse = null;
}

Menu.prototype.init = function() {
  if (this._home && this._complete) return false;
  
  if (!this._home) {
    this._home = document.getElementById('menu_home');
    if (this._home) {
      this._home.addEventListener('touchstart',
                                    dashboard._homeHandle.bind(dashboard));
    }
  }
  
  if (!this._complete) {
    this._complete = document.getElementById('menu_complete');
    if (this._complete) {
      this._completeAnswer = document.getElementById('answer');
      this._completeButton = document.getElementById('checkAnswer');
      this._completeCollapse = document.getElementById('completeCollapse');
      
      if (this._completeAnswer && this._completeButton && this._completeCollapse) {
        this._completeCollapse.addEventListener('touchstart',
                                    dashboard._completeHandle.bind(dashboard));
                                      
        this._completeButton.addEventListener('touchstart',
                                      this._checkAnswer.bind(this));
      }
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
  if (this._complete) {
    utils.showElement(this._complete);
    this._complete.classList.add('collapse');
  }
}

Menu.prototype.hideComplete = function() {
  utils.hideElement(this._complete);
}

Menu.prototype._homeHandle = function() {
  dashboard.show();
};

Menu.prototype._completeHandle = function() {
  if (!this._complete) return false;
  
  this._complete.classList.toggle('collapse');
};

Menu.prototype._checkAnswer = function() {
  if (!this._completeAnswer) return false;
  
  dashboard.completeCurrent(this._completeAnswer.value);
};

var menu = new Menu();
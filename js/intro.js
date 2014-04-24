function Intro() {
  this._container = null;
  this._closeButton = null;
}

Intro.prototype.init = function(){
  if (this._container) return false;
  
  this._container = document.getElementById('intro');
  if (!this._container) return false;
  
  this._closeButton = document.getElementById('introClose');
  if (!this._closeButton) return false;
  
  this._closeButton.addEventListener('touchstart', this.close.bind(this));
  return true;
};

Intro.prototype.show = function(){
  utils.showElement(this._container);
};

Intro.prototype.close = function(){
  utils.hideElement(this._container);
  dashboard.show();
};

var intro = new Intro();
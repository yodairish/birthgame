function Intro() {
  this._introBlock = null;
  this._closeButton = null;
}

Intro.prototype.init = function(){
  if (this._container) return false;
  
  this._introBlock = document.getElementById('intro');
  if (!this._introBlock) return false;
  
  var container = document.getElementById('introContainer');
  if (!container) return false;
  
  this._closeButton = document.getElementById('introClose');
  if (!this._closeButton) return false;
  
  this._closeButton.addEventListener('touchstart', this.close.bind(this));
  return true;
};

Intro.prototype.show = function(){
  utils.showElement(this._introBlock);
};

Intro.prototype.close = function(){
  utils.hideElement(this._introBlock);
  dashboard.show();
};

var intro = new Intro();
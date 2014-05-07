function Finish() {
  this._finishBlock = null;
}

Finish.prototype.init = function(){
  if (this._finishBlock) return false;
  
  this._finishBlock = document.getElementById('finish');
  if (!this._finishBlock) return false;
  
  return true;
};

Finish.prototype.show = function(){
  utils.showElement(this._finishBlock);
};

Finish.prototype.close = function(){
  utils.hideElement(this._finishBlock);
};

var finish = new Finish();
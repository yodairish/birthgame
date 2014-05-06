function Loader() {
  this._data = null;
}

Loader.prototype.save = function(name, obj) {
  console.log(name, obj);
  if (!this._getData()) this._data = {};
  
  this._data[name] = obj;
  localStorage.setItem('quest', JSON.stringify(this._data));
};

Loader.prototype.load = function(name) {
  if (!this._getData() || this._data[name] === undefined) return false;
  
  console.log('loadResult: ', this._data[name]);
  return this._data[name];
};

Loader.prototype._getData = function() {
  if (this._data !== null) return true;
  
  var data = localStorage.getItem('quest');
  if (data === null) return false;
  
  try {
    this._data = JSON.parse(data);
    return true;
  } catch(err) {
    return false;
  }
};

var loader = new Loader();
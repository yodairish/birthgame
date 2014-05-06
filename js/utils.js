function Utils() {
}

Utils.prototype.showElement = function(element) {
  if (element.tagName === undefined) return false;
  
  element.style.display = 'block';
};

Utils.prototype.hideElement = function(element) {
  if (element.tagName === undefined) return false;
  
  element.style.display = 'none';
};

Utils.prototype.toUnicode = function(string) {
  var unicodeString = '';
  for (var i=0; i < string.length; i++) {
    var theUnicode = string.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode;
    }
    theUnicode = '\\u' + theUnicode;
    unicodeString += theUnicode;
  }
  return unicodeString;
}

Utils.prototype.getRandom = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Utils.prototype.toRad = function(deg) {
  return deg * Math.PI / 180;
};

var utils = new Utils();
function FindRoute() {
  this._answer = '\u0068\u0065\u006C\u006C\u006F'; //hello
  this._name = 'findroute';
  this._quizText = 'Here info text';
  
  this._currentTip = -1;
  this.tips = [
    '',
    '',
    ''
  ];
  
  this._placeCoord = {lat: -34.397, lng: 150.644};
  this._mapOptions = {
    center: this._placeCoord,
    zoom: 8
  };
}

FindRoute.prototype = new Quiz();

FindRoute.prototype._createHtmlContent = function() {
  var frag = document.createDocumentFragment(),
      map = document.createElement('div'),
      checkLocation = document.createElement('div');
  
  checkLocation.id = 'findRouteLoc';
  checkLocation.addEventListener('touchstart', this._checkLocation.bind(this));
      
  map.id = 'findRouteMap';
  // map.addEventListener('DOMNodeInserted', function(map){
  //   return function() {
  //     this._initMap(map);
  //   }.bind(this);
  // }.call(this, map));
  // var a = document.getElementById('quizzesContainer');
  // var observer = new MutationObserver(function(map) {
  //   return function (mutations) {
  //     console.log(mutations);
  //     this._initMap(map);
  //   }.bind(this);
  // }.call(this, map));
  // observer.observe(a, {characterData: true, childList: true});
  
  frag.appendChild(checkLocation);
  frag.appendChild(map);
  
  return frag;
};

FindRoute.prototype._initMap = function(mapCanvas) {
  if (mapCanvas.tagName === undefined) return false;
  
  var map = new google.maps.Map(mapCanvas, this._mapOptions);
  
  var marker = new google.maps.Marker({
    position: this._placeCoord,
    map: map,
    title:"Точка отсчета"
});
};

FindRoute.prototype._getUserDirection = function() {
  var direction;
  return direction;
};

FindRoute.prototype._getDistanceBetween = function() {
  var distance;
  return distance;
};

FindRoute.prototype._checkLocation = function() {
  if (this._currentTip >= 0) return false;
};

FindRoute.prototype._showNextTip = function() {
  
};

dashboard.addQuiz(new FindRoute());
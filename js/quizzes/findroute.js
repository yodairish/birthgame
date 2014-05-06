function FindRoute() {
  this._answer = '\u0068\u0065\u006C\u006C\u006F'; //hello
  this._name = 'findroute';
  this._quizText = 'Here info text';
  this._tipText = 'Here info text';
  
  this._messageBoardText = null;
  this._info = null;
  this._tip = null;
  this._mapCanvas = null;
  this._map = null;
  this._currentTip = -1;
  this._timerTick = 0;
  this._timer = 0;
  
  this._placeCoord = {lat: 60.008431, lng: 30.38636};
  this._mapOptions = {
    center: this._placeCoord,
    zoom: 14,
    disableDefaultUI: true,
    zoomControl: true
  };
}

FindRoute.prototype = new Quiz();

FindRoute.prototype._createHtmlContent = function() {
  var frag = document.createDocumentFragment(),
      checkLocation = document.createElement('div');
  
  checkLocation.id = 'findRouteLoc';
  checkLocation.addEventListener('touchstart', this._checkLocation.bind(this));
      
  this._mapCanvas = document.createElement('div');
  this._mapCanvas.id = 'findRouteMap';
  
  this._createInfo();
  
  frag.appendChild(this._createMessageboard());
  frag.appendChild(checkLocation);
  frag.appendChild(this._mapCanvas);
  frag.appendChild(this._info);
  
  return frag;
};

FindRoute.prototype._createMessageboard = function() {
  var messageBoard = document.createElement('div');
  messageBoard.className = 'messageBoard';
  messageBoard.addEventListener('touchstart', this._hideInfo.bind(this));
  
  this._messageBoardText = document.createElement('p');
  this._messageBoardText.id = 'findrouteMessage';
  messageBoard.appendChild(this._messageBoardText);
  
  return messageBoard;
};

FindRoute.prototype._createInfo = function() {
  var infoMessage = document.createElement('p');
      
  this._tip = document.createElement('p');
  this._tip.id = 'findrouteTip';
  this._tip.className = 'hidden';
  this._tip.textContent = this._tipText;
  
  infoMessage.textContent = this.getQuizText();
  
  this._info = document.createElement('div');
  this._info.className = 'infoBoard enable';
  this._info.addEventListener('touchstart', this._showInfo.bind(this));
  
  this._info.appendChild(this._tip);
  this._info.appendChild(infoMessage);
};

FindRoute.prototype._changeMessage = function(opt_newMessage) {
  if (!this._messageBoardText) return false;
  
  opt_newMessage = opt_newMessage || '';
  this._messageBoardText.textContent = opt_newMessage;
};

FindRoute.prototype._hideInfo = function() {
  if (!this._info) return false;
  
  this._changeMessage();
  this._info.classList.remove('enable');
};

FindRoute.prototype._showInfo = function() {
  if (!this._info) return false;
  
  this._changeMessage('Скрыть');
  this._info.classList.add('enable');
};

FindRoute.prototype._showTip = function() {
  if (!this._tip) return false;
  
  this._tip.classList.remove('hidden');
  this._info.scrollTop = 0;
};

FindRoute.prototype._initMap = function() {
  if (this._map !== null || this._mapCanvas === null) return false;
  
  console.log('init findroute');
  
  this._map = new google.maps.Map(this._mapCanvas, this._mapOptions);
  
  var marker = new google.maps.Marker({
    position: this._placeCoord,
    map: this._map,
    title:"Точка отсчета"
  });
};

FindRoute.prototype._userLocation = function(loc) {
  this._stopTimer();
  var distance = this._getDistanceBetween({
                                            lat: loc.coords.latitude,
                                            lng: loc.coords.longitude
                                          });
                                          
  this._changeMessage(parseInt(distance));
  if (distance > 500) {
    this._changeMessage('Вы далеко');
  } else if (distance > 300) {
    this._changeMessage('Вы рядом');
  } else if (distance > 100) {
    this._changeMessage('Вы близко');
  } else if (distance > 30) {
    this._changeMessage('Вы почти на месте');
  } else {
    this._showTip();
    this._showInfo();
    this._changeMessage('Вы на месте');
  }
};

FindRoute.prototype._onErrorLocation = function() {
  this._stopTimer();
  this._changeMessage('Не удалось определить место');
};

FindRoute.prototype._getDistanceBetween = function(point) {
  var radiusEarth = 6378137,
      dLat = utils.toRad(this._placeCoord.lat - point.lat),
      dLong = utils.toRad(this._placeCoord.lng - point.lng),
      a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
          (Math.cos(utils.toRad(point.lat)) *
           Math.cos(utils.toRad(this._placeCoord.lat)) *
           Math.sin(dLong / 2) * Math.sin(dLong / 2)),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
  return (radiusEarth * c);
};

FindRoute.prototype._timerTickProccess = function() {
  if (this._timerTick > 0) {
    this._changeMessage(this._timerTick + '..');
    this._timerTick--;
  } else this._stopTimer();
};

FindRoute.prototype._stopTimer = function() {
  if (this._timer > 0) {
    clearTimeout(this._timer);
    this._timer = 0;
  }
};

FindRoute.prototype._checkLocation = function() {
  this._stopTimer();
  this._timerTick = 10;
  this._timerTickProccess();
  this._timer = setInterval(this._timerTickProccess.bind(this), 1000);
  navigator.geolocation.getCurrentPosition(this._userLocation.bind(this),
                                           this._onErrorLocation.bind(this),
                                           {
                                             enableHighAccuracy: true,
                                             timeout: 10000,
                                             maximumAge: 0
                                           })
};

FindRoute.prototype._open = function() {
  if (this.status === true) return false;

  dashboard.showQuizze(this.getName());
  menu.showHome();
  menu.showComplete();
  
  this._initMap();
};

dashboard.addQuiz(new FindRoute());
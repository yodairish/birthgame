function Parts() {
  this._answer = '\u0068\u0065\u006C\u006C\u006F'; //hello
  this._name = 'parts';
  this._quizText = 'Еще одно слово лежит в этом сундуке, который закрыт на 4 печати. Чтобы их открыть, надо раздобыть коды для каждой из них. Они спрятанны где-то в королевстве. У нас есть волшебный компас, который укажет где они спрятаны. Следуй за ним и когда соберешь их все, мы сможем открыть сундук.';
  
  this._info = null;
  this._messageBoardText = null;
  this._mapCanvas = null;
  this._map = null;
  this._marker = null;
  
  this._timerTick = 10;
  this._timer = 0;
  
  this._curLoc = 0;
  this._places = [
    {
      tip: null,
      tipText: 'some tip1',
      after: null,
      afterMessage: 'some message',
      word: 'word1',
      coords: {lat: 59.9500, lng: 30.3000}
    },
    {
      tip: null,
      tipText: 'some tip2',
      after: null,
      afterMessage: 'some message2',
      word: 'word2',
      coords: {lat: 59.9550, lng: 30.3000}
    },
    {
      tip: null,
      tipText: 'some tip3',
      after: null,
      afterMessage: 'some message3',
      word: 'word3',
      coords: {lat: 59.9550, lng: 30.3050}
    },
    {
      tip: null,
      tipText: 'some tip4',
      after: null,
      afterMessage: 'some message4',
      word: 'word4',
      coords: {lat: 59.9500, lng: 30.3050}
    }
  ];
  
  this._mapOptions = {
    center: this._places[0].coords,
    zoom: 14,
    disableDefaultUI: true,
    zoomControl: true
  };
}

Parts.prototype = new Quiz();

Parts.prototype._createHtmlContent = function() {
  var frag = document.createDocumentFragment(),
      checkLocation = document.createElement('div');
  
  checkLocation.id = 'partsLoc';
  checkLocation.addEventListener('touchstart', this._checkLocation.bind(this));
      
  this._mapCanvas = document.createElement('div');
  this._mapCanvas.id = 'partsMap';
  
  this._createInfo();
  
  frag.appendChild(this._createMessageboard());
  frag.appendChild(checkLocation);
  frag.appendChild(this._mapCanvas);
  frag.appendChild(this._info);

  return frag;
};

Parts.prototype._createMessageboard = function() {
  var messageBoard = document.createElement('div');
  messageBoard.className = 'messageBoard';
  messageBoard.addEventListener('touchstart', this._hideInfo.bind(this));
  
  this._messageBoardText = document.createElement('p');
  this._messageBoardText.id = 'partsMessage';
  messageBoard.appendChild(this._messageBoardText);
  
  return messageBoard;
};

Parts.prototype._createInfo = function() {
  var infoMessage = document.createElement('p');
  infoMessage.textContent = this.getQuizText();
  
  this._info = document.createElement('div');
  this._info.className = 'infoBoard enable';
  this._info.addEventListener('touchstart', this._showInfo.bind(this));
  
  for (var i = 0, end = this._places.length; i < end; i++) {
    this._places[i].tip = document.createElement('p');
    this._places[i].tip.className = 'partsTip hidden';
    this._places[i].tip.textContent = this._places[i].tipText;
    this._info.appendChild(this._places[i].tip);
    
    this._places[i].after = document.createElement('p');
    this._places[i].after.className = 'partsAfter hidden';
    this._places[i].after.textContent = this._places[i].afterMessage;
    this._info.appendChild(this._places[i].after);
  }
  
  this._info.appendChild(infoMessage);
};

Parts.prototype._showTip = function(hideAll) {
  for (var i = 0, end = this._places.length, state; i < end; i++) {
    state = (hideAll !== true && this._curLoc === i ? 'remove' : 'add');
    this._places[i].tip.classList[state]('hidden');
  }
};

Parts.prototype._showAfterMessage = function(hideAll, loc) {
  loc = loc || this._curLoc;
  for (var i = 0, end = this._places.length, state; i < end; i++) {
    state = (hideAll !== true && loc === i ? 'remove' : 'add');
    this._places[i].after.classList[state]('hidden');
  }
};

Parts.prototype._initMap = function() {
  if (this._map !== null || this._mapCanvas === null) return false;
  
  console.log('init parts');
  
  this._map = new google.maps.Map(this._mapCanvas, this._mapOptions);
  
  this._marker = new google.maps.Marker({
    position: this._places[this._curLoc].coords,
    map: (this._curLoc === this._places.length - 1 ? null : this._map)
  });
};

Parts.prototype._changeMessage = function(opt_newMessage) {
  if (!this._messageBoardText) return false;
  
  opt_newMessage = opt_newMessage || '';
  this._messageBoardText.textContent = opt_newMessage;
};

Parts.prototype._hideInfo = function() {
  if (!this._info) return false;
  
  this._changeMessage();
  this._info.classList.remove('enable');
};

Parts.prototype._showInfo = function() {
  if (!this._info) return false;
  
  this._changeMessage('Скрыть');
  this._info.classList.add('enable');
};

Parts.prototype._movePoint = function() {
  if (this._curLoc === this._places.length - 1) this._marker.setMap(null);
  else this._marker.setPosition(this._places[this._curLoc].coords);
  
};

Parts.prototype._userLocation = function(loc) {
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
    this._showAfterMessage(true);
    this._showTip();
    this._showInfo();
    this._changeMessage('Вы на месте');
  }
};

Parts.prototype._onErrorLocation = function() {
  this._stopTimer();
  this._changeMessage('Не удалось определить место');
};

Parts.prototype._getDistanceBetween = function(point) {
  var radiusEarth = 6378137,
      coords = this._places[this._curLoc].coords,
      dLat = utils.toRad(coords.lat - point.lat),
      dLong = utils.toRad(coords.lng - point.lng),
      a = (Math.sin(dLat / 2) * Math.sin(dLat / 2)) +
          (Math.cos(utils.toRad(point.lat)) *
           Math.cos(utils.toRad(coords.lat)) *
           Math.sin(dLong / 2) * Math.sin(dLong / 2)),
      c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      
  return (radiusEarth * c);
};

Parts.prototype._timerTickProccess = function() {
  if (this._timerTick > 0) {
    this._changeMessage(this._timerTick + '..');
    this._timerTick--;
  } else this._stopTimer();
};

Parts.prototype._stopTimer = function() {
  if (this._timer > 0) {
    clearTimeout(this._timer);
    this._timer = 0;
  }
};

Parts.prototype._checkLocation = function() {
  if (this._timer > 0) return false;
  
  this._stopTimer();
  this._hideInfo();
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

Parts.prototype.checkAnswer = function(answer) {
  if (answer === this._places[this._curLoc].word) {
    this._showAfterMessage();
    this._curLoc++;
    this._showTip(true);
    this._showInfo();
    
    if (this._curLoc === this._places.length) {
      setTimeout(this._done.bind(this), 5000);
    } else {
      this._save();
      this._movePoint();
    }
  } else return false;
};

Parts.prototype._save = function() {
  loader.save(this.getName(), {
    status: this.status,
    curLoc: this._curLoc
  });
};

Parts.prototype.load = function() {
  var data = loader.load(this.getName());
  if (data) {
    if (data.status === true) this._done();
    else if (data.curLoc > 0) {
      this._curLoc = data.curLoc;
      this._showAfterMessage(false, this._curLoc - 1);
    }
  }
};

Parts.prototype._open = function() {
  if (this.status === true) return false;

  dashboard.showQuizze(this.getName());
  menu.showHome();
  menu.showComplete();
  
  this._initMap();
};

dashboard.addQuiz(new Parts());
function Parts() {
  this._answer = '\u0068\u0065\u006C\u006C\u006F'; //hello
  this._name = 'parts';
  this._quizText = 'Here info text';
  
  this._messageBoardText = null;
  this._mapCanvas = null;
  this._map = null;
  this._marker = null;
  
  this._curLoc = 0;
  this._places = [
    {
      tip: 'some tip1',
      word: 'word1',
      coords: {lat: 59.9500, lng: 30.3000}
    },
    {
      tip: 'some tip2',
      word: 'word2',
      coords: {lat: 59.9550, lng: 30.3000}
    },
    {
      tip: 'some tip3',
      word: 'word3',
      coords: {lat: 59.9550, lng: 30.3050}
    },
    {
      tip: 'some tip4',
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
  // checkLocation.addEventListener('touchstart', this._checkLocation.bind(this));
      
  this._mapCanvas = document.createElement('div');
  this._mapCanvas.id = 'partsMap';
  
  frag.appendChild(this._createMessageboard());
  frag.appendChild(checkLocation);
  frag.appendChild(this._mapCanvas);

  return frag;
};

Parts.prototype._createMessageboard = function() {
  var messageBoard = document.createElement('div');
  messageBoard.className = 'messageBoard';
  // messageBoard.addEventListener('touchstart', this._hideInfo.bind(this));
  
  this._messageBoardText = document.createElement('p');
  this._messageBoardText.id = 'partsMessage';
  messageBoard.appendChild(this._messageBoardText);
  
  return messageBoard;
};

Parts.prototype._initMap = function() {
  if (this._map !== null || this._mapCanvas === null) return false;
  
  console.log('init parts');
  
  this._map = new google.maps.Map(this._mapCanvas, this._mapOptions);
  
  this._marker = new google.maps.Marker({
    position: this._places[0].coords,
    map: this._map
  });
};

Parts.prototype._changeMessage = function(opt_newMessage) {
  if (!this._messageBoardText) return false;
  
  opt_newMessage = opt_newMessage || '';
  this._messageBoardText.textContent = opt_newMessage;
};

Quiz.prototype.checkAnswer = function(answer) {
  if (answer === this._places[this._curLoc].word) {
    this._curLoc++;
    
    if (this._curLoc === this._places.length) this._done();
    else {
      this._marker.setPosition(this._places[this._curLoc].coords);
    }
  } else {
    console.log('incorrect word');
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
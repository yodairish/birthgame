function Insta() {
  this._answer = '\u0068\u0065\u006C\u006C\u006F'; //hello
  this._name = 'insta';
  this._quizText = 'Here info text';
  this._clientID = '4d442c511e994faba9e3a6f6bc450c7d';
  this._userID = '9723536';
  
  this._photos = [];
  this._photosDone = 0;
  this._checking = false;
  this._info = null;
  this._messageBoard = null;
  
  this._jsonpScript = null;
}

Insta.prototype = new Quiz();

Insta.prototype._createHtmlContent = function() {
  var frag = document.createDocumentFragment(),
      checkPhoto = document.createElement('div');
  
  checkPhoto.id = 'checkPhotos';
  checkPhoto.addEventListener('touchstart', this._checkPhotos.bind(this));
  
  this._messageBoard = document.createElement('div');
  this._messageBoard.id = 'instaMessageBoard';
  this._messageBoard.textContent = 'Посмотреть фото';
  this._messageBoard.addEventListener('touchstart', this._hideInfo.bind(this));
  
  this._info = document.createElement('div');
  this._info.id = 'instaInfo';
  this._info.className = 'open';
  this._info.textContent = this.getQuizText();
  this._info.addEventListener('touchstart', this._showInfo.bind(this));
  
  frag.appendChild(this._messageBoard);
  frag.appendChild(checkPhoto);
  frag.appendChild(this._createInstaPhotos());
  frag.appendChild(this._info);
  
  return frag;
};

Insta.prototype._createInstaPhotos = function() {
  var container = document.createElement('div'),
      instaPhoto, photoIcon;
      
  container.id = 'instaPhotoContainer';
  
  for (var i = 0; i < 6; i++) {
    instaPhoto = document.createElement('div');
    instaPhoto.className = 'instaPhoto';
    
    photoIcon = document.createElement('div');
    photoIcon.className = 'instaPhotoIcon';
    instaPhoto.appendChild(photoIcon);
    
    this._photos[i] = document.createElement('img');
    this._photos[i].src = '';
    instaPhoto.appendChild(this._photos[i]);
    
    container.appendChild(instaPhoto);
  }
  
  return container;
};

Insta.prototype._hideInfo = function() {
  if (!this._info) return false;
  this._info.classList.remove('open');
  this._changeMessage();
};

Insta.prototype._showInfo = function() {
  if (!this._info) return false;
  this._info.classList.add('open');
  this._changeMessage('Посмотреть фото');
};

Insta.prototype._changeMessage = function(opt_newMessage) {
  if (!this._messageBoard) return false;
  
  opt_newMessage = opt_newMessage || (this._checking ? 'Loading..' :
                                      this._photosDone + ' / 6');
  this._messageBoard.textContent = opt_newMessage;
};

Insta.prototype._updPhotos = function(photos) {
  this._photosDone = 0;
  for (var i = 0; i < 6; i++) {
    if (photos[i] !== undefined) {
      this._photos[i].src = photos[i];
      this._photosDone++;
    } else this._photos[i].src = '';
  }
  if (this._photosDone === 6) {
    this._changeMessage('Поздравляем!');
    setTimeout(this._done.bind(this), 2000);
  } else this._changeMessage();
};

Insta.prototype._checkPhotos = function() {
  if (this._checking) return false;
  
  // jsonp hack
  this._jsonpScript = document.createElement('script');
  this._jsonpScript.src = this._getUrl();
  this._jsonpScript.onload = this._updateData.bind(this);
  this._jsonpScript.type = 'text/javascript';
  
  if(document.getElementsByTagName('head').length > 0)
      document.getElementsByTagName('head')[0].appendChild(this._jsonpScript);
  
  this._hideInfo();
  this._checking = true;
  this._changeMessage();
};

Insta.prototype._updateData = function() {
  var response = window.tmpInstaResp;
  delete window.tmpInstaResp;
  this._jsonpScript.remove();
  this._checking = false;
  
  if (response.meta.code === 200) {
    var photos = [],
        end = response.data.length;
    while(--end >= 0) {
      photos.push(response.data[end].images.standard_resolution.url);
    }
    
    this._updPhotos(photos);
  }
};

Insta.prototype._getUrl = function() {
  var date = new Date(),
      beginDay, endDay;
      
  date.setHours(0,0,0,0);
  beginDay = parseInt(date.getTime() / 1000);
  
  date.setHours(23,59,59,999);
  endDay = parseInt(date.getTime() / 1000);
  
  return 'https://api.instagram.com/v1/users/' + this._userID +
         '/media/recent' +
         '?client_id=' + this._clientID +
         //'&min_timestamp=' + beginDay +
         '&max_timestamp=' + endDay +
         '&count=6' +
         '&callback=instaResponse';
}


Insta.prototype._open = function() {
  if (this.status === true) return false;
  
  dashboard.showQuizze(this.getName());
  menu.showHome();
};

dashboard.addQuiz(new Insta());

// TEMPORARY HERE JUST GLOBAL FUNCTION
function instaResponse(data) {
  window.tmpInstaResp = data;
}
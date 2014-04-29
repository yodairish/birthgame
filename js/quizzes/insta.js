function Insta() {
  this._answer = '\u0068\u0065\u006C\u006C\u006F'; //hello
  this._name = 'insta';
  this._photos = [];
  this._checking = false;
}

Insta.prototype = new Quiz();

Insta.prototype._createHtmlContent = function() {
  var frag = document.createDocumentFragment(),
      checkPhoto = document.createElement('div');
  
  checkPhoto.id = 'checkPhotos';
  checkPhoto.addEventListener('touchStart', this._checkPhotos.bind(this));
  
  frag.appendChild(checkPhoto);
  frag.appendChild(this._createInstaPhotos());
  
  return frag;
};

Insta.prototype._createInstaPhotos = function() {
  var frag = document.createDocumentFragment(),
      instaPhoto;
  
  for (var i = 0; i < 6; i++) {
    instaPhoto = document.createElement('div');
    instaPhoto.className = 'instaPhoto';
    
    this._photos[i] = document.createElement('img');
    this._photos[i].src = '';
    instaPhoto.appendChild(this._photos[i]);
    
    frag.appendChild(instaPhoto);
  }
  
  return frag;
};

Insta.prototype._updPhotos = function(photos) {
  for (var i = 0; i < 6; i++) {
    if (photos[i] !== undefined) this._donePhoto(photos[i]);
    else photos[i].classList.remove('photoDone');
  }
};

Insta.prototype._donePhoto = function(photo, pos) {
  if (pos < 0 || pos > 6) return false;
  
  this._photos[i].src = photo;
  this._photos[i].classList.add('photoDone');
};

Insta.prototype._checkPhotos = function() {
  if (this._checking) return false;
  
  // get insta for day
  this._checking = true;
};

Insta.prototype._open = function() {
  if (this.status === true) return false;
  
  dashboard.showQuizze(this.getName());
  menu.showHome();
};

dashboard.addQuiz(new Insta());
function CryptoWord() {
  this._answer = '\u006D\u0061\u0067\u0069\u0063';
  this._name = 'cryptoword';
  this._hints = [
    'Еще одно слово нужно будет добыть у Летона. Довольно странный старикашка, постоянно занимается несколькими делами одновременно, что-то химичит, изобретает, без конца со всеми общается, точнее не общается, а говорит рядом, как будто и с тобой, а вроде и сам по себе, а еще он просто помешан на порядке! Все колбочки стоят по размеру, инструменты в ряд, все пронумеровано.. Но сейчас его нет, уехал, а куда и насколько никто не знает, бывало и на пару лет пропадет. А слово оставил, записал на пергаменте.. вот только загвоздка.. он его зашифровал. Так что придется тебе немного покопаться тут. Мы слышали, что собирался он в спешке, поэтому скорее всего шифр придумывал на ходу и вряд ли он будет сложный. Так что советуем исходить из простых закономерностей, да и причуды его стоит учесть. Ты пока попробуй придумать что-нибудь, а мы тут поищем, может быть получиться найти, что сможет помочь.',
    'Как твои успехи? Мы тут перебрали бумаги, которые остались и нашли там несколько заметок. Они достаточно сумбурны, но от туда можно вынести, что в шифре буквы связаны, но сами буквы не имею значения, т.е. будь-то "zaz" или "bab"   разницы нет.',
    'Хорошие новости! Нам удалось найти еще пару бумаг с записями и там видно, что в шифре используется последовательность букв. И главное там обнаружилась последняя буква в слове - "' + (this._answer[this._answer.length - 1]) + '", надеемся теперь тебе удастся разгагать остальные буквы.'
  ];
  this._currentStep = 1;
  
  this._hintTime = 300000;
  this._aplhabet = null;
  this._hintsContainer = null;
  this._hintList = null;
  this._addHint = null;
  this._timer = -1;
}

CryptoWord.prototype = new Quiz();

CryptoWord.prototype._createHtmlContent = function() {
  var cryptAnswer = this._cryptWord(),
      frag = document.createDocumentFragment(),
      cryptWord = document.createElement('p');
  
  this._createAlphabet(cryptAnswer);
  this._createHints();
  
  cryptWord.id = 'cryptWord';
  cryptWord.className = 'messageBoard';
  cryptWord.textContent = cryptAnswer;
  cryptWord.addEventListener('touchstart', this._hideHint.bind(this));
  
  this._addHint = document.createElement('div');
  this._addHint.id = 'cryptAddHint';
  this._addHint.addEventListener('touchstart', function(){
    this._currentStep++;
    this._hintList.scrollTop = 0;
    this._showCurrentHints();
    this._addHint.classList.remove('visible');
    this._showHint();
    this._timerButtonHint();
    this._save();
  }.bind(this));
  
  frag.appendChild(cryptWord);
  frag.appendChild(this._addHint);
  frag.appendChild(this._hintsContainer);
  frag.appendChild(this._aplhabet);
  
  return frag;
};

CryptoWord.prototype._createAlphabet = function(opt_word) {
  opt_word = opt_word || '';
  
  this._aplhabet = document.createElement('ul');
  this._aplhabet.id = 'cryptAlphabet';
  
  for (var i = 97, letter; i <= 122; i++) {
    letter = document.createElement('li');
    letter.textContent = String.fromCharCode(i);
    
    if (opt_word.indexOf(letter.textContent) >= 0) letter.className = 'inWord';
    
    this._aplhabet.appendChild(letter);
  }
};

CryptoWord.prototype._showHint = function() {
  if (!this._hintsContainer) return false;
  
  this._hintsContainer.classList.add('enable');
};

CryptoWord.prototype._hideHint = function() {
  if (!this._hintsContainer) return false;
  
  this._hintsContainer.classList.remove('enable');
};

CryptoWord.prototype._createHints = function() {
  this._hintsContainer = document.createElement('div');
  this._hintsContainer.id = 'cryptHints';
  this._hintsContainer.className = 'infoBoard enable';
  this._hintList = document.createElement('ul')
  
  var len = this._hints.length,
      hint;
  
  // for (var i = 0, len = this._hints.length, hint; i < len; i++) {
  while(--len >= 0) {
    hint = document.createElement('li');
    hint.id = 'cryptHint' + (len + 1);
    hint.textContent = this._hints[len];
    
    if (this._currentStep === (len + 1)) hint.classList.add('visible');
    
    this._hintList.appendChild(hint);
  }
  this._hintsContainer.appendChild(this._hintList);
  this._hintsContainer.addEventListener('touchstart', this._showHint.bind(this));
};

CryptoWord.prototype._showCurrentHints = function() {
  if (!this._hintsContainer) return false;
  
  var hint;
  for (var i = 1; i <= this._currentStep; i++) {
    hint = document.getElementById('cryptHint' + i);
    if (hint) hint.classList.add('visible');
  }
};

CryptoWord.prototype._cryptWord = function(opt_word) {
  opt_word = opt_word || this._answer;
  opt_word = opt_word.toLowerCase();
  
  var cryptedWord = [];

  for (var i = 0, len = opt_word.length, code; i < len; i++) {
    code = opt_word[i].charCodeAt() + i;
    
    while(code > 122) {
      code -= 26;
    }
    
    cryptedWord.push(String.fromCharCode(code));
  }
  
  return cryptedWord.join('');
};

CryptoWord.prototype._timerButtonHint = function() {
  if (this._timer >= 0 || this._currentStep >= this._hints.length) return false;
  
  this._timer = setTimeout(function() {
    this._addHint.classList.add('visible');
    this._timer = -1;
  }.bind(this), this._hintTime);
};

CryptoWord.prototype._save = function() {
  loader.save(this.getName(), {
    status: this.status,
    step: this._currentStep
  });
};

CryptoWord.prototype.load = function() {
  var data = loader.load(this.getName());
  if (data) {
    if (data.status === true) this._done();
    else {
      this._currentStep = data.step;
      this._showCurrentHints();
    }
  }
};

CryptoWord.prototype._open = function() {
  if (this.status === true) return false;
  
  dashboard.showQuizze(this.getName());
  menu.showHome();
  menu.showComplete();
  
  this._timerButtonHint();
};

dashboard.addQuiz(new CryptoWord());
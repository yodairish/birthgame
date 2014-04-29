function Melodi() {
  this._answer = '\u0068\u0065\u006C\u006C\u006F'; //hello
  this._name = 'melodi';
  this._quizText = 'Here info text';
  
  this._countNotes = 12;
  this._countRounds = 3;
  this._countNotesPerPhase = this._countNotes / this._countRounds;
  this._noteTime = 400;
  
  this._notes = [];
  this._phaseNotes = [];
  this._pickedPhaseNote = -1;
  this._currentMelodi = [];
  this._correctMelodi = [];
  this._currentPhase = 0;
  this._audioContext = new webkitAudioContext();
  this._notesSource = [];
  this._phases = [];
  this._info = null;
  this._messageBoard = null;
  this._resetButton = null;
  
  this._phaseCorrect = false;
  this._checkingNote = -1;
  this._playTimer = 0;
}

Melodi.prototype = new Quiz();

Melodi.prototype._createHtmlContent = function() {
  var frag = document.createDocumentFragment();
  
  this._messageBoard = document.createElement('div');
  this._messageBoard.id = 'musicMessageBoard';
  this._messageBoard.textContent = 'Начать';
  this._messageBoard.addEventListener('touchstart', this._hideInfo.bind(this));
  
  this._info = document.createElement('div');
  this._info.id = 'musicInfo';
  this._info.className = 'open';
  this._info.textContent = this.getQuizText();
  this._info.addEventListener('touchstart', this._showInfo.bind(this));
  
  this._resetButton = document.createElement('div');
  this._resetButton.id = 'musicReset';
  this._resetButton.className = 'hidden';
  this._resetButton.addEventListener('touchstart', this._reset.bind(this));
  
  frag.appendChild(this._messageBoard);
  frag.appendChild(this._createNotes());
  frag.appendChild(this._createPhases());
  frag.appendChild(this._createPhaseNotes());
  frag.appendChild(this._info);
  frag.appendChild(this._resetButton);
  
  this._loadNotes();
  
  return frag;
};

Melodi.prototype._createNotes = function() {
  var container = document.createElement('ul');
  container.id = 'musicNote';
  
  for (var i = 0; i < 6; i++) {
    this._notes[i] = document.createElement('li');
    this._notes[i].className = 'note' + (i + 1);
    this._notes[i].addEventListener('touchstart', function(num){
      return function() {
        this._playNote(num);
      }.bind(this)
    }.bind(this)(i));
    
    container.appendChild(this._notes[i]);
  }
  
  return container;
};

Melodi.prototype._createPhases = function() {
  var phases = document.createElement('ul');
  phases.id = 'musicPhases';
  
  for (var i = 0; i < this._countRounds; i++) {
    this._phases[i] = document.createElement('li');
    phases.appendChild(this._phases[i]);
  }
  
  return phases;
};

Melodi.prototype._createPhaseNotes = function() {
  var container = document.createElement('ul');
  container.id = 'musicPhaseNote';
  
  this._phaseNotes = [];
  for (var i = 0; i < this._countNotes; i++) {
    this._phaseNotes[i] = document.createElement('li');
    this._phaseNotes[i].textContent = i + 1;
    this._phaseNotes[i].addEventListener('touchstart', function(num){
      return function() {
        this._pickPhaseNote(num);
      }.bind(this);
    }.bind(this)(i));
    
    container.appendChild(this._phaseNotes[i]);
  }
  
  return container;
};

Melodi.prototype._hideInfo = function() {
  if (!this._info) return false;
  
  this._changeMessage();
  if (this._currentPhase === 0) this._completeHandle();
  
  this._info.classList.remove('open');
  this._hideReset();
};

Melodi.prototype._showInfo = function() {
  if (!this._info) return false;
  
  this._changeMessage('Скрыть');
  
  this._info.classList.add('open');
  this._showReset();
};

Melodi.prototype._hideReset = function() {
  if (!this._resetButton) return false;
  this._resetButton.classList.remove('hidden');
};

Melodi.prototype._showReset = function() {
  if (!this._resetButton) return false;
  this._resetButton.classList.add('hidden');
};

Melodi.prototype._changeMessage = function(opt_newMessage) {
  if (!this._messageBoard) return false;
  
  opt_newMessage = opt_newMessage || '';
  this._messageBoard.textContent = opt_newMessage;
};

Melodi.prototype._loadNotes = function() {
  for (var i = 1; i <= 6; i++) {
    this._loadNote(i, 'sound/note_' + i + '.ogg');
  }
};

Melodi.prototype._loadNote = function(num, url) {
  if (num > 6 || url === '') return false;
  
  var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function() {
    var buffer = this._audioContext.createBuffer(request.response, false);
	  this._notesSource[num - 1] = buffer;
	}.bind(this);
	
	request.send();
};

Melodi.prototype._generatePhaseMelodi = function() {
  this._correctMelodi = [];
  var len = this._currentPhase * this._countNotesPerPhase;
  for (var i = 0; i < len; i++) {
    this._correctMelodi[i] = utils.getRandom(0, 5);
  }
  console.log(this._correctMelodi);
};

Melodi.prototype._activatePhase = function() {
  if (this._currentPhase >= this._countRounds) return false;
  this._currentPhase++;
  
  this._hideInfo();
  
  this._generatePhaseMelodi();
  this._activatePhasesIndicators();
  
  this._hidePhaseNotes();
  // play correct melodi
  this._playCorrectMelody();
};

Melodi.prototype._playCorrectMelody = function(opt_curNote) {
  opt_curNote = opt_curNote || 0;
  
  if (opt_curNote === this._correctMelodi.length) {
    this._activatePhaseNotes();
    return true;
  }
  
  this._playNote(this._correctMelodi[opt_curNote]);
  this._playTimer = setTimeout(function(num){
    return function(){
      this._playCorrectMelody(num)
    }.bind(this)
  }.call(this, opt_curNote + 1), this._noteTime);
};

Melodi.prototype._activatePhasesIndicators = function() {
  for (var i = 0; i < this._countRounds; i++) {
    this._phases[i].className = (i < this._currentPhase ?
                                 'musicPhasesActive' :
                                 '');
  }
};

Melodi.prototype._hidePhaseNotes = function() {
  for (var i = 0; i < this._countNotes; i++) {
    this._phaseNotes[i].className = '';
  }
};

Melodi.prototype._activatePhaseNotes = function() {
  var last = this._currentPhase * this._countNotesPerPhase;
  for (var i = 0; i < this._countNotes; i++) {
    var state =  i < last ? 'add' : 'remove';
    this._phaseNotes[i].className = (i < last ? 'musicPhaseNoteActive' : '');
    this._currentMelodi[i] = -1;
  }
};

Melodi.prototype._pickPhaseNote = function(phaseNoteNum) {
  console.log('<<< ' + phaseNoteNum);
  if (this._phaseNotes[phaseNoteNum] === undefined) return false;
  
  if (this._pickedPhaseNote >= 0 && phaseNoteNum !== this._pickedPhaseNote) {
    this._phaseNotes[this._pickedPhaseNote].classList.remove('pickNote');
  }
  
  this._pickedPhaseNote = this._phaseNotes[phaseNoteNum]
                            .classList.contains('pickNote') ? -1 : phaseNoteNum;
  this._phaseNotes[phaseNoteNum].classList.toggle('pickNote');
};

Melodi.prototype._playNote = function(noteNum) {
  console.log('play ' + noteNum);
  
  if (this._pickedPhaseNote >= 0) {
    this._phaseNotes[this._pickedPhaseNote].className = 'musicPhaseNoteActive note' + (noteNum + 1);
    this._currentMelodi[this._pickedPhaseNote] = noteNum;
    this._pickedPhaseNote = -1;
  }
  
  this._notes[noteNum].classList.add('playingNote');
  setTimeout(function(num){
    return function() {
      this._notes[num].classList.remove('playingNote');
    }.bind(this);
  }.call(this, noteNum), this._noteTime);
  
  if (this._notesSource[noteNum] === undefined) return false;
  
  var note = this._audioContext.createBufferSource();
	note.buffer = this._notesSource[noteNum];
	note.loop = false;
  note.connect(this._audioContext.destination);
  note.start(0);
};

Melodi.prototype._isAllFill = function() {
  var last = this._currentPhase * this._countNotesPerPhase;
  for (var i = 0; i < last; i++) {
    if (this._currentMelodi[i] < 0) return false;
  }
  return true;
};

Melodi.prototype._checkCorrectNote = function() {
  if (this._correctMelodi[this._checkingNote] === undefined) return false;
  
  this._playNote(this._currentMelodi[this._checkingNote]);
  
  if (this._currentMelodi[this._checkingNote] !==
      this._correctMelodi[this._checkingNote]) {
    // show error
    this._currentPhase = 0;
    this._changeMessage('Ой, вы ошиблись :(');
    this._phaseNotes[this._checkingNote].classList.add('errorNote');
    this._checkingNote = -1;
    return false;
  }
  
  this._phaseNotes[this._checkingNote].classList.add('playingNote');
  if (this._checkingNote === this._correctMelodi.length - 1) {
    setTimeout(function(){
      if (this._currentPhase >= this._countRounds) {
        this._changeMessage('Поздравляем!');
        setTimeout(this._done.bind(this), 2000);
      } else {
        this._changeMessage('Все верно!');
        this._phaseCorrect = true;
      }
      
      this._checkingNote = -1;
    }.bind(this), this._noteTime);
  } else {
    this._playTimer = setTimeout(function() {
      this._phaseNotes[this._checkingNote].classList.remove('playingNote');
      this._checkingNote++;
      this._checkCorrectNote();
    }.bind(this), this._noteTime);
  }
}

Melodi.prototype._reset = function() {
  if (this._checkingNote >= 0) return false;
  
  clearTimeout(this._playTimer);
  this._currentPhase = 0;
  this._activatePhase();
};

Melodi.prototype._homeHandle = function() {
  clearTimeout(this._playTimer);
  this._currentPhase = 0;
  this._hidePhaseNotes();
  this._activatePhasesIndicators();
  this._showInfo();
  this._changeMessage('Начать');
  
  menu._homeHandle();
};

Melodi.prototype._open = function() {
  if (this.status === true) return false;

  dashboard.showQuizze(this.getName());
  menu.showHome();
  menu.showComplete();
};

Melodi.prototype._completeHandle = function() {
  if (this._checkingNote >= 0 ||
      this._currentPhase >= this._countRounds) return false;
  
  if (this._currentPhase === 0) {
    this._changeMessage('Игра начинается!');
    setTimeout(this._activatePhase.bind(this), 2000);
  } else if (this._phaseCorrect === true) {
      this._phaseCorrect = false;
      this._activatePhase();
  } else {
    if (!this._isAllFill()) {
      this._changeMessage('Заполните все ноты');
      setTimeout(this._changeMessage.bind(this), 1500);
      return false;
    } else {
      this._checkingNote = 0;
      this._checkCorrectNote();
    }
  }
};

dashboard.addQuiz(new Melodi());
function Melodi() {
  this._answer = '\u0068\u0065\u006C\u006C\u006F'; //hello
  this._name = 'melodi';
  this._quizText = 'Here info text';
  
  this._notes = [];
  this._phaseNotes = [];
  this._pickedPhaseNote = -1;
  this._currentMelodi = [];
  this._correctMelodi = [];
  this._currentPhase = 0;
  this._audioContext = new webkitAudioContext();
  this._audioNote = []; 
  this._notesSource = [];
  this._phases = [];
  this._info = null;
  this._messageBoard = null;
  
  this._checkingNote = -1;
  this._delayTimer = 0;
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
  
  frag.appendChild(this._messageBoard);
  frag.appendChild(this._createNotes());
  frag.appendChild(this._createPhases());
  frag.appendChild(this._createPhaseNotes());
  frag.appendChild(this._info);
  
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
  
  for (var i = 0; i < 3; i++) {
    this._phases[i] = document.createElement('li');
    phases.appendChild(this._phases[i]);
  }
  
  return phases;
};

Melodi.prototype._createPhaseNotes = function() {
  var container = document.createElement('ul');
  container.id = 'musicPhaseNote';
  
  this._phaseNotes = [];
  for (var i = 0; i < 15; i++) {
    this._phaseNotes[i] = document.createElement('li');
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
};

Melodi.prototype._showInfo = function() {
  if (!this._info) return false;
  
  this._changeMessage('Скрыть');
  
  this._info.classList.add('open');
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
  console.log(num, url);
  if (num > 6 || url === '') return false;
  
  var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.responseType = "arraybuffer";

	request.onload = function() {
    var buffer = this._audioContext.createBuffer(request.response, false);
	  this.soundBuffer[num] = buffer;
	}.bind(this);
	
	request.send();
};

Melodi.prototype._generatePhaseMelodi = function(phase) {
  if (phase < 1 || phase > 3) return false;
  
  this._correctMelodi = [];
  for (var i = 0, len = phase * 5; i < len; i++) {
    this._correctMelodi[i] = utils.getRandom(0, 5);
  }
  console.log(this._correctMelodi);
};

Melodi.prototype._activatePhase = function() {
  if (this._currentPhase >= 3) return false;
  if (this._delayTimer > 0) clearTimeout(this._delayTimer);
  this._currentPhase++;
  
  this._hideInfo();
  
  this._activatePhaseNotes(this._currentPhase);
  this._generatePhaseMelodi(this._currentPhase);
  this._activatePhasesIndicators(this._currentPhase);
  // play correct melodi
};

Melodi.prototype._activatePhasesIndicators = function(phase) {
  if (phase < 1 || phase > 3) return false;
  
  for (var i = 0; i < 3; i++) {
    this._phases[i].className = (i < phase ? 'musicPhasesActive' : '');
  }
};

Melodi.prototype._activatePhaseNotes = function(phase) {
  if (phase < 1 || phase > 3) return false;
  
  for (var i = 0, last = phase * 5; i < 15; i++) {
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
  }.call(this, noteNum), 500);
  
  if (this._notesSource[noteNum] === undefined) return false;
  
  var note = this._audioContext.createBufferSource();
	note.buffer = this._notesSource[noteNum];
  note.connect(this._audioContext.destination);
  note.start(0);
};

Melodi.prototype._isAllFill = function() {
  for (var i = 0, last = this._currentPhase * 5; i < last; i++) {
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
    this._delayTimer = setTimeout(this._activatePhase.bind(this), 2000);
    this._checkingNote = -1;
    return false;
  }
  
  this._phaseNotes[this._checkingNote].classList.add('playingNote');
  if (this._checkingNote === this._correctMelodi.length - 1) {
    setTimeout(function(){
      if (this._currentPhase >= 3) {
        this._changeMessage('Поздравляем!');
        setTimeout(this._done.bind(this), 2000);
      } else this._activatePhase();
      
      this._checkingNote = -1;
    }.bind(this), 500);
  } else {
    setTimeout(function() {
      this._phaseNotes[this._checkingNote].classList.remove('playingNote');
      this._checkingNote++;
      this._checkCorrectNote();
    }.bind(this), 500);
  }
}

Melodi.prototype._checkCorrectMelodi = function() {
  for (var i = 0, last = this._correctMelodi.length; i < last; i++) {
    if (this._currentMelodi[i] !== this._correctMelodi[i]) return false;
  }
  return true;
};

Melodi.prototype._homeHandle = function() {
  console.log('reset');
  this._showInfo();
  this._changeMessage('Начать');
  this._currentPhase = 0;
  
  menu._homeHandle();
};

Melodi.prototype._open = function() {
  if (this.status === true) return false;
  
  dashboard.showQuizze(this.getName());
  menu.showHome();
  menu.showComplete();
};

Melodi.prototype._completeHandle = function() {
  if (this._checkingNote >= 0) return false;
  
  if (this._currentPhase === 0) this._activatePhase();
  else {
    if (!this._isAllFill()) {
      this._changeMessage('Заполните все ноты');
      setTimeout(this._changeMessage.bind(this), 1500);
      return false;
    } else {
      this._checkingNote = 0;
      this._checkCorrectNote();
    }
    
    // check all notes is fill
    // check user melodi is correct
    // if correct go to next step or finish
    // else show message and go to 1 step
  }
};

dashboard.addQuiz(new Melodi());
function Dashboard() {
  this._quizzes = {};
  this._dashboardBlock = null;
  this._quizzesBlock = null;
  this._currentQuiz = '';
}

Dashboard.prototype.init = function(quizzes) {
  if (this._dashboardBlock && this._quizzesBlock) return false;
  
  this._dashboardBlock = document.getElementById('dashboard');
  this._quizzesBlock = document.getElementById('quizzesContainer');
  
  if (!this._dashboardBlock || !this._quizzesBlock) return false;
  
  this.addQuizzes(quizzes);
  return true;
};

Dashboard.prototype.show = function() {
  utils.showElement(this._dashboardBlock);
  this._hideQuizzes();
  menu.hideHome();
  menu.hideComplete();
};

Dashboard.prototype.hide = function() {
  utils.hideElement(this._dashboardBlock);
};

Dashboard.prototype.showQuizze = function(quizName) {
  if (this._quizzes[quizName] === undefined) return false;
  
  var quizzes = this._quizzesBlock.getElementsByClassName('quizBlock'),
      len = quizzes.length;
  while(--len >= 0) {
    quizzes[len].style.display = (quizzes[len].id === 'quiz_' + quizName ?
                                  'block' : 'none');
  }
  
  utils.showElement(this._quizzesBlock);
  this.hide();
  this._currentQuiz = quizName;
};

Dashboard.prototype._hideQuizzes = function() {
  utils.hideElement(this._quizzesBlock);
  this._currentQuiz = '';
};

Dashboard.prototype.addQuizzes = function(quizzes) {
  if (!this._dashboardBlock) return false;
  
  if (!(quizzes instanceof Array)) {
    console.log('argument have to be array of Quizzes');
    return false;
  }
  
  for (var i = 0, len = quizzes.length; i < len; i++) {
    this._loadQuiz(quizzes[i]);
  }
};

Dashboard.prototype._loadQuiz = function(quizFile) {
  if (typeof quizFile !== 'string' || quizFile === '') return false;
  
  var loadScript = document.createElement('script');
  loadScript.type = 'text/javascript';
  loadScript.src = 'js/quizzes/' + quizFile.trim().toLowerCase() + '.js';
  loadScript.onerror = function(error) {
    console.log('can\'t load quiz script: ' + error.srcElement.src);
  }
  console.log(loadScript);
  document.head.appendChild(loadScript);
};

Dashboard.prototype.addQuiz = function(quiz) {
  if (!this._dashboardBlock) return false;
  
  if (!(quiz instanceof Quiz)) {
    console.log('incorrect Quiz');
    return false;
  }
  
  var cell = quiz.init();
  if (cell) {
    this._quizzes[quiz.getName()] = quiz;
    this._dashboardBlock.appendChild(cell);
  }
};

Dashboard.prototype.addQuizContent = function(quizName, content) {
  if (!this._quizzesBlock) return false;
  
  var quizBlock = document.createElement('div');
  quizBlock.id = 'quiz_' + quizName;
  quizBlock.className = 'quizBlock';
  if (content) quizBlock.appendChild(content);
  this._quizzesBlock.appendChild(quizBlock);
};

Dashboard.prototype._homeHandle = function() {
  if (this._quizzes[this._currentQuiz] === undefined) return false;
  
  this._quizzes[this._currentQuiz]._homeHandle();
};

Dashboard.prototype._completeHandle = function() {
  if (this._quizzes[this._currentQuiz] === undefined) return false;
  
  this._quizzes[this._currentQuiz]._completeHandle();
};

Dashboard.prototype.completeCurrent = function(answer) {
  if (this._quizzes[this._currentQuiz] === undefined) return false;
  
  return this._quizzes[this._currentQuiz].checkAnswer(answer);
};

var dashboard = new Dashboard();
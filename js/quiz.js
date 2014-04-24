function Quiz() {
  this._name = '';
  this.status = false;
  this._quizText = '';
  this._answer = '';
  this.cell = null;
  this.htmlContent = null;
}

Quiz.prototype.init = function() {
  if (this.cell) {
    console.warn('Quiz aleady initialized');
    return false;
  }
  
  dashboard.addQuizContent(this.getName(), this._createHtmlContent());
  
  this.cell = document.createElement('li');
  this.cell.addEventListener('touchstart', this._open.bind(this));
  
  return this.cell;
};

Quiz.prototype._createHtmlContent = function() {
  if (this.htmlContent) return false;
};

Quiz.prototype.getName = function() {
  return this._name;
};

Quiz.prototype.getStatus = function() {
  return this.status;
};

Quiz.prototype.setStatus = function(newStatus) {
  if (newStatus instanceof Boolean) {
    console.warn('incorrect status');
    return false;
  }
  
  this.status = newStatus;
};

Quiz.prototype.getQuizText = function() {
  return this._quizText;
};

Quiz.prototype.checkAnswer = function(answer) {
  if (answer === this._answer) this._done();
  else return false;
};

Quiz.prototype._done = function() {
  this.status = true;
  
  if (this.cell) this.cell.classList.add('done');
  
  dashboard.show();
};

Quiz.prototype._open = function() {
  if (this.status === true) return false;
  
  dashboard.showQuizze(this.getName());
  menu.showHome();
  menu.showComplete();
};
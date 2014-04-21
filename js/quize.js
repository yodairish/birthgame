function Quiz() {
  this.name = '';
  this.status = false;
  this.QuizText = '';
  this.correctAnswer = '';
  this.cell = null;
  this.htmlContent = null;
}

Quiz.prototype.init = function() {
  if (this.cell) {
    console.warn('Quiz aleady initialized');
    return false;
  }
  
  this.cell = document.createElement('li');
  
  this._createHtmlContent();
  
  return this.cell;
};

Quiz.prototype._createHtmlContent = function() {
  if (this.htmlContent) return false;
};

Quiz.prototype.getName = function() {
  return this.name;
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
  return this.QuizText;
};

Quiz.prototype.checkAnswer = function(answer) {
  if (answer !== this.correctAnswer) return false;
  
  this._done();
};

Quiz.prototype._done = function() {
  this.status = true;
  
  if (this.cell) this.cell.classList.add('done');
  
  // open dashboard
  // check not completed Quizs and finish if not found
};

Quiz.prototype.open = function() {
  // close dashboard and all open Quizs
  // show content
};
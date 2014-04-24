function PoemLoc() {
  this._answer = '\u0073\u006F\u006D\u0065\u0061\u006E\u0073\u0077\u0065\u0072'; //someanswer
  this._name = 'poemloc';
  this._quizText = 'Here some text etc...';
}

PoemLoc.prototype = new Quiz();

PoemLoc.prototype._createHtmlContent = function() {
  var textQuiz = document.createElement('p');
  textQuiz.textContent = this.getQuizText();
  return textQuiz;
};

dashboard.addQuiz(new PoemLoc());
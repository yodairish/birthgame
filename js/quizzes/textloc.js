function TextLoc() {
  this._answer = '\u0073\u006F\u006D\u0065\u0061\u006E\u0073\u0077\u0065\u0072'; //someanswer
  this._name = 'textloc';
  this._quizText = 'Here some text etc...';
}

TextLoc.prototype = new Quiz();

TextLoc.prototype._createHtmlContent = function() {
  var textQuiz = document.createElement('p');
  textQuiz.textContent = this.getQuizText();
  return textQuiz;
};

dashboard.addQuiz(new TextLoc());
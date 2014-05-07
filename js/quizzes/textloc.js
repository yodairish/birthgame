function TextLoc() {
  this._answer = '\u0073\u006E\u006F\u0077';
  this._name = 'textloc';
  this._quizText = 'Мы точно не знаем, где хранится это слово. Джерольд отдал нам эту записку и сказал, что ты должна понять, где искать: "Маленький уголок с видом на крыши и запахом рек, а рядом бирюзовая таверна, в которой идет снег. Ступай в ту таверну в период между 5 и 6 часами и закажи там сифон."';
}

TextLoc.prototype = new Quiz();

TextLoc.prototype._createHtmlContent = function() {
  var textQuiz = document.createElement('p');
  textQuiz.id = 'textlocText';
  textQuiz.textContent = this.getQuizText();
  return textQuiz;
};

dashboard.addQuiz(new TextLoc());
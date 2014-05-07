function TextLoc() {
  this._answer = '\u0073\u006F\u006D\u0065\u0061\u006E\u0073\u0077\u0065\u0072'; //someanswer
  this._name = 'textloc';
  this._quizText = 'Мы точно не знаем, где храниться это слово. Джерольд отдал нам эту записку и сказал, что ты должна понять, где искать: "Маленький уголок с видом на крыши и запахом рек, а рядом таверна, в которой идет снег. В той таверне надо заказать напиток со специальной добавкой."';
}

TextLoc.prototype = new Quiz();

TextLoc.prototype._createHtmlContent = function() {
  var textQuiz = document.createElement('p');
  textQuiz.id = 'textlocText';
  textQuiz.textContent = this.getQuizText();
  return textQuiz;
};

dashboard.addQuiz(new TextLoc());
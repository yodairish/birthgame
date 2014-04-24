function Game() {
  this._quizzes = ['poemloc', 'location'];
}

Game.prototype._modulesInit = function() {
  return (menu.init() && dashboard.init(this._quizzes) && intro.init());
};

Game.prototype.start = function() {
  if (this._modulesInit()) {
    intro.show();
  } else return false;
};

var game = new Game();
function Game() {
  this._quizzes = ['cryptoword', 'insta', 'melodi',
                   'findroute', 'textloc', 'parts'];
}

Game.prototype._modulesInit = function() {
  return (menu.init() && dashboard.init(this._quizzes) && intro.init() &&
          finish.init());
};

Game.prototype.start = function() {
  if (this._modulesInit()) {
    intro.show();
  } else return false;
};

Game.prototype.finish = function() {
  finish.show();
};

var game = new Game();
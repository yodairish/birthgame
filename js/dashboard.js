function Dashboard() {
  this.Quizzes = [];
  this.dashboardBlock = null;
}

Dashboard.prototype.init = function(Quizzes) {
  if (dashboardBlock) {
    console.warn('Dashboard already initialized');
    return false;
  }
  
  this.dashboardBlock = document.getElementById('dashboard');
  if (!dashboardBlock) {
    console.warn('can\'t find dashboard container');
    return false;
  }
  
  this.addQuizzes(Quizzes);
};

Dashboard.prototype.addQuizzes = function(Quizzes) {
  if (!this.dashboardBlock) return false;
  if (Quizzes instanceof Array) {
    console.log('argument have to be array of Quizzes');
    return false;
  }
  
  for (var i = 0, len = Quizzes.length; i < len; i++) {
    this.addQuiz(Quizzes[i]);
  }
};

Dashboard.prototype.addQuiz = function(Quiz) {
  if (!this.dashboardBlock) return false;
  
  if (Quiz instanceof Quiz) {
    console.log('incorrect Quiz');
    return false;
  }
  
  var cell = Quiz.init();
  if (cell) this.dashboardBlock.appendChild(cell);
};
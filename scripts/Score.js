class Score {
  constructor(initialScore) {
    this.score = initialScore;
  }

  update(incrementValue) {
    this.score += incrementValue;
  }

  get currentScore() {
    return this.score;
  }
}

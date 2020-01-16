class Game {
  constructor(snake, ghostSnake, food, score, size) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.lastFoodPosition = [0, 0];
    this.score = score;
    this.hBoundary = size[0];
    this.vBoundary = size[1];
  }

  snakeTurnLeft() {
    this.snake.turnLeft();
  }

  snakeTurnRight() {
    this.snake.turnRight();
  }

  updateFoodPosition(coords) {
    this.food.updatePosition(coords);
  }

  growSnake() {
    this.snake.grow();
  }

  moveSnake() {
    this.snake.move();
  }

  moveGhostSnake() {
    this.ghostSnake.move();
  }

  get hasSnakeEatenItself() {
    const snakeBody = this.snakePositions.slice(0, -1);
    const snakeHead = this.snake.headPosition;
    const isHeadAtBodyPart = part =>
      part.every((coord, index) => coord === snakeHead[index]);
    return snakeBody.some(isHeadAtBodyPart);
  }

  get isSnakeTouchedWall() {
    let [snakeHeadXCord, snakeHeadYCord] = this.snake.headPosition;
    return (
      snakeHeadXCord < 0 ||
      snakeHeadXCord >= this.hBoundary ||
      snakeHeadYCord < 0 ||
      snakeHeadYCord >= this.vBoundary
    );
  }

  get isSnakeEatenFood() {
    let [snakeHeadXCord, snakeHeadYCord] = this.snake.headPosition;
    let [foodPosXCord, foodPosYCord] = this.food.position;
    return snakeHeadXCord == foodPosXCord && snakeHeadYCord == foodPosYCord;
  }

  get snakePositions() {
    return this.snake.location.slice();
  }

  get ghostSnakePositions() {
    return this.ghostSnake.location.slice();
  }

  get foodPosition() {
    return this.food.position.slice();
  }

  get previousFoodPosition() {
    return this.lastFoodPosition.slice();
  }

  get currentScore() {
    return this.score.currentScore;
  }

  updateGameStatus() {
    if (this.isSnakeEatenFood) {
      this.growSnake();
      this.lastFoodPosition = this.foodPosition;
      this.updateFoodPosition(getRandomCords(NUM_OF_COLS, NUM_OF_ROWS));
      this.score.update(5);
    }
  }
}

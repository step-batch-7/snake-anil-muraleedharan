const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

class Direction {
  constructor(initialHeading) {
    this.heading = initialHeading;
    this.deltas = {};
    this.deltas[EAST] = [1, 0];
    this.deltas[WEST] = [-1, 0];
    this.deltas[NORTH] = [0, -1];
    this.deltas[SOUTH] = [0, 1];
  }

  get delta() {
    return this.deltas[this.heading];
  }

  turnLeft() {
    this.heading = (this.heading + 1) % 4;
  }

  turnRight() {
    this.heading = (this.heading + 3) % 4;
  }
}

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
  }

  get location() {
    return this.positions.slice();
  }

  get species() {
    return this.type;
  }

  get headPosition() {
    return this.positions[0].slice();
  }

  turnLeft() {
    this.direction.turnLeft();
  }

  turnRight() {
    this.direction.turnRight();
  }

  move() {
    const [headX, headY] = this.positions[this.positions.length - 1];
    this.previousTail = this.positions.shift();

    const [deltaX, deltaY] = this.direction.delta;

    this.positions.push([headX + deltaX, headY + deltaY]);
  }
}

class Food {
  constructor(colId, rowId) {
    this.coords = [colId, rowId];
  }

  get position() {
    return this.coords.slice();
  }

  updatePosition(coords) {
    this.coords = coords;
  }
}

class Game {
  constructor(snake, ghostSnake, food) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
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

  get isSnakeEatenFood() {
    let [snakeHeadXCord, snakeHeadYCord] = this.snake.headPosition;
    let [foodPosXCord, foodPosYCord] = this.food.position;
    return snakeHeadXCord == foodPosXCord && snakeHeadYCord == foodPosYCord;
  }
}

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + '_' + rowId;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const getRandomCords = (maxX, maxY) => [
  Math.round(Math.random() * (maxX - 1)),
  Math.round(Math.random() * (maxY - 1))
];

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const drawFood = function(food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add('food');
};

const eraseFood = function(food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.remove('food');
};

const handleKeyPress = game => {
  if (event.key === 'ArrowRight') game.snakeTurnRight();
  if (event.key === 'ArrowLeft') game.snakeTurnLeft();
};

const moveAndDrawSnake = function(snake) {
  snake.move();
  eraseTail(snake);
  drawSnake(snake);
};

const attachEventListeners = game => {
  document.body.onkeydown = handleKeyPress.bind(null, game);
};

const initSnake = () => {
  const snakePosition = [
    [40, 25],
    [41, 25],
    [42, 25]
  ];
  return new Snake(snakePosition, new Direction(EAST), 'snake');
};
const initGhostSnake = () => {
  const ghostSnakePosition = [
    [40, 30],
    [41, 30],
    [42, 30]
  ];
  return new Snake(ghostSnakePosition, new Direction(SOUTH), 'ghost');
};

const setup = game => {
  attachEventListeners(game);
  createGrids();
  drawSnake(game.snake);
  drawSnake(game.ghostSnake);
};

const animateSnakes = game => {
  moveAndDrawSnake(game.snake);
  moveAndDrawSnake(game.ghostSnake);
};

const randomlyTurnSnake = snake => {
  let x = Math.random() * 100;
  if (x > 50) {
    snake.turnLeft();
  }
};

const runGame = function(game) {
  animateSnakes(game);
  randomlyTurnSnake(game.ghostSnake);

  if (game.isSnakeEatenFood) {
    eraseFood(game.food);
    game.updateFoodPosition(getRandomCords(NUM_OF_COLS, NUM_OF_ROWS));
    drawFood(game.food);
  }
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const randomCord = getRandomCords(NUM_OF_COLS, NUM_OF_ROWS);
  const food = new Food(...randomCord);
  const game = new Game(snake, ghostSnake, food);

  setup(game);
  drawFood(food);

  setInterval(runGame, 200, game);
};

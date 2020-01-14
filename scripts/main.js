const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;
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

const eraseTail = function([colId, rowId], species) {
  const cell = getCell(colId, rowId);
  cell.classList.remove(species);
};

const drawSnake = function(snakePositions, species) {
  snakePositions.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(species);
  });
};

const drawFood = function(foodPosition) {
  let [colId, rowId] = foodPosition;
  const cell = getCell(colId, rowId);
  cell.classList.add('food');
};

const eraseFood = function(foodPosition) {
  let [colId, rowId] = foodPosition;
  const cell = getCell(colId, rowId);
  cell.classList.remove('food');
};

const handleKeyPress = game => {
  if (event.key === 'ArrowRight') game.snakeTurnRight();
  if (event.key === 'ArrowLeft') game.snakeTurnLeft();
};

const moveAndDrawSnake = function(snake) {
  snake.move();
  eraseTail(snake.previousTailPosition, snake.species);
  drawSnake(snake.location, snake.species);
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

const initFood = () => {
  const randomCord = getRandomCords(NUM_OF_COLS, NUM_OF_ROWS);
  return new Food(...randomCord);
};

const setup = game => {
  attachEventListeners(game);
  createGrids();
  drawSnake(game.snakePositions, 'snake');
  drawSnake(game.ghostSnakePositions, 'ghost');
  drawFood(game.foodPosition);
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
  eraseFood(game.previousFoodPosition);
  game.updateGameStatus();
  drawFood(game.foodPosition);
  let scoreDisplay = document.getElementById('score-box');
  scoreDisplay.innerText = game.currentScore;
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = initFood();
  const score = new Score(0);
  const game = new Game(snake, ghostSnake, food, score);

  setup(game);

  setInterval(runGame, 200, game);
};

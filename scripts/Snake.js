class Snake {
  #positions;
  #direction;
  #type;
  #previousTail;
  constructor(positions, direction, type) {
    this.#positions = positions.slice();
    this.#direction = direction;
    this.#type = type;
    this.#previousTail = [0, 0];
  }

  get location() {
    return this.#positions.slice();
  }

  get species() {
    return this.#type;
  }

  get headPosition() {
    const length = this.#positions.length;
    return this.#positions[length - 1].slice();
  }

  get previousTailPosition() {
    return this.#previousTail.slice();
  }

  turnLeft() {
    this.#direction.turnLeft();
  }

  turnRight() {
    this.#direction.turnRight();
  }

  move() {
    const [headX, headY] = this.#positions[this.#positions.length - 1];
    this.#previousTail = this.#positions.shift();

    const [deltaX, deltaY] = this.#direction.delta;

    this.#positions.push([headX + deltaX, headY + deltaY]);
  }

  grow() {
    this.#positions.unshift(this.#previousTail);
  }
}

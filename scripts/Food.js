class Food {
  #coords;
  constructor(colId, rowId) {
    this.#coords = [colId, rowId];
  }

  get position() {
    return this.#coords.slice();
  }

  updatePosition(coords) {
    this.#coords = coords;
  }
}

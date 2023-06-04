class View {
  $ = {};

  constructor() {
    this.$.menu = this.#qs("[data-id='menu']");
    this.$.menuBtn = this.#qs("[data-id='menu-button']");
    this.$.menuItems = this.#qs("[data-id='menu-items']");
    this.$.resetBtn = this.#qs("[data-id='reset-btn']");
    this.$.newRoundBtn = this.#qs("[data-id='new-round-btn']");
    this.$.squares = this.#qsAll("[data-id='square']");
    this.$.modal = this.#qs("[data-id='modal']");
    this.$.modalText = this.#qs("[data-id='modal-text']");
    this.$.modalBtn = this.#qs("[data-id='modal-btn']");
    this.$.turn = this.#qs("[data-id='turn']");
    this.$.p1stats = this.#qs("[data-id='p1-stats']");
    this.$.p2stats = this.#qs("[data-id='p2-stats']");
    this.$.ties = this.#qs("[data-id='ties']");

    // UI only event listeners
    this.$.menuBtn.addEventListener("click", (e) => {
      this.#toggleMenu();
    });
  }

  #qs(selector, parent = document) {
    const el = parent.querySelector(selector);
    if (!el) {
      throw new Error("Could not find elements", selector);
    }
    return el;
  }

  #qsAll(selector, parent = document) {
    const el = parent.querySelectorAll(selector);
    if (!el) {
      throw new Error("Could not find elements", selector);
    }
    return el;
  }

  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menuBtn.classList.toggle("border");

    const icon = this.$.menuBtn.querySelector("i");
    icon.classList.toggle("fa-chevron-down");
    icon.classList.toggle("fa-chevron-up");
  }

  closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menuBtn.classList.remove("border");

    const icon = this.$.menuBtn.querySelector("i");

    icon.classList.add("fa-chevron-down");
    icon.classList.remove("fa-chevron-up");
  }

  openModal(message) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.innerText = message;
  }

  closeModal() {
    this.$.modal.classList.add("hidden");
  }

  clearBoard() {
    this.$.squares.forEach((sq) => (sq.innerHTML = ""));
  }

  initializeMoves(moves) {
    this.$.squares.forEach((sq) => {
      const existingMove = moves.find((move) => move.squareId === +sq.id);
      if (existingMove) {
        this.handlePlayerMove(sq, existingMove.player);
      }
    });
  }

  updateScoreBoard(p1wins, p2wins, ties) {
    this.$.p1stats.innerText = `${p1wins} Wins`;
    this.$.p2stats.innerText = `${p2wins} Wins`;
    this.$.ties.innerText = `${ties}`;
  }

  // puts icon inside the sqaure box
  handlePlayerMove(squareEl, player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }

  // update icon and label in the turn section
  setTurnIndicator(player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.colorClass, player.iconClass);
    label.innerText = `${player.name}, you're up`;
    label.classList.add(player.colorClass);

    this.$.turn.replaceChildren(icon, label);
  }

  bindGameResetEvent(handler) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.$.squares.forEach((square) => {
      square.addEventListener("click", handler);
    });
  }
}

export default View;

import type Store from "./store";
import { Move, Player } from "./types";

class View {
  $: Record<string, Element> = {};
  $$: Record<string, NodeListOf<Element>> = {};

  constructor() {
    this.$.menu = this.#qs("[data-id='menu']");
    this.$.menuBtn = this.#qs("[data-id='menu-button']");
    this.$.menuItems = this.#qs("[data-id='menu-items']");
    this.$.resetBtn = this.#qs("[data-id='reset-btn']");
    this.$.newRoundBtn = this.#qs("[data-id='new-round-btn']");
    this.$.modal = this.#qs("[data-id='modal']");
    this.$.modalText = this.#qs("[data-id='modal-text']");
    this.$.modalBtn = this.#qs("[data-id='modal-btn']");
    this.$.turn = this.#qs("[data-id='turn']");
    this.$.p1stats = this.#qs("[data-id='p1-stats']");
    this.$.p2stats = this.#qs("[data-id='p2-stats']");
    this.$.ties = this.#qs("[data-id='ties']");

    this.$$.squares = this.#qsAll("[data-id='square']");

    // UI only event listeners
    this.$.menuBtn.addEventListener("click", () => {
      this.#toggleMenu();
    });
  }

  render(game: Store["game"], stats: Store["stats"]) {
    const { playerWithStats, ties } = stats;
    const {
      moves,
      currPlayer,
      status: { isGameOver, winner },
    } = game;

    this.#closeMenu();
    this.#closeModal();
    this.#clearBoard();
    this.#updateScoreBoard(
      playerWithStats[0].wins,
      playerWithStats[1].wins,
      ties
    );
    this.#initializeMoves(moves);

    if (isGameOver) {
      this.#openModal(winner ? `${winner.name} wins!` : "Tie game!");
      return;
    }
    this.#setTurnIndicator(currPlayer);
  }

  #qs(selector: string, parent = document) {
    const el = parent.querySelector(selector);
    if (!el) {
      throw new Error(`Could not find elements ${el}`);
    }
    return el;
  }

  #qsAll(selector: string, parent = document) {
    const el = parent.querySelectorAll(selector);
    if (!el) {
      throw new Error(`Could not find elements ${el}`);
    }
    return el;
  }

  #toggleMenu() {
    this.$.menuItems.classList.toggle("hidden");
    this.$.menuBtn.classList.toggle("border");

    const icon = this.$.menuBtn.querySelector("i");
    icon?.classList.toggle("fa-chevron-down");
    icon?.classList.toggle("fa-chevron-up");
  }

  #closeMenu() {
    this.$.menuItems.classList.add("hidden");
    this.$.menuBtn.classList.remove("border");

    const icon = this.$.menuBtn.querySelector("i");

    icon?.classList.add("fa-chevron-down");
    icon?.classList.remove("fa-chevron-up");
  }

  #openModal(message: string) {
    this.$.modal.classList.remove("hidden");
    this.$.modalText.textContent = message;
  }

  #closeModal() {
    this.$.modal.classList.add("hidden");
  }

  #clearBoard() {
    this.$$.squares.forEach((sq) => (sq.innerHTML = ""));
  }

  #initializeMoves(moves: Move[]) {
    this.$$.squares.forEach((sq) => {
      const existingMove = moves.find((move) => move.squareId === +sq.id);
      if (existingMove) {
        this.#handlePlayerMove(sq, existingMove.player);
      }
    });
  }

  #updateScoreBoard(p1wins: number, p2wins: number, ties: number) {
    this.$.p1stats.textContent = `${p1wins} Wins`;
    this.$.p2stats.textContent = `${p2wins} Wins`;
    this.$.ties.textContent = `${ties}`;
  }

  // puts icon inside the sqaure box
  #handlePlayerMove(squareEl: Element, player: Player) {
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", player.iconClass, player.colorClass);
    squareEl.replaceChildren(icon);
  }

  // update icon and label in the turn section
  #setTurnIndicator(player: Player) {
    const icon = document.createElement("i");
    const label = document.createElement("p");

    icon.classList.add("fa-solid", player.colorClass, player.iconClass);
    label.innerText = `${player.name}, you're up`;
    label.classList.add(player.colorClass);

    this.$.turn.replaceChildren(icon, label);
  }

  bindGameResetEvent(handler: EventListener) {
    this.$.resetBtn.addEventListener("click", handler);
    this.$.modalBtn.addEventListener("click", handler);
  }

  bindNewRoundEvent(handler: EventListener) {
    this.$.newRoundBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler: EventListener) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", handler);
    });
  }
}

export default View;

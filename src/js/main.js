import View from "./view";
import Store, { STORE_KEY } from "./store";

const players = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "yellow",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "turquoise",
  },
];

function init() {
  const view = new View();
  const store = new Store(players, STORE_KEY);

  store.addEventListener("store_updated", () => {
    view.render(store.game, store.stats);
  });

  // This is to play in a different tab
  window.addEventListener("storage", () => {
    view.render(store.game, store.stats);
  });

  // Render view initially on load
  view.render(store.game, store.stats);

  // Handler for game reset
  view.bindGameResetEvent((e) => {
    store.reset();
  });

  // Handler for new round
  view.bindNewRoundEvent((e) => {
    store.newRound();
  });

  // Handler for player move
  view.bindPlayerMoveEvent((e) => {
    const target = e.currentTarget;

    const squareAlreadyFilled = store.game.moves.find(
      (move) => move.squareId === +target.id
    );
    // return if the current box is already filled
    if (squareAlreadyFilled) {
      return;
    }
    store.updateMoves(parseInt(target.id));
  });
}

window.addEventListener("DOMContentLoaded", init);

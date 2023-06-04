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

  view.bindGameResetEvent((e) => {
    view.closeModal();
    view.closeMenu();
    view.clearBoard();
    store.reset();
    view.setTurnIndicator(store.game.currPlayer);

    view.updateScoreBoard(
      store.stats.playerWithStats[0].wins,
      store.stats.playerWithStats[1].wins,
      store.stats.ties
    );
  });
  view.bindNewRoundEvent((e) => {
    console.log("New round");
    console.log(e);
  });
  view.bindPlayerMoveEvent((e) => {
    const target = e.currentTarget;

    const squareAlreadyFilled = store.game.moves.find(
      (move) => move.squareId === +target.id
    );
    if (squareAlreadyFilled) return;

    view.handlePlayerMove(target, store.game.currPlayer);
    store.updateMoves(parseInt(target.id));

    if (store.game.status.isGameOver) {
      const winner = store.game.status.winner;
      if (winner) {
        view.openModal(`${winner.name} wins!`);
      } else {
        view.openModal("Tie game!");
      }
      return;
    }

    // console.log(store.game);

    view.setTurnIndicator(store.game.currPlayer);
  });
}

window.addEventListener("DOMContentLoaded", init);

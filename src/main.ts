const App = {
  $: {
    menu: document.querySelector("[data-id='menu']"),
    menuItems: document.querySelector("[data-id='menu-items']"),
    resetBtn: document.querySelector("[data-id='reset-btn']"),
    newRoundBtn: document.querySelector("[data-id='new-round-btn']"),
    squares: document.querySelectorAll("[data-id='square']"),
    modal: document.querySelector("[data-id='modal']"),
    modalText: document.querySelector("[data-id='modal-text']"),
    modalBtn: document.querySelector("[data-id='modal-btn']"),
    turn: document.querySelector("[data-id='turn']"),
  },

  state: {
    moves: [],
  },

  init() {
    App.registerEventListeners();
  },

  registerEventListeners() {
    App.$.menu?.addEventListener("click", (e) => {
      App.$.menuItems?.classList.toggle("hidden");
    });
    App.$.resetBtn?.addEventListener("click", (e) => {
      console.log("Reset the game");
    });
    App.$.newRoundBtn?.addEventListener("click", (e) => {
      console.log("New round");
    });
    App.$.modalBtn?.addEventListener("click", (e) => {
      App.state.moves = [];
      App.$.squares.forEach((square) => (square.innerHTML = ""));
      const turnIcon = document.createElement("i");
      turnIcon.classList.add("fa-solid", "fa-x", "yellow");
      const turnLabel = document.createElement("p");
      turnLabel.textContent = "Player 1,you're up";
      App.$.turn?.replaceChildren(turnIcon, turnLabel);
      App.$.modal?.classList.add("hidden");
    });
    App.$.squares.forEach((sq) => {
      sq.addEventListener("click", (e) => {
        //return if move is already made on this square
        const hasMove = (id: number) => {
          const existingMove = App.state.moves.find(
            (move) => move.squareId === id
          );
          return existingMove !== undefined;
        };

        if (hasMove(+sq.id)) {
          return;
        }

        // Get the current Player
        const lastMove = App.state.moves.at(-1);
        const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
        const currentPlayer =
          App.state.moves.length === 0
            ? 1
            : getOppositePlayer(lastMove.playerId);

        const nextPlayer = getOppositePlayer(currentPlayer);

        // Create and add appropriate icon
        const squareIcon = document.createElement("i");
        const turnIcon = document.createElement("i");
        const turnLabel = document.createElement("p");
        turnLabel.innerText = `Player ${nextPlayer},you're up`;
        if (currentPlayer === 1) {
          squareIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnLabel.classList.add("turquoise");
        } else {
          squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
          turnIcon.classList.add("fa-solid", "fa-x", "yellow");
          turnLabel.classList.add("yellow");
        }
        sq.replaceChildren(squareIcon);
        App.$.turn?.replaceChildren(turnIcon, turnLabel);

        // Push the move to the state object
        App.state.moves.push({
          squareId: +sq.id,
          playerId: currentPlayer,
        });

        const game = App.getGameStatus(App.state.moves);
        if (game.status === "complete") {
          App.$.modal?.classList.remove("hidden");

          let message;
          if (game.winner) {
            message = `Player ${game.winner} wins!`;
          } else {
            message = "Tie game!";
          }

          App.$.modalText.textContent = message;
        }
      });
    });
  },

  getGameStatus(moves) {
    const p1Moves = moves
      .filter((move) => move.playerId === 1)
      .map((move) => +move.squareId);
    const p2Moves = moves
      .filter((move) => move.playerId === 2)
      .map((move) => +move.squareId);

    //check game condition
    const winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];

    let winner = null;

    winningPatterns.forEach((pattern) => {
      const p1Wins = pattern.every((v) => p1Moves.includes(v));
      const p2Wins = pattern.every((v) => p2Moves.includes(v));

      if (p1Wins) {
        winner = 1;
      }
      if (p2Wins) {
        winner = 2;
      }
    });

    return {
      status: moves.length === 9 || winner != null ? "complete" : "in-progress",
      winner,
    };
  },
};

window.addEventListener("DOMContentLoaded", App.init);

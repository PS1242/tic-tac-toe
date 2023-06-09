import type { GameState, Player } from "./types";

const initialValue: GameState = {
  moves: [],
  history: {
    currentGames: [],
    allGames: [],
  },
};

type SaveStateCb = (prevState: GameState) => GameState;

export const STORE_KEY = "t3-store";

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

class Store extends EventTarget {
  #winningPatterns = winningPatterns;

  constructor(
    private readonly players: Player[],
    private readonly storageKey: string
  ) {
    super();
  }

  get stats() {
    const state = this.#getState();

    return {
      playerWithStats: this.players.map((player) => {
        const wins = state.history.currentGames.filter(
          (game) => game.status.winner?.id === player.id
        ).length;
        return {
          ...player,
          wins,
        };
      }),
      ties: state.history.currentGames.filter(
        (game) => game.status.winner === null
      ).length,
    };
  }

  get game() {
    const state = this.#getState();
    const currPlayer = this.players[state.moves.length % 2];

    let winner = null;

    for (const player of this.players) {
      const moves = state.moves
        .filter((move) => move.player.id === player.id)
        .map((move) => move.squareId);

      for (const pattern of this.#winningPatterns) {
        if (pattern.every((v) => moves.includes(v))) {
          winner = player;
        }
      }
    }

    return {
      currPlayer,
      moves: this.#getState().moves,
      status: {
        isGameOver: winner !== null || state.moves.length === 9,
        winner,
      },
    };
  }

  updateMoves(squareId: number) {
    const stateClone = structuredClone(this.#getState());
    stateClone.moves.push({
      squareId,
      player: this.game.currPlayer,
    });
    this.#saveState(stateClone);
  }

  reset() {
    const sclone = structuredClone(this.#getState());
    const { status, moves } = this.game;

    if (status.isGameOver) {
      sclone.history.currentGames.push({
        moves,
        status,
      });
    }
    sclone.moves = [];
    this.#saveState(sclone);
  }

  newRound() {
    this.reset();
    const sclone = structuredClone(this.#getState()) as GameState;
    sclone.history.allGames.push(...sclone.history.currentGames);
    sclone.history.currentGames = [];
    this.#saveState(sclone);
  }

  #getState() {
    const data = localStorage.getItem(this.storageKey);
    return data ? (JSON.parse(data) as GameState) : initialValue;
  }

  #saveState(stateOrFn: GameState | SaveStateCb) {
    const prevState = this.#getState();
    let newState;
    switch (typeof stateOrFn) {
      case "function":
        newState = stateOrFn(prevState);
        break;
      case "object":
        newState = stateOrFn;
        break;
      default:
        throw new Error("Invalid argument passed to saveState");
    }
    localStorage.setItem(this.storageKey, JSON.stringify(newState));

    // Dispatch our custom event when store state is updated
    this.dispatchEvent(new Event("store_updated"));
  }
}

export default Store;

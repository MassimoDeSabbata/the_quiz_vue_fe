import Vue from 'vue';
import Vuex from 'vuex';
import {
  STORE_MUTATION_UPDATE_USER,
  STORE_MUTATION_ADD_PLAYER,
  STORE_MUTATION_REMOVE_PLAYER,
  STORE_MUTATION_UPDATE_CURRENT_RESERVER,
  STORE_MUTATION_UPDATE_COUNTER,
  STORE_MUTATION_UPDATE_GAME_STATE,
  STORE_GAME_STATUS_INIT,
  STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME,
  STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER,
  STORE_MUTATION_ADD_POINT_TO_USER,
  STORE_MUTATION_UPDATE_RESERVATION_COUNTER,
  STORE_GAME_EVENTS_COUNTER_IS_ZERO,
} from '@/constants/store-const';
import { Subject } from 'rxjs';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userName: null,
    userId: null,
    points: 0,
    isMaster: true,
    currentReserver: null,
    gameState: STORE_GAME_STATUS_INIT,
    gameEvents: new Subject(),
    counter: null,
    reservationCounter: null,
    players: new Map<string, any>(),
    totalPlayers: 0,
    playerListCheangeDetect: 0,
  },
  mutations: {
    // When user logs update the user data with the unique id from server
    [STORE_MUTATION_UPDATE_USER](state, payload) {
      state.userName = payload.userName;
      state.userId = payload.userId;
    },

    // When a user leave the room it must be popped out the users map
    [STORE_MUTATION_REMOVE_PLAYER](state, payload) {
      if (state.players.get(payload.userId) && payload.userId !== state.userId) {
        state.players.delete(payload.userId);
        state.totalPlayers -= 1;
        state.playerListCheangeDetect += 1;
      }
    },

    // When a new user logs in it is added on the players map. Current client user is
    // not counted as player
    [STORE_MUTATION_ADD_PLAYER](state, payload) {
      if (!state.players.get(payload.userId) && payload.userId !== state.userId) {
        state.players.set(payload.userId, payload);
        state.totalPlayers += 1;
        state.playerListCheangeDetect += 1;

        if (payload.isMaster) {
          state.isMaster = false;
        }
      }
    },

    // Updates the current reserver, so the user that can answer the question
    [STORE_MUTATION_UPDATE_CURRENT_RESERVER](state, payload) {
      state.currentReserver = payload;
      if (payload && payload.userId === state.userId) {
        state.gameState = STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME;
      }
      if (payload && payload.userId !== state.userId) {
        state.gameState = STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER;
      }
    },

    // The counter, rappresenting the time left to users to answer the question is
    // managed by the server that emits its value every second, in this way all clients are
    // always sincronized. This mutation update the counter value after the server emits it.
    // When the counter get to 0 a gameEvent is emitted to tell to the pages to make the
    // actions required when the match ends and the game status is set to init.
    [STORE_MUTATION_UPDATE_COUNTER](state, payload) {
      state.counter = payload;
      if (payload.value === 0) {
        state.gameState = STORE_GAME_STATUS_INIT;
        state.gameEvents.next(STORE_GAME_EVENTS_COUNTER_IS_ZERO);
      }
    },

    // Updates the current game state that rappresent what is going on in the game currently
    [STORE_MUTATION_UPDATE_GAME_STATE](state, payload) {
      state.gameState = payload;
    },

    // In case of a right answer a point is added to the user who haììgave it, if
    // the user is current user a point is givent to current user instead.
    [STORE_MUTATION_ADD_POINT_TO_USER](state, payload) {
      if (payload.userId === state.userId) {
        state.points += 1;
      } else {
        const player = state.players.get(payload.userId);
        player.points += 1;
        state.players.set(payload.userId, player);
        state.playerListCheangeDetect += 1;
      }
    },

    // When a user reserve a question there is a countdown for him to answer before it reaches
    // zero. The function emitting the count down values is in the master client. This mutation
    // updates that counter on the store.
    [STORE_MUTATION_UPDATE_RESERVATION_COUNTER](state, payload) {
      state.reservationCounter = payload.value;
    },
  },
  getters: {
    numberOfPlayers: (state) => {
      return state.totalPlayers;
    },
    userData: (state) => {
      return { userName: state.userName, userId: state.userId, isMaster: state.isMaster, points: state.points };
    },
  },
});

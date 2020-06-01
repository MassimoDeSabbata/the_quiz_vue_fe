import { Component, Prop } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';
import {
  STORE_MUTATION_UPDATE_GAME_STATE,
  STORE_GAME_STATUS_QUESTION_SENT,
  STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER,
  STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME,
  STORE_GAME_STATUS_MASTER_EVALUATING_ANSWER,
  STORE_MUTATION_ADD_POINT_TO_USER,
  STORE_MUTATION_UPDATE_CURRENT_RESERVER,
  STORE_GAME_STATUS_INIT,
  STORE_GAME_EVENTS_COUNTER_IS_ZERO,
} from '@/constants/store-const';
import Vue from 'vue';

@Component
export default class PlayerPage extends Vue {
  questionData = null;
  // If the user attempted to answer but fails this will be false, the
  // user will not be abel to answere anymore
  canAnswer = true;
  roundWinner = null;

  STORE_GAME_STATUS_QUESTION_SENT = STORE_GAME_STATUS_QUESTION_SENT;
  STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER = STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER;
  STORE_GAME_STATUS_QUESTION_SENT_BY_ME = STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME;
  STORE_GAME_STATUS_MASTER_EVALUATING_ANSWER = STORE_GAME_STATUS_MASTER_EVALUATING_ANSWER;
  STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME = STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME;

  reservationCounter: any = null;

  created(){
    this.subscribeToCounterIsZeroEvent();
  }
  /**
   * This function is called when the master of the room sends to the users
   * a new question.
   * @param data The data containing the question and the four possible answers
   */
  @Socket('newQuestionToAnswer')
  newQuestionToAnswer(data: any) {
    this.$store.commit(STORE_MUTATION_UPDATE_GAME_STATE, STORE_GAME_STATUS_QUESTION_SENT);
    this.questionData = JSON.parse(data);
    this.canAnswer = true;
  }

  /**
   * This event reports to the master and the other players that the user want to
   * reserve the question to try to answer it. Now the player have 20 seconds to answer.
   */
  reserveResponse() {
    if (this.$store.state.currentReserver === null && this.canAnswer === true) {
      this.$socket.client.emit('reserveResponse', this.$store.getters.userData);
    }
  }

  /**
   * This event is emitted when the player selects an answer, it is permetted only in
   * the game status STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME so when the player reserved the
   * question and the master aknowleged the reervation request.
   * @param answer {userId: number, userName: string, answer: string}
   */
  giveAnswer(answer: string) {
    if (this.$store.state.gameState !== STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME || !this.canAnswer) {
      return;
    }
    this.$socket.client.emit('userGivingAnswer', this.generateAnswerObject(answer));
    this.$store.commit(STORE_MUTATION_UPDATE_GAME_STATE, STORE_GAME_STATUS_MASTER_EVALUATING_ANSWER);
  }

  /**
   * This method generates the object that must be sent to the server when the player try to answer the question
   * an it is like {userId: number, userName: string, answer: string}
   * @param answer string
   */
  generateAnswerObject(answer: string) {
    return {
      userId: this.$store.state.userId,
      userName: this.$store.state.userName,
      answer: answer,
    };
  }

  /**
   * This function is triggered when the master notifies that an answer given by a user was wrong,
   * if the user that gave the answer was the current user, the current user can not answer this question anymore
   * @param answerData {userId: number, userName: string, answer: string}
   */
  @Socket('wrongAnswerGiven')
  wrongAnswerGiven(answerData: any) {
    console.log('wrongAnswerGiven');
    if (JSON.parse(answerData).userId === this.$store.state.userId) {
      this.canAnswer = false;
    }
  }

  /**
   * This function is triggered when the master notifies that an answer given by a user was right,
   * so the player that answered the question must take a point, it will be the store to see if the
   * winner was the current user (so the user take a point) or another user (so the point is given to him).
   * Also when this happen, the reservation must be freed.
   * @param answerData {userId: number, userName: string, answer: string}
   */
  @Socket('rightAnswerGiven')
  rightAnswerGiven(answerData: any) {
    console.log('ANSWER WAS RIGHT: ', JSON.parse(answerData));
    const answerDataParsed = JSON.parse(answerData);
    this.$store.commit(STORE_MUTATION_UPDATE_CURRENT_RESERVER, null);
    this.$store.commit(STORE_MUTATION_ADD_POINT_TO_USER, answerDataParsed);
    this.closeQuestionSession(answerDataParsed);
  }

  /**
   * This function is called when the master client confirms that a user have reserver
   * the anser to the question, so the currentReserver is updated as the master is the
   * point of truth. The master do not need to see this event.
   * @param data  {userName: string, userId: number}
   */
  @Socket('userReservationConfirm')
  userReservationConfirm(data: any) {
    console.log('userReservationConfirm: ', data);
    this.$store.commit(STORE_MUTATION_UPDATE_CURRENT_RESERVER, JSON.parse(data));
  }

  closeQuestionSession(answerData: any) {
    this.questionData = null;
    this.canAnswer = true;
    this.enableWinMessage(answerData);
  }

  async enableWinMessage(answerData: any) {
    this.roundWinner = answerData;
    await this.delay(4000);
    this.roundWinner = null;
  }

  subscribeToCounterIsZeroEvent(){
    this.$store.state.gameEvents.subscribe((data: any) => {
      if(data === STORE_GAME_EVENTS_COUNTER_IS_ZERO){
        this.closeQuestionSession(null);
      }
    })
  }

  /**
   * Wait ms milliseconds then resolve the promise.
   * @param ms milliseconds to wait
   */
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

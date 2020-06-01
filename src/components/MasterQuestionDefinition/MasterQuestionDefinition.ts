import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue';
import { Socket } from 'vue-socket.io-extended';
import { STORE_MUTATION_UPDATE_GAME_STATE, STORE_GAME_STATUS_QUESTION_SENT, STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER, STORE_GAME_STATUS_INIT, STORE_MUTATION_ADD_POINT_TO_USER, STORE_MUTATION_UPDATE_CURRENT_RESERVER, STORE_GAME_STATUS_MASTER_EVALUATING_ANSWER } from '@/constants/store-const';

@Component
export default class MasterQuestionDefinition extends Vue {
  STORE_GAME_STATUS_INIT = STORE_GAME_STATUS_INIT;
  STORE_GAME_STATUS_QUESTION_SENT = STORE_GAME_STATUS_QUESTION_SENT;
  STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER = STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER
  STORE_GAME_STATUS_MASTER_EVALUATING_ANSWER = STORE_GAME_STATUS_MASTER_EVALUATING_ANSWER

  question = null;
  answerOne = null;
  answerTwo = null;
  answerThree = null;
  answerFour = null;

  answerGiven: any = null;

  /**
   * Sends the question with the four possible answers to all
   * clients and starts the counter (count-down)
   */
  sendQuestion() {
    this.$socket.client.emit('newQuestion', this.createQuestionObject());
    this.$store.commit(STORE_MUTATION_UPDATE_GAME_STATE, STORE_GAME_STATUS_QUESTION_SENT);
    this.startCounter({ value: 50 });
  }

  /**
   * If the answer that the player gives is not correct, this is notified to the
   * players and the caunter is restarted from where the server notified it was
   * stopped by the player reservation
   */
  answerIsWrong() {
    this.$socket.client.emit('wrongAnswer', this.createAnswerResponseObject());
    this.$store.commit(STORE_MUTATION_UPDATE_GAME_STATE, STORE_GAME_STATUS_QUESTION_SENT);
    this.startCounter(this.$store.state.counter);
    this.answerGiven = null;
  }

  /**
   * If the answer that the player gives was right, this is notified to the
   * players and the player that gave the answer takes a point.
   * Also when this happen, the reservation must be freed.
   */
  answerIsRight(){
    this.$socket.client.emit('rightAnswer', this.createAnswerResponseObject());
    this.$store.commit(STORE_MUTATION_UPDATE_GAME_STATE, STORE_GAME_STATUS_INIT);
    this.$store.commit(STORE_MUTATION_ADD_POINT_TO_USER, this.answerGiven);
    this.$store.commit(STORE_MUTATION_UPDATE_CURRENT_RESERVER, null);
    this.answerGiven = null;
  }

  /**
   * Emits the event that makes the cauter (on the server) start from a given value
   * @param initCounterData
   */
  startCounter(initCounterData: any) {
    this.$socket.client.emit('startCounter', initCounterData);
  }

  /**
   * This is triggere when a user geves an answer that the master have to evaluate, this 
   * action is permitted only if the game status is STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER
   * @param answerData {userId: number, userName: string, answer: string}
   */
  @Socket('givenAnswer')
  givenAnswer(answerData: any) {
    if(this.$store.state.gameState !== STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER){
        return;
    }
    this.$store.commit(STORE_MUTATION_UPDATE_GAME_STATE, STORE_GAME_STATUS_MASTER_EVALUATING_ANSWER);
    this.answerGiven = JSON.parse(answerData);
  }


    /**
   * This function is called when a player reserved to respond the question, so if the master recives it
   * the currentReserver is updated with the data of the user who reserved the question
   * and the counter is stopped. The (this.$store.state.currentReserver === null) check prevents
   * a second user that may reserve the question (for a connection delay) to overwrite the first one. Also
   * the master confirms that the user have reserved the question so any other user know it.
   * @param data {userName: string, userId: number}
   */
  @Socket('userReservedResponse')
  userReservedResponse(data: any) {
    if (this.$store.state.isMaster && this.$store.state.currentReserver === null) {
      this.$socket.client.emit('stopCounter');
      this.$store.commit(STORE_MUTATION_UPDATE_CURRENT_RESERVER, JSON.parse(data));
      this.$socket.client.emit('userReservationConfirmaition', JSON.parse(data));
      this.startReservationCountdown(20);
    }
  }

/**
 * UTILITIES
 */


 /** */
  startReservationCountdown(seconds: number) {
    let counter = seconds;
      
    const interval = setInterval(() => {
      counter --;
      this.$socket.client.emit('reservationCounter', {value: counter});
      if(this.$store.state.gameState === STORE_GAME_STATUS_MASTER_EVALUATING_ANSWER){
        console.log("STOPPING COUNT DOWN, state is: ", this.$store.state.gameState)
        clearInterval(interval);
    }
      if (counter === 0 ) {
        this.answerIsWrong();
        clearInterval(interval);
      }
    }, 1000);
  }

  /**
   * Returns the object that must be sent as the new question for
   * the players to answer
   */
  createQuestionObject() {
    return {
      question: this.question,
      answerOne: this.answerOne,
      answerTwo: this.answerTwo,
      answerThree: this.answerThree,
      answerFour: this.answerFour,
    };
  }

  createAnswerResponseObject(){
    return {
      userId: this.$store.state.currentReserver ? this.$store.state.currentReserver.userId : null,
      userName: this.$store.state.currentReserver ? this.$store.state.currentReserver.userName : null,
      answer: this.answerGiven? this.answerGiven.answer: null
    }
  }
}

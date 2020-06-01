import { Component, Prop, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';
import { STORE_MUTATION_UPDATE_USER, STORE_MUTATION_UPDATE_CURRENT_RESERVER, STORE_MUTATION_UPDATE_COUNTER, STORE_MUTATION_UPDATE_GAME_STATE, STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER, STORE_GAME_STATUS_QUESTION_SENT, STORE_MUTATION_UPDATE_RESERVATION_COUNTER } from '@/constants/store-const';
import MasterPage from '@/components/MasterPage/MasterPage.vue';
import PlayerPage from '@/components/PlayerPage/PlayerPage.vue';
import router from '@/router';

@Component({
  components: {
    PlayerPage,
    MasterPage,
  },
})
export default class Room extends Vue {
  loading = true;

  /**
   * In component created, if the iser is not logged, back to login
   * Also show the loading page
   */
  created() {
    if (!this.$store.state.userId) {
      router.push('/');
      return;
    }
    this.loadScreen();
  }

  /**
   * Show the loading screen for 3 seconds to avoid a bad-looking
   * users loading due to the delay on the socket connection
   */
  async loadScreen() {
    await this.delay(3000);
    this.loading = false;
  }

  /**
   * Wait ms milliseconds then resolve the promise.
   * @param ms milliseconds to wait
   */
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }



  

  /**
   * The caunter, rappresenting the time left to users to answer the question is
   * managed by the server that emits its value every second, in this way all clients are
   * always sincronized. When this value is emitted this function store the new value on the store.
   * @param data {value: Number}
   */
  @Socket('newCounterValue')
  newCounterValue(data: any) {
    this.$store.commit(STORE_MUTATION_UPDATE_COUNTER, JSON.parse(data));
  }

  /**
   * This function is called when it is time for the currentReserver (data of the user that
   * reserved the question) to be deleted so that another user can reserve the same or the next question.
   */
  @Socket('freeReservations')
  freeReservations() {
    this.$store.commit(STORE_MUTATION_UPDATE_CURRENT_RESERVER, null);
    this.$store.commit(STORE_MUTATION_UPDATE_GAME_STATE, STORE_GAME_STATUS_QUESTION_SENT);
  }



  @Socket('newReservationCounterValue')
  newReservationCounterValue(data: any) {
    console.log("NEW RES COUNT")
    this.$store.commit(STORE_MUTATION_UPDATE_RESERVATION_COUNTER, JSON.parse(data));
  }

}

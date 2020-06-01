import { Prop, Component, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';
import { STORE_MUTATION_ADD_PLAYER, STORE_MUTATION_REMOVE_PLAYER } from './constants/store-const';

/**
 * This component mostly listen to server events
 */
@Component
export default class App extends Vue {
  /**
   * A new user has logged in the room, so must be added to the user list
   * @param data {userId, userName, isMaster}
   */
  @Socket('newUser')
  loggedOk(data: any) {
    if (!this.isUserLogged()) {
      return;
    }
    console.log('NEW USER: ', JSON.parse(data))
    this.$store.commit(STORE_MUTATION_ADD_PLAYER, JSON.parse(data));
  }

  /**
   * Dispatch to all users (via the server) logged the current user informations when asked to
   */
  @Socket('userDataRequest')
  userDataRequest() {
    if (!this.isUserLogged()) {
      return;
    }

    this.$socket.client.emit('userDataRequestAck', this.$store.getters.userData);
  }

  /**
   * The current user has asked for the lsit of the connected users (probably immediatelly after the login)
   * so all user is sending back their informations, for each user we will recive a userListDataResponse
   * and we will add the user to the user list (if not present yet)
   * @param data {userId, userName, isMaster}
   */
  @Socket('userListDataResponse')
  userListDataResponse(data: any) {
    if (!this.isUserLogged()) {
      return;
    }
    this.$store.commit(STORE_MUTATION_ADD_PLAYER, JSON.parse(data));
  }

  /**
   * A user left the room, remove it from the users list
   * @param data {userId}
   */
  @Socket('userLeftTheRoom')
  userLeftTheRoom(data: any) {
    if (!this.isUserLogged()) {
      return;
    }

    this.$store.commit(STORE_MUTATION_REMOVE_PLAYER, JSON.parse(data));
  }

  /**
   * Some actions, expecially on store, we want them to happen only if the user is logged
   * (so if the server gave him a unique userId)
   */
  isUserLogged() {
    return this.$store.state.userId !== null;
  }
}

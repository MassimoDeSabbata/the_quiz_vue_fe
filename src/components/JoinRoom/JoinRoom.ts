import { Component, Prop, Vue } from 'vue-property-decorator';
import { Socket } from 'vue-socket.io-extended';
import { STORE_MUTATION_UPDATE_USER } from '@/constants/store-const';
import router from '@/router';


@Component
export default class JoionRoom extends Vue {
  @Prop() private msg!: string;
  username = null;
  players = this.$store.state.players.values();
  loginRequested = false;

  created(){
    if(this.$store.state.userId){
       router.push('room')
    }
  }

  /**
   * User request the server to establish a connection
   * with the given username 
   */
  logWithUserName() {
    this.loginRequested = true;
    this.$socket.client.emit('newUserRequest', { userName: this.username, points: 0 });
  }

  /**
   * This page listen to the event newUserOk triggered
   * by the server that confirms the login with the requested username
   * and gives us a unique id, both are saved in the store. Then we ask 
   * for the list of the users currently logged in the room
   * @param data {userName, userId}
   */
  @Socket('newUserOk')
  loggedOk(data: any) {
    // saving on store
    this.$store.commit(STORE_MUTATION_UPDATE_USER, JSON.parse(data));

    // asking for the logged user list
    this.$socket.client.emit('userListRequest');
    router.push('room')
    this.loginRequested = false;
  }

}

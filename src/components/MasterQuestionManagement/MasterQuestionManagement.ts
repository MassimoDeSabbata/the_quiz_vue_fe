import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue'
import { Socket } from 'vue-socket.io-extended';

@Component
export default class MasterQuestionManagement extends Vue {
    /**
     * If the answer that the player gives is not correct, this is notified to the
     * players and the caunter is restarted from where the server notified it was
     * stopped by the player reservation
     */
    answerIsWrong(){
        this.$socket.client.emit('wrongAnswer');
        this.startCounter(this.$store.state.counter);
    }

    /**
     * Emits the event that makes the cauter (on the server) start from a given value
     * @param initCounterData 
     */
    startCounter(initCounterData: any){
        this.$socket.client.emit('startCounter', initCounterData);
    }
}

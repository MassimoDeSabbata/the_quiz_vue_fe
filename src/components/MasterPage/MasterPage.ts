import { Component, Prop } from 'vue-property-decorator';
import Vue from 'vue'
import { Socket } from 'vue-socket.io-extended';
import { STORE_MUTATION_UPDATE_USER } from '@/constants/store-const';
import MasterQuestionDefinition from '@/components/MasterQuestionDefinition/MasterQuestionDefinition.vue'

@Component({
    components: {
        MasterQuestionDefinition
    }
  })
export default class MasterPage extends Vue {


}

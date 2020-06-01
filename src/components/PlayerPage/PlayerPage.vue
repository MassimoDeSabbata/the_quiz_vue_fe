<template>
  <div class="PlayerPage">
    <div v-if="questionData" class="mt-3">
      <div class="row">
        <div class="col">
          <div class="jumbotron pt-3 pb-3">
            <div class="row">
              <div class="col">
                <h4>The Question is:</h4>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <span>{{questionData.question}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="info-countainer">
        <div v-if="canAnswer === true">
          <div
            class="alert alert-secondary secondary-custom"
            v-if="$store.state.gameState === STORE_GAME_STATUS_QUESTION_SENT"
          >
            <div class="row">
              <div class="col text-center">
                <span>Time left to reserve the answer:</span>
                <h5 v-if="$store.state.counter">{{$store.state.counter.value}}</h5>
              </div>
            </div>

            <div class="row">
              <div class="col text-center">
                <h5>Here the possible answers</h5>
              </div>
            </div>
          </div>
          <div
            class="alert alert-primary"
            v-if="$store.state.gameState === STORE_GAME_STATUS_QUESTION_SENT_BY_ME"
          >You can now anwer in {{$store.state.reservationCounter}}</div>
          <div
            class="alert alert-warning"
            v-if="$store.state.gameState === STORE_GAME_STATUS_MASTER_EVALUATING_ANSWER"
          >The Master is wisely evaluating your answer</div>
          <div
            class="alert alert-info"
            v-if="$store.state.gameState === STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER"
          >
            <span
              v-if="$store.state.currentReserver"
            >{{$store.state.currentReserver.userName}} can now answer in: {{$store.state.reservationCounter}}</span>
          </div>
        </div>

        <div class="alert alert-danger" v-if="canAnswer === false">
          <span>Oh snap! Seems like you guessed wrong... {{$store.state.counter.value}} to end of the turn</span>
        </div>
      </div>
      <div class="answers-container">
        <div class="row">
          <div :class="{'active-answers' : this.$store.state.gameState === STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME}"
            v-on:click="giveAnswer(questionData.answerOne)"
            class="col jumbotron pt-3 pb-3 mt-2"
          >
            <span>{{questionData.answerOne}}</span>
          </div>
          <div :class="{'active-answers' : this.$store.state.gameState === STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME}"
            v-on:click="giveAnswer(questionData.answerTwo)"
            class="col jumbotron pt-3 pb-3 ml-2 mt-2"
          >
            <span>{{questionData.answerTwo}}</span>
          </div>
        </div>
        <div class="row">
          <div :class="{'active-answers' : this.$store.state.gameState === STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME}"
            v-on:click="giveAnswer(questionData.answerThree)"
            class="col jumbotron pt-3 pb-3 mt-2"
          >
            <span>{{questionData.answerThree}}</span>
          </div>
          <div :class="{'active-answers' : this.$store.state.gameState === STORE_GAME_STATUS_QUESTION_RESERVED_BY_ME}"
            v-on:click="giveAnswer(questionData.answerFour)"
            class="col jumbotron pt-3 pb-3 ml-2 mt-2"
          >
            <span>{{questionData.answerFour}}</span> <i cla></i>
          </div>
        </div>
      </div>
      <!-- Lili -->
      <!-- lkl      <br /> -->
    </div>

    <div v-if="!questionData" class="mt-3">
      <div
        v-if="roundWinner && roundWinner.userId === $store.state.userId"
        class="alert alert-success"
      >You WIN!! ... for this round... we'll see the next one...</div>
      <div
        v-else
        class="alert alert-secondary secondary-custom"
      >The mester is doing his best to choose the worst question just for you... be patient</div>
    </div>



    <div v-if="$store.state.gameState === STORE_GAME_STATUS_QUESTION_SENT">
      <button
        class="btn btn-primary"
        v-on:click="reserveResponse"
        :disabled="$store.state.currentReserver !== null || canAnswer === false"
      >Reserve the response</button>
    </div>
  </div>
</template>

<script lang="ts" src="./PlayerPage.ts">
</script>

<style scoped lang="scss">
.answers-container {
  padding: 15px;
}

.info-countainer {
  height: 100px;
}

.secondary-custom {
  background-color: #e9ecef;
}

.active-answers {
  box-shadow: 2px 2px 5px 1px #007bff98;
  -webkit-box-shadow: 2px 2px 5px 1px #007bff98;
  -moz-box-shadow: 2px 2px 5px 1px #007bff98;
  cursor: pointer;
}
</style>

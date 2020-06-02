<template>
  <div class="MasterPage">
    <div class="question-answer-container">
      <div class="row">
        <div class="col">
          <h3>Enter a very difficult question:</h3>
          <!-- <input v-model="question" /> -->

          <div class="input-group input-group-sm mb-3 text-center">
            <div class="input-group-prepend">
              <span class="input-group-text question-label" id="inputGroup-sizing-sm">Question</span>
            </div>
            <input
              v-model="question"
              :disabled="$store.state.gameState !== STORE_GAME_STATUS_INIT"
              type="text"
              class="form-control"
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <h4>Don't be rough, at least give them four possible answers</h4>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div class="input-group input-group-sm mb-3 text-center">
            <div class="input-group-prepend">
              <span class="input-group-text question-label" id="inputGroup-sizing-sm">Answer one</span>
            </div>
            <input
              v-model="answerOne"
              :disabled="$store.state.gameState !== STORE_GAME_STATUS_INIT"
              type="text"
              class="form-control"
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
        </div>
        <div class="col">
          <div class="input-group input-group-sm mb-3 text-center">
            <div class="input-group-prepend">
              <span class="input-group-text question-label" id="inputGroup-sizing-sm">Answer Two</span>
            </div>
            <input
              v-model="answerTwo"
              :disabled="$store.state.gameState !== STORE_GAME_STATUS_INIT"
              type="text"
              class="form-control"
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <div class="input-group input-group-sm mb-3 text-center">
            <div class="input-group-prepend">
              <span class="input-group-text question-label" id="inputGroup-sizing-sm">Answer Three</span>
            </div>
            <input
              v-model="answerThree"
              :disabled="$store.state.gameState !== STORE_GAME_STATUS_INIT"
              type="text"
              class="form-control"
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
        </div>
        <div class="col">
          <div class="input-group input-group-sm mb-3 text-center">
            <div class="input-group-prepend">
              <span class="input-group-text question-label" id="inputGroup-sizing-sm">Answer Four</span>
            </div>
            <input
              v-model="answerFour"
              :disabled="$store.state.gameState !== STORE_GAME_STATUS_INIT"
              type="text"
              class="form-control"
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
            />
          </div>
        </div>
      </div>
    </div>

<button class="btn btn-secondary mr-4 master-send-clear-buttons " :disabled="$store.state.gameState !== STORE_GAME_STATUS_INIT" v-on:click="clearQuestionFields">Clear fields</button>

    <button class="btn btn-primary master-send-clear-buttons " :disabled="$store.state.gameState !== STORE_GAME_STATUS_INIT" v-on:click="sendQuestion">Send</button>

    <div class="mt-3">
      <div v-if="$store.state.gameState === STORE_GAME_STATUS_QUESTION_SENT">
        <div class="alert alert-secondary secondary-custom">
          <div class="row">
            <div class="col text-center">
              <span>The playes are now thinking about your question, time left to answer:</span>
              <h5 v-if="$store.state.counter">{{$store.state.counter.value}}</h5>
            </div>
          </div>
        </div>
      </div>

      <div v-if="$store.state.gameState === STORE_GAME_STATUS_MASTER_EVALUATING_ANSWER">
        <div v-if="answerGiven">
          <div class="alert alert-secondary secondary-custom">
            <div class="row">
              <div class="col">
                <h4>{{$store.state.currentReserver.userName}} says:</h4>
                <span>{{answerGiven.answer}}</span>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <button class="btn btn-success mr-3" v-on:click="answerIsRight">That's right</button>

                <button class="btn btn-danger" v-on:click="answerIsWrong">Answer Is wrong</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="$store.state.gameState === STORE_GAME_STATUS_QUESTION_RESERVED_BY_USER">
        <div class="alert alert-secondary secondary-custom">
          <div class="row">
            <div class="col">
              <h4>{{$store.state.currentReserver.userName}} reserved the answer</h4>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="row" v-if="answerGiven">
      <div class="col">
        <h4>{{$store.state.currentReserver.userName}} says:</h4>
        <span>{{answerGiven.answer}}</span>
      </div>

      <button v-on:click="answerIsRight">That's right</button>

      <button v-on:click="answerIsWrong">Answer Is wrong</button>
    </div>-->
  </div>
</template>

<script lang="ts" src="./MasterPage.ts">
</script>

<style scoped lang="scss">
.question-label {
  width: 110px;
}

.question-answer-container {
  margin: 15px;
  max-width: 80vw;
}

.secondary-custom {
  background-color: #e9ecef;
}

.master-send-clear-buttons {
  width: 115px;
}
</style>

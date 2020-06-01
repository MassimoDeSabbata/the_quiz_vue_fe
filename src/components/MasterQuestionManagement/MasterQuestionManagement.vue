<template>
  <div class="MasterQuestionManagement">
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
            type="text"
            class="form-control"
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
          />
        </div>
      </div>
    </div>

    </div>

    <button v-on:click="sendQuestion">Send</button>
    <button v-on:click="answerIsWrong">Answer Is wrong</button>
  </div>
</template>

<script lang="ts" src="./MasterQuestionManagement.ts">
</script>

<style scoped lang="scss">
.question-label {
  width: 110px;
}

.question-answer-container {
  
    margin: 15px;
    max-width: 80vW;
}
</style>

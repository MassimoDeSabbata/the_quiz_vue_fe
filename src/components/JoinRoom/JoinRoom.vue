<template>
  <div class="JoinRoom">
  

<div class="row mt-5 mb-3">
  <div class="col text-center">
    <h4>Enter your username to play!</h4>
  </div>
</div>

    <div class="row">
      <div class="col" >
        <input v-model="username" @keyup.enter="logWithUserName"/>

        <button class="btn btn-sm btn-primary ml-3"
          v-on:click="logWithUserName"
          :disabled="$store.state.userId || loginRequested"
        >Join Room</button>

        <div class="row" v-if="loginRequested">
          <div class="col">
            <span>Logging in...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./JoinRoom.ts">
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

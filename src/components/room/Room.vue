<template>
  <div class="Room">
    <div class="row mt-5" v-if="loading">
      <div class="col">
        <font-awesome-icon icon="circle-notch" class="fa-spin" size="2x"/>
        <span class="ml-3 loading-text">Entering the room...</span>
      </div>
    </div>

    <div v-if="!loading">
      <div class="row">
        <!-- LEFT USER LIST -->
        <div class="col-3 col-xl-2 col-sm-4 left-menu menu-color pt-4">
          <div class="row">
            <div class="col-3 text-left current-user-icon-container">
              <font-awesome-icon icon="user-circle" size="6x" class="current-user-icon white-icon"/>
            </div>
            <div class="col text-left pt-4">
              <span class="username">{{$store.state.userName}}</span>
              <br />
              <span v-if="!$store.state.isMaster">{{$store.state.points}} Points</span>
              <span v-if="$store.state.isMaster && $store.state.userId">You are the master</span>
            </div>
          </div>


          <div class="row user-list mt-4" >
             <div class="col-12 text-left mt-3">
              <span>Other players in this room:</span>
            </div>
            <div class="col text-left">
              <ul class="list-group" :key="$store.state.playerListCheangeDetect">
                <li
                  class=""
                  v-for="player in $store.state.players.values()"
                  v-bind:key="player.userId"
                >
                  <span >
                    <font-awesome-icon icon="user" class="white-icon"/>
                    {{ player.userName }}
                    <!-- <span v-if="player.isMaster">(Master of the room)</span> -->
                    <font-awesome-icon
                      v-if="player.isMaster"
                      class="master-user-icon"
                      icon="crown"
                    />
                    <span class="ml-auto"> {{ player.points }}</span>
                  </span> 
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col ">
          <div class="row">
            <div class="col menu-color">
              <img src="./../../assets/thequiz_logo.png" alt="logo" width="150" height="150">
            </div>
          </div>

          

        <!-- ROOM CONTENT -->
          <player-page v-if="!$store.state.isMaster"></player-page>
          <master-page v-if="$store.state.isMaster"></master-page>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Room.ts">
</script>

<style scoped lang="scss">
.master-user-icon {
  color: #ffcb30;
}

.current-user-icon-container {
  min-width: 125px;
}

.current-user-icon {
  margin-left: 20px;
}

.username {
  font: bold;
  font-size: 20px;
}

.user-list {
  margin-left: 10px;
}

.left-menu-user-list {
  min-width: 125px;
}

.loading-text{
  font-size: 25px;
  font: bold;
}

.left-menu {
  height: 100vW;
}

.menu-color{
  
  background-color: #3b4045;
}

.left-menu span {
  color: white;
}

.white-icon {
  color: white
}
</style>

<template>
  <div class="home">
    <div class="row header-thequiz">
      <div class="col menu-color">
        <img src="./../assets/thequiz_logo.png" alt="logo" width="150" height="150" />
      </div>
    </div>

    <JoinRoom />
  </div>
</template>

<script>
// @ is an alias to /src
import JoinRoom from "@/components/JoinRoom/JoinRoom.vue";

export default {
  name: "Home",
  components: {
    JoinRoom
  },
  sockets: {},
  methods: {}
};
</script>


<style scoped lang="scss">
.header-thequiz {
  width: 100%;
  background-color: #3b4045;
}
</style>
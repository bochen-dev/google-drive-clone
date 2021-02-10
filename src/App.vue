<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { auth } from "@/firebase";

export default {
  name: "app",
  data() {
    return {
      unsubscribe: null,
    };
  },
  created() {
    this.unsubscribe = auth.onAuthStateChanged((user) => {
      console.log({ user });
      this.$store.dispatch("auth/setCurrentUser", user);
    });
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
};
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
}
</style>

<style lang="scss" scoped>
#app {
  font-family: Montserrat, sans-serif;
  height: 100vh;
}
</style>

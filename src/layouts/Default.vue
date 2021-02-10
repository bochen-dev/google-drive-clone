<template>
  <el-container class="layout-main">
    <el-header class="layout-main__header">
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        style="height: 100%"
      >
        <el-row type="flex" align="middle">
          <router-link to="/">
            <img src="../assets/logo.png" width="30" height="30" />
          </router-link>

          <el-menu
            :default-active="$route.name"
            mode="horizontal"
            class="layout-main__nav"
            @select="handleSelect"
          >
            <!-- <el-menu-item index="Home">Home</el-menu-item> -->
            <el-menu-item index="Drive">Drive</el-menu-item>
          </el-menu>
        </el-row>
        <!-- Not logged in -->
        <el-row
          v-if="!currentUser"
          type="flex"
          justify="space-around"
          align="middle"
        >
          <el-button type="text" @click="$router.push({ name: 'Login' })"
            >Log In</el-button
          >
          <el-button
            type="primary"
            plain
            @click="$router.push({ name: 'SignUp' })"
            >Sign Up</el-button
          >
        </el-row>
        <!-- Logged in -->
        <el-row v-else type="flex" justify="space-around" align="middle">
          <el-dropdown trigger="click" @command="handleCommand">
            <el-row type="flex" justify="space-between" align="middle">
              <el-avatar
                size="small"
                icon="el-icon-user-solid"
                style="margin-right: 8px"
              ></el-avatar>
              <span>{{ currentUser.email }}</span>
            </el-row>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="Profile">Profile</el-dropdown-item>
              <el-dropdown-item command="SignOut" divided>Sign out</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
      </el-row>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "MainLayout",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.auth.user,
    }),
  },
  methods: {
    handleSelect(routeName) {
      if (routeName === this.$route.name) return;

      this.$router.push({ name: routeName });
    },

    handleCommand(command) {
      switch (command) {
        case 'Profile':
          this.$router.push({ name: 'Profile' });
          break;

        case 'SignOut':
          this.handleSignOut();
          break;

        default:
          break;
      }
    },

    async handleSignOut() {
      try {
        await this.$store.dispatch("auth/logout");
        this.$router.push({ name: 'Login' });
      } catch (e) {
        this.$notify.error({
          title: "Failed to sign out.",
          message: e.message || e,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.layout-main {
  height: 100%;

  &__header {
    border-bottom: 1px solid #e6e6e6;
  }

  &__nav {
    margin-left: 16px;
    border-bottom: none;
  }
}
</style>
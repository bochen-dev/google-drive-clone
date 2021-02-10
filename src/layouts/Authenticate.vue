<template>
  <div class="layout-authenticate">
    <div class="layout-authenticate__content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "AuthenticateLayout",
};
</script>

<style lang="scss" scoped>
.layout-authenticate {
  position: relative;
  height: 100%;
  background-color: #2c3e50;
  display: flex;
  justify-content: center;
  align-items: center;

  &__content {
    transform: translateY(-50px);
    width: 500px;
    background-color: #ffffff;
    border-radius: 4px;
  }
}
</style>
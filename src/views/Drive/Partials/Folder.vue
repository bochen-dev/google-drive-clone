<template>
  <el-button
    type="primary"
    plain
    icon="fas fa-folder"
    class="folder text-overflow"
    v-on="$listeners"
    :title="folder.name"
    >{{ folder.name }}</el-button
  >
</template>

<script>
export default {
  name: "Folder",
  props: {
    folder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.folder {
  width: 150px;
  text-align: left;
}
</style>
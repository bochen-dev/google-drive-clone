<template>
  <el-button
    type="default"
    plain
    icon="fas fa-file"
    class="file text-overflow"
    @click="openFile"
    :title="file.name"
    >{{ file.name }}</el-button
  >
</template>

<script>
export default {
  name: "File",
  props: {
    file: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    openFile() {
      window.open(this.file.url, '_blank');
    }
  },
};
</script>

<style lang="scss" scoped>
.file {
  width: 150px;
  text-align: left;
}
</style>
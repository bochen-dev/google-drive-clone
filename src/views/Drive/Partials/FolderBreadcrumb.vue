<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="item in path"
      :key="item.id"
      :to="{ name: 'Drive', params: { folderId: item.id } }"
      >{{ item.name }}
    </el-breadcrumb-item>

    <el-breadcrumb-item>{{ currentFolder.name }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState } from "vuex";
import { ROOT_FOLDER } from "@/services/Drive";

export default {
  name: "FolderBreadcrumb",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      currentFolder: (state) => state.drive.folder,
    }),
    path() {
      let path = this.currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];

      if (this.currentFolder) {
        path = [...path, ...this.currentFolder.path];
      }

      return path;
    },
    isRoot() {
      return this.currentFolder?.id === null;
    },
  },
};
</script>

<style>
</style>
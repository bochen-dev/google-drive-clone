<template>
  <div class="drive-page">
    <el-row type="flex" justify="space-between" align="middle">
      <FolderBreadcrumb />

      <div>
        <AddFolderButton @click="addFolderDialogVisible = true" />

        <AddFileButton />
      </div>

      <AddFolderDialog :visible.sync="addFolderDialogVisible" />
    </el-row>

    <!-- Folders -->
    <template v-if="childFolders.length > 0">
      <el-divider content-position="left">Folders</el-divider>
      <el-row type="flex">
        <Folder
          v-for="folder in childFolders"
          :key="folder.id"
          :folder="folder"
          @click="
            $router.push({ name: 'Drive', params: { folderId: folder.id } })
          "
        />
      </el-row>
    </template>

    <!-- Files -->
    <template v-if="childFiles.length > 0">
      <el-divider content-position="left">Files</el-divider>

      <File v-for="file in childFiles" :key="file.id" :file="file" />
    </template>

    <UploadingFiles
      id="uploading-files"
      v-if="uploadingFiles.length > 0"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

import AddFolderDialog from "./Partials/AddFolderDialog";
import AddFolderButton from "./Partials/AddFolderButton";
import AddFileButton from "./Partials/AddFileButton";
import FolderBreadcrumb from "./Partials/FolderBreadcrumb";
import Folder from "./Partials/Folder";
import File from "./Partials/File";
import UploadingFiles from "./Partials/UploadingFiles";

export default {
  name: "Drive",
  props: {
    folderId: {
      type: String,
      default: null,
    },
  },
  components: {
    AddFolderButton,
    AddFolderDialog,
    AddFileButton,
    FolderBreadcrumb,
    Folder,
    File,
    UploadingFiles,
  },
  data() {
    return {
      addFolderDialogVisible: false,
    };
  },
  computed: {
    ...mapState({
      currentUserId: (state) => state.auth.userId,
      currentUser: (state) => state.auth.user,
      currentFolder: (state) => state.drive.folder,
      childFolders: (state) => state.drive.childFolders,
      childFiles: (state) => state.drive.childFiles,
      uploadingFiles: (state) => state.drive.uploadingFiles,
    }),
  },
  watch: {
    folderId: {
      handler() {
        try {
          this.selectFolder(this.folderId);
        } catch (error) {
          this.$router.push({ name: "Drive", params: null });
        }
      },
    },
    currentUserId: {
      immediate: true,
      handler() {
        try {
          this.selectFolder(this.folderId);
        } catch (error) {
          console.log(`[catch] currentUserId watch`);
          this.$router.push({ name: "Drive", params: null });
        }
      },
    },
  },
  methods: {
    ...mapActions({
      selectFolder: "drive/selectFolder",
    }),
  },
};
</script>

<style lang="scss" scoped>
#uploading-files {
  position: absolute;
  right: 16px;
  bottom: 16px;

  .uploading-file + .uploading-file {
    margin-top: 8px;
  }
}
</style>
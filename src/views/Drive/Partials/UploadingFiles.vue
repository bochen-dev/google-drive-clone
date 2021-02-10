<template>
  <el-card class="upload-list">
    <el-row slot="header" type="flex" justify="space-between" align="middle">
      <span v-if="allUploaded">Uploaded {{ uploadingFiles.length }} files</span>
      <span v-else>Uploading {{ uploadingAmount }} files...</span>

      <el-row type="flex" justify="space-between" align="middle">
        <el-button
          v-if="uploadingAmount === 0"
          type="text"
          icon="fas fa-times"
          class="upload-list__close-btn"
          @click="handleClose"
        ></el-button>
      </el-row>
    </el-row>
    <div
      v-for="file in uploadingFiles"
      :key="file.id"
      class="upload-list__item"
    >
      <el-row type="flex" align="middle">
        <font-awesome-icon :icon="['far', 'file']" />
        <span class="upload-list__item-name text-overflow">{{ file.name }}</span>
      </el-row>

      <el-progress
        v-if="file.error || file.progress !== 1"
        text-inside
        :percentage="file.error ? 100 : file.progress * 100"
        :status="
          file.error ? 'exception' : file.progress === 1 ? 'success' : null
        "
        :format="(percentage) => null"
        class="upload-list__item-progress"
      ></el-progress>
    </div>
  </el-card>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "UploadingFiles",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      uploadingFiles: (state) => state.drive.uploadingFiles,
    }),
    uploadingAmount() {
      return this.uploadingFiles.filter(
        (file) => file.progress !== 1 && !file.error
      ).length;
    },
    allUploaded() {
      return (
        this.uploadingFiles.filter((file) => file.progress !== 1).length === 0
      );
    },
  },
  methods: {
    ...mapActions({
      clearUploadingFiles: 'drive/clearUploadingFiles'
    }),
    handleClose() {
      if (this.uploadingAmount > 0) return;

      this.clearUploadingFiles();
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-list {
  width: 300px;

  &__close-btn {
    padding: 0;
    color: lightgray;
  }

  .upload-list__item {
    &-name {
      font-size: 14px;
    }

    &-progress {
      width: 100%;
    }

    ::v-deep .el-progress-bar {
      padding-right: 0;
      margin-right: 0;
    }
  }

  .upload-list__item + .upload-list__item {
    margin-top: 8px;
  }
}
</style>
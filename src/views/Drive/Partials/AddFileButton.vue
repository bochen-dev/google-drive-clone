<template>
  <el-button
    type="primary"
    icon="fas fa-file-upload fa-xs"
    @click="$refs.file.click()"
    >File
    <input
      ref="file"
      type="file"
      style="display: none"
      @change="handleUpload"
    />
  </el-button>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { database, storage } from "@/firebase";
import { ROOT_FOLDER, createFile } from "@/services/Drive";

export default {
  name: "AddFileButton",
  data() {
    return {};
  },
  computed: {
    ...mapState({
      currentUserId: (state) => state.auth.userId,
      currentFolder: (state) => state.drive.folder,
    }),
  },
  methods: {
    ...mapActions({
      trackUploadProgress: "drive/trackUploadProgress",
      updateUploadProgress: "drive/updateUploadProgress",
      removeUploadProgress: "drive/removeUploadProgress",
    }),
    async handleUpload(e) {
      const file = e.target.files[0];
      if (!this.currentFolder || !file) return;

      const parentPath = this.currentFolder.path.join("/");

      const filePath =
        this.currentFolder === ROOT_FOLDER
          ? `${parentPath}/${file.name}`
          : `${parentPath}/${this.currentFolder.name}/${file.name}`;

      const trackId = await this.trackUploadProgress(file);
      console.log(`Track Id`, trackId);

      const uploadTask = storage
        .ref(`files/${this.currentUserId}/${filePath}`)
        .put(file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Upload progress
          const progress = snapshot.bytesTransferred / snapshot.totalBytes;
          this.updateUploadProgress({ trackId, data: { progress } });
        },
        (error) => {
          // Upload fails
          console.error({ error });
          this.updateUploadProgress({ trackId, data: { error: true } });
        },
        () => {
          // Upload finished
          uploadTask.snapshot.ref.getDownloadURL().then((url) => {
            database.files
              .where("name", "==", file.name)
              .where("createdBy", "==", this.currentUserId)
              .where("folderId", "==", this.currentFolder.id)
              .get()
              .then((existingFiles) => {
                const existingFile = existingFiles.docs[0];

                if (existingFile) {
                  return existingFile.ref.update({
                    url,
                    updatedAt: database.getCurrentTimestamp(),
                  });
                } else {
                  return createFile({
                    name: file.name,
                    url,
                    folderId: this.currentFolder.id,
                    createdBy: this.currentUserId,
                  });
                }
              });
          });
        }
      );
    },
  },
};
</script>

<style>
</style>
<template>
  <el-dialog title="Add Folder" :visible.sync="dialogVisible" width="30%">
    <el-form :model="form">
      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="handleSubmit">Add Folder</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { ROOT_FOLDER, createFolder } from "@/services/Drive";

export default {
  name: "AddFolderDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        name: "",
      },
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.auth.user,
      currentFolder: (state) => state.drive.folder,
    }),
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  methods: {
    async handleSubmit() {
      const path = [...this.currentFolder.path];
      if (this.currentFolder !== ROOT_FOLDER) {
        path.push({ name: this.currentFolder.name, id: this.currentFolder.id });
      }

      try {
        await createFolder({
          ...this.form,
          path,
          parentId: this.currentFolder.id,
          createdBy: this.currentUser.uid,
        });
        this.dialogVisible = false;
        this.resetForm();
      } catch (error) {
        console.error({ error });
      }
    },
    resetForm() {
      this.form.name = '';
    },
  },
};
</script>

<style>
</style>
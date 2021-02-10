<template>
  <div class="profile-page">
    <h1>Profile</h1>

    <el-alert
      v-if="error"
      title="Failed to update profile"
      :description="error.message"
      type="error"
      show-icon
    >
    </el-alert>

    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" type="email"></el-input>
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          placeholder="Leave blank to keep the same"
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item label="Confirm password" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          type="password"
          placeholder="Leave blank to keep the same"
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="handleSubmit"
          >Update</el-button
        >
        <el-button type="text" @click="$router.push({ name: 'Home' })"
          >Cancel</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ProfilePage",
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value && value !== this.form.password) {
        callback(new Error("Password don't match."));
      } else {
        callback();
      }
    };

    return {
      form: {
        email: "",
        password: "",
        confirmPassword: "",
      },

      error: null,

      isLoading: false,

      formRules: {
        confirmPassword: [
          {
            validator: validateConfirmPassword,
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.auth.user,
    }),
  },
  created() {
    this.form.email = this.currentUser.email;
  },
  methods: {
    checkForm() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate((valid) => {
          if (valid) return resolve(true);

          reject(valid);
        });
      });
    },
    async handleSubmit() {
      this.isLoading = true;

      try {
        await this.checkForm();

        const promises = [];

        if (this.form.email !== this.currentUser.email) {
          promises.push(this.$store.dispatch("auth/updateEmail", this.form.email));
        }

        if (this.form.password) {
          promises.push(this.$store.dispatch("auth/updatePassword", this.form.password));
        }

        await Promise.all(promises);

        this.$refs["form"].resetFields();

        this.$notify.success({
          title: "Successfully updated.",
        });

        this.$router.push({ name: "Home" });
      } catch (error) {
        this.error = error;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.profile-page {
  padding: 15px 30px;
}
</style>
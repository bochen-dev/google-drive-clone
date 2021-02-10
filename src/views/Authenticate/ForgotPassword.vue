<template>
  <div class="forgot-password-form">
    <h1>Forgot password</h1>

    <el-alert
      v-if="error"
      title="Failed to reset password"
      :description="error.message"
      type="error"
      show-icon
    >
    </el-alert>

    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Email" prop="email" required>
        <el-input v-model="form.email" type="email"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="handleSubmit"
          >Reset password</el-button
        >
      </el-form-item>

      <el-form-item>
        <span>
          Already have an account?
          <router-link :to="{ name: 'Login' }">Sign In</router-link>
        </span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "ForgotPasswordPage",
  data() {
    return {
      form: {
        email: "",
      },

      error: null,

      isLoading: false,

      formRules: {
        email: [
          {
            required: true,
            message: "Email is required.",
          },
        ],
      },
    };
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

      await this.checkForm();

      try {
        await this.$store.dispatch("auth/resetPassword", this.form.email);

        this.$notify.success({
          title: "Check your inbox for further instructions.",
        });

        this.$refs["form"].resetFields();
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
.forgot-password-form {
  padding: 15px 30px;
}
</style>
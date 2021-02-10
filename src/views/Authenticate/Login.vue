<template>
  <div class="login-form">
    <h1>Log In</h1>

    <el-alert
      v-if="error"
      title="Failed to log in"
      :description="error.message"
      type="error"
      show-icon
    >
    </el-alert>

    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Email" prop="email" required>
        <el-input v-model="form.email"></el-input>
      </el-form-item>

      <el-form-item label="Password" prop="password" required>
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="handleSubmit"
          >Log in</el-button
        >
        <el-button type="text" @click="$router.push({ name: 'ForgotPassword' })"
          >Forgot password</el-button
        >
      </el-form-item>

      <el-form-item>
        <span>
          New to here?
          <router-link :to="{ name: 'SignUp' }">Create an account</router-link>.
        </span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      form: {
        email: "",
        password: "",
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
        password: [
          {
            required: true,
            message: "Password is required.",
          },
        ],
      },
    };
  },
  methods: {
    async handleSubmit() {
      this.isLoading = true;

      try {
        await this.$store.dispatch("auth/login", {
          email: this.form.email,
          password: this.form.password,
        });

        this.$refs["form"].resetFields();

        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect);
        } else {
          this.$router.push({ name: "Home" });
        }
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
.login-form {
  padding: 15px 30px;
}
</style>
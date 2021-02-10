<template>
  <div class="sign-up-form">
    <h1>Sign Up</h1>

    <el-alert
      v-if="error"
      title="Failed to create account"
      :description="error.message"
      type="error"
      show-icon
    >
    </el-alert>

    <el-form ref="form" :model="form" :rules="formRules">
      <el-form-item label="Email" prop="email" required>
        <el-input v-model="form.email" type="email"></el-input>
      </el-form-item>

      <el-form-item label="Password" prop="password" required>
        <el-input
          v-model="form.password"
          type="password"
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item label="Confirm password" prop="confirmPassword" required>
        <el-input
          v-model="form.confirmPassword"
          type="password"
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="isLoading" @click="handleSubmit"
          >Submit</el-button
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
  name: "SignUpPage",
  data() {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("Please input the password again."));
      } else if (value !== this.form.password) {
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
        confirmPassword: [
          {
            required: true,
            message: "Confirm password is required.",
          },
          {
            validator: validateConfirmPassword,
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
        await this.$store.dispatch("auth/signup", {
          email: this.form.email,
          password: this.form.password,
        });

        this.$refs["form"].resetFields();

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
.sign-up-form {
  padding: 15px 30px;
}
</style>
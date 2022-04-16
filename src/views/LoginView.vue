<template>
  <div class="page-container">
    <div class="login-container">
      <div class="islogin-type-title">
        <h1>{{ !isRegisterRef ? "登录" : "注册" }}</h1>
      </div>
      <div class="form-container">
        <a-form
          :model="formState"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <div class="form-input">
            <div>
              <a-form-item label="邮箱" name="email">
                <a-input v-model:value="formState.email" />
              </a-form-item>
            </div>
            <div>
              <a-form-item label="密码" name="password">
                <a-input-password v-model:value="formState.password" />
              </a-form-item>
            </div>
            <div class="submit-button-area">
              <a-form-item v-if="isRegisterRef" label="验证码" name="checkCode">
                <a-input v-model:value="formState.checkCode" />
                <a-button
                  :disabled="isCheckedSendCheckCodeRef"
                  class="send-checkcode-button"
                  type="primary"
                  @click="sendCheckCode"
                  >{{
                    isCheckedSendCheckCodeRef
                      ? `${debounceCheckCodeRef}(s)`
                      : "发送"
                  }}</a-button
                >
              </a-form-item>
            </div>
          </div>
          <div>
            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
              <div class="form-type">
                <a-button
                  style="width: 60px"
                  v-if="isRegisterRef"
                  type="primary"
                  @click="userRegister"
                  >注册</a-button
                >
                <a-button
                  style="width: 60px"
                  v-else
                  type="primary"
                  @click="userLogIn"
                  >登录</a-button
                >
                <a-button
                  style="width: 60px"
                  type="link"
                  @click="isRegisterRef = !isRegisterRef"
                  >{{
                    isRegisterRef ? "已有账号，前去登录" : "我是新用户~"
                  }}</a-button
                >
              </div>
            </a-form-item>
          </div>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { SEND_CHECK_CODE, USER_LOGIN, USER_REGISTER } from "@/api/api";
import { notification } from "ant-design-vue";
import { defineComponent, reactive, ref } from "vue";
import { MD5 } from "crypto-js";
import { useRouter } from "vue-router";

interface FormState {
  email: string;
  password: string;
  checkCode?: string;
}
export default defineComponent({
  setup() {
    const router = useRouter();
    const formState = reactive<FormState>({
      email: "",
      password: "",
      checkCode: "",
    });
    const isRegisterRef = ref<boolean>(false);
    const isCheckedSendCheckCodeRef = ref<boolean>(false);
    const debounceCheckCodeRef = ref<number>(120);
    const emailVerilate =
      /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

    const userLogIn = () => {
      const { email, password } = formState;
      if (!emailVerilate.test(email)) {
        notification.warning({ message: "请输入正确的邮箱" });
        return;
      }
      if (!password) {
        notification.warning({ message: "请输入密码" });
        return;
      }
      //   console.log("password", MD5(password).toString());

      USER_LOGIN({ email, password: MD5(password).toString() }).then(
        ({ userId, token }: any) => {
          if (!userId || !token) return;
          window.localStorage.setItem("userId", userId);
          window.localStorage.setItem("token", token);
          notification.success({ message: "登录成功" });
          router.push("/");
        }
      );
    };

    const sendCheckCode = () => {
      if (!emailVerilate.test(formState.email)) {
        notification.warning({ message: "请输入正确的邮箱" });
        return;
      }
      SEND_CHECK_CODE({ email: formState.email }).then((res: any) => {
        isCheckedSendCheckCodeRef.value = true;
        for (let i = 120; i > 0; i--) {
          setTimeout(() => {
            debounceCheckCodeRef.value--;
            if (debounceCheckCodeRef.value === 0) {
              isCheckedSendCheckCodeRef.value = false;
              debounceCheckCodeRef.value = 120;
            }
          }, 1000 * i);
        }
        if (res.sended) {
          notification.success({ message: "验证码已发送" });
        }
      });
    };

    const userRegister = () => {
      USER_REGISTER({
        ...formState,
        password: MD5(formState.password).toString(),
      }).then(({ userId, token }: any) => {
        // console.log(userId, token);

        if (!userId || !token) return;
        window.localStorage.setItem("userId", userId);
        window.localStorage.setItem("token", token);
        notification.success({ message: "注册成功" });
        router.push("/");
      });
    };

    return {
      formState,
      isRegisterRef,
      isCheckedSendCheckCodeRef,
      debounceCheckCodeRef,
      userLogIn,
      sendCheckCode,
      userRegister,
    };
  },
});
</script>
<style scoped>
body {
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 100vh;
  position: relative;
  box-sizing: border-box;
}
.page-container {
  position: absolute;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  width: 60vw;
  height: 30vw;
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 5px 5px 5px 3px #aaa;
}
.islogin-type-title {
  text-align: center;
  margin: 20px;
}
.form-container {
  width: 100%;
  height: 80%;
  align-items: center;
  display: flex;
  flex-direction: column;
}
.form-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.form-input div {
  width: 30vw;
}
.send-checkcode-button {
  width: 80px;
  float: right;
  transform: translateY(-100%);
}
</style>

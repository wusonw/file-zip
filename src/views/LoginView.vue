<template>
  <a-form
    :model="formState"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
  >
    <a-form-item
      label="邮箱"
      name="email"
      :rules="[{ required: true, message: '请输入邮箱' }]"
    >
      <a-input v-model:value="formState.email" />
    </a-form-item>

    <a-form-item
      label="密码"
      name="password"
      :rules="[{ required: true, message: '请输入密码' }]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item
      v-if="isRegisterRef"
      label="验证码"
      name="checkCode"
      :rules="[{ required: true, message: '输入验证码' }]"
    >
      <a-input-password v-model:value="formState.checkCode" />
      <a-button type="primary" @click="sendCheckCode">发送验证码</a-button>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button v-if="isRegisterRef" type="primary" @click="userRegister"
        >注册</a-button
      >
      <a-button v-else type="primary" @click="userLogIn">登录</a-button>
    </a-form-item>
    <a-button type="link" @click="isRegisterRef = !isRegisterRef">{{
      isRegisterRef ? "已有账号，前去登录" : "我是新用户~"
    }}</a-button>
  </a-form>
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

    const userLogIn = () => {
      const { email, password } = formState;
      if (!email) {
        notification.warning({ message: "请输入邮箱" });
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
      if (!formState.email) {
        notification.warning({ message: "请输入接收验证码的邮箱" });
        return;
      }
      SEND_CHECK_CODE({ email: formState.email }).then(() => {
        notification.success({ message: "验证码已发送" });
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
      userLogIn,
      sendCheckCode,
      userRegister,
    };
  },
});
</script>

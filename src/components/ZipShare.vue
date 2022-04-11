<template>
  <a-form
    :model="formState"
    :layout="horizontal"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-item label="设置密码">
      <a-input
        v-model:value="formState.password"
        placeholder="如果需要自定义查看密码，请输入"
      />
    </a-form-item>
    <a-form-item label="私密">
      <a-switch v-model:checked="formState.privite" />
    </a-form-item>
    <a-form-item label="文件有效期">
      <a-radio-group v-model:value="formState.expired">
        <a-radio value="1">1天</a-radio>
        <a-radio value="2">7天</a-radio>
        <a-radio value="3">永久</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="下载次数限制">
      <a-input-number
        id="inputNumber"
        v-model:value="formState.downloadTimes"
        :min="1"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" @click="onSubmit">生成分享链接</a-button>
      <a-button @click="closeShareModal" style="margin-left: 10px"
        >取消</a-button
      >
    </a-form-item>
  </a-form>
  <a-drawer
    title="Basic Drawer"
    placement="right"
    :closable="false"
    :visible="false"
    :get-container="false"
    :style="{ position: 'absolute' }"
    @close="onClose"
  >
    <p>Some contents...</p>
  </a-drawer>
</template>
<script lang="ts">
import { Zip } from "@/utils/Zip";
import { defineComponent, reactive, ref, toRefs, UnwrapRef } from "vue";

interface FormState {
  password: string;
  privite: false;
  expired: string;
  downloadTimes: number;
}
export default defineComponent({
  props: {
    shareFile: Zip,
  },
  setup(props: any, context: any) {
    const isLogedIn = ref<boolean>(false);
    const { shareFile } = toRefs(props);
    // console.log(shareFile.value);

    const formState: UnwrapRef<FormState> = reactive({
      password: "",
      privite: false,
      expired: "1",
      downloadTimes: 1,
    });
    const onSubmit = () => {
      console.log("submit");
    };
    const closeShareModal = () => {
      context.emit("closeShareModal");
    };

    return { isLogedIn, formState, onSubmit, closeShareModal };
  },
});
</script>

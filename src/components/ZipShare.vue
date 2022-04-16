<template>
  <div>
    <a-form
      :model="formData"
      :layout="horizontal"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="设置密码">
        <a-input
          v-model:value="formData.password"
          placeholder="如果需要自定义查看密码，请输入"
        />
      </a-form-item>
      <a-form-item label="文件有效期">
        <a-radio-group v-model:value="formData.expired">
          <a-radio :value="Expired.ONE_DAY">1天</a-radio>
          <a-radio :value="Expired.SEVEN_DAY">7天</a-radio>
          <a-radio :value="Expired.ONE_MONTH">一个月</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <a-form-item>
      <a-button type="primary" @click="onFinish">生成分享链接</a-button>
    </a-form-item>
  </div>
</template>
<script lang="ts">
import { SHARE_FILE } from "@/api/api";
import { notification } from "ant-design-vue";
import { defineComponent, reactive, ref, toRefs, UnwrapRef } from "vue";

interface FormData {
  password: string;
  expired: Expired;
}
enum Expired {
  ONE_DAY = 1,
  SEVEN_DAY = 7,
  ONE_MONTH = 30,
}

export default defineComponent({
  props: {
    zipInfo: {},
  },
  setup(props: any, context: any) {
    const { zipInfo } = toRefs(props);
    // console.log("zipinfo", zipInfo.value);

    const isLogedIn = ref<boolean>(false);
    const formData: UnwrapRef<FormData> = reactive({
      password: "",
      expired: Expired.ONE_DAY,
    });
    const onFinish = async () => {
      const fileData: any = zipInfo.value.zippedData;
      const reader = new FileReader();
      reader.readAsDataURL(fileData);
      reader.onloadend = function () {
        const base64data = reader.result;
        SHARE_FILE({
          action: "add",
          fileData: base64data,
          fileName: zipInfo.value.fileInfo?.name,
          password: formData.password,
          expired:
            new Date().getTime() + formData.expired * 24 * 60 * 60 * 1000,
          fileInfo: zipInfo.value,
        }).then(({ shareId, creatorId }: any) => {
          if (!shareId || !creatorId) {
            notification.error({ message: "文件上传失败" });
            return;
          }
          context.emit("shareFileSuccess", { shareId });
          notification.success({ message: "文件上传成功" });
        });
      };
    };

    return { Expired, isLogedIn, formData, onFinish };
  },
});
</script>

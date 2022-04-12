<template>
  <div>
    <a-form
      :model="shareState"
      :layout="horizontal"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      @finish="onFinish"
    >
      <a-form-item label="设置密码">
        <a-input
          v-model:value="shareState.password"
          placeholder="如果需要自定义查看密码，请输入"
        />
      </a-form-item>
      <a-form-item label="私密">
        <a-switch v-model:checked="shareState.privite" />
      </a-form-item>
      <a-form-item label="文件有效期">
        <a-radio-group v-model:value="shareState.expired">
          <a-radio value="1">1天</a-radio>
          <a-radio value="2">7天</a-radio>
          <a-radio value="3">永久</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="下载次数限制">
        <a-input-number
          id="inputNumber"
          v-model:value="shareState.downloadTimes"
          :min="1"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" html-type="submit">生成分享链接</a-button>
        <a-button @click="closeShareModal" style="margin-left: 10px"
          >取消</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts">
import { SHARE_FILE } from "@/api/api";
import { defineComponent, reactive, ref, toRefs, UnwrapRef } from "vue";
import { ZipFileInfo } from "../components/ZipFile.vue";

interface ShareState {
  password: string;
  privite: false;
  expired: string;
  downloadTimes: number;
}

export default defineComponent({
  props: {
    zipInfo: {},
  },
  setup(props: any, context: any) {
    const { zipInfo } = toRefs(props);
    console.log("zipinfo", zipInfo.value);

    const isLogedIn = ref<boolean>(false);
    const shareState: UnwrapRef<ShareState> = reactive({
      password: "",
      privite: false,
      expired: "1",
      downloadTimes: 1,
    });
    const onFinish = async () => {
      //   console.log("finish");
      const fileData: any = await zipInfo.value.zippedData;
      SHARE_FILE({
        action: "add",
        fileData,
        fileName: zipInfo.value.fileInfo?.name,
      }).then((res: any) => console.log(res));
      context.emit("onFinish");
    };
    const closeShareModal = () => {
      context.emit("closeShareModal");
    };

    return { isLogedIn, shareState, onFinish, closeShareModal };
  },
});
</script>

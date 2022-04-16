<template>
  <div>
    <div>
      <div>文件名{{ shareInfoRef?.fileInfo?.fileInfo?.name }}</div>
      <div>文件大小{{ getFileSize(shareInfoRef?.fileInfo?.zippedSize) }}</div>
      <div>文件上传时间{{ formatTime(shareInfoRef?.created) }}</div>
      <div>文件过期时间{{ formatTime(shareInfoRef?.expired) }}</div>
    </div>
    <div>
      <div v-if="shareStateRef === GetShareState.NOT_EXIST">文件不存在</div>
      <div v-else-if="shareStateRef === GetShareState.OUT_EXPIRED">
        文件已失效
      </div>
      <div v-else-if="shareStateRef === GetShareState.CAN_NOT_DOWNLOAD">
        文件超出下载次数
      </div>
      <div v-else-if="shareStateRef === GetShareState.HAS_PASSWORD">
        <a-input-password v-model:value="passwordRef"></a-input-password>
      </div>
      <div
        v-if="
          shareStateRef === GetShareState.SUCCESS ||
          shareStateRef === GetShareState.HAS_PASSWORD
        "
      >
        <a-button @click="downloadShareFile">下载</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { GET_SHARE_FILE } from "@/api/api";
import { defineComponent } from "@vue/runtime-core";
import { notification } from "ant-design-vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { formatTime, getFileSize } from "@/utils/utils";

export enum GetShareState {
  SUCCESS = 0,
  NOT_EXIST = 1,
  OUT_EXPIRED = 2,
  CAN_NOT_DOWNLOAD = 3,
  HAS_PASSWORD = 4,
}

export default defineComponent({
  name: "ShareView",
  setup() {
    const route = useRoute();
    const shareId = route.params.shareId;
    const shareStateRef = ref<GetShareState>(GetShareState.NOT_EXIST);
    const shareInfoRef = ref<any>({});
    const passwordRef = ref("");

    const getShareFile = async ({ shareId, password = "" }: any) =>
      new Promise((res) => {
        GET_SHARE_FILE({ shareId, password }).then(({ state, info }: any) => {
          shareStateRef.value = state;
          shareInfoRef.value = info;
          // console.log(state, info);

          res(true);
        });
      });

    getShareFile({ shareId });

    const downloadShareFile = async () => {
      if (shareStateRef.value === GetShareState.HAS_PASSWORD) {
        if (!passwordRef.value) {
          notification.warning({ message: "密码不能为空" });
          return;
        }
        await getShareFile({ shareId, password: passwordRef.value });
        if (
          shareStateRef.value === GetShareState.HAS_PASSWORD &&
          !shareInfoRef.value?.url
        ) {
          notification.error({ message: "密码错误" });
        }
      }
      const shareUrl = shareInfoRef.value?.url;
      if (shareUrl) {
        window.open(shareUrl, "_blank");
      }
    };
    return {
      GetShareState,
      shareStateRef,
      shareInfoRef,
      passwordRef,
      downloadShareFile,
      formatTime,
      getFileSize,
    };
  },
});
</script>

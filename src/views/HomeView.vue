<template>
  <div class="home">
    <file-selector @onFileSelectorChange="onFileSelectorChange" />
    <a-button
      :disabled="fileState.fileList.length === 0 && !modalState.visible"
      @click="startZip"
    >
      开始压缩
    </a-button>

    <a-modal
      :maskClosable="false"
      :visible="modalState.visible"
      width="100%"
      @cancel="updateModal({ visible: false })"
      :title="modalState.title"
      :footer="null"
    >
      <zip-download
        v-if="modalContentTypeRef === ModalContentType.ZIP"
        @onZipStateChange="onZipStateChange"
        :fileList="fileState.fileList"
        :isSingleFile="fileState.isSingleFile"
      />

      <div v-else-if="modalContentTypeRef === ModalContentType.CHOOSE">
        {{ getFileSize(zipInfoRef.originSize) }}
        <br />
        {{ getFileSize(zipInfoRef.zippedSize) }}
        <div>
          <a-button @click="savaToLocal" type="primary">保存本地</a-button>
          <a-button @click="startShare" type="primary">分享</a-button>
        </div>
      </div>

      <zip-share
        :zipInfo="zipInfoRef"
        @shareFileSuccess="shareFileSuccess"
        v-else-if="modalContentTypeRef === ModalContentType.SHARE"
      />

      <div v-else-if="modalContentTypeRef === ModalContentType.SHARE_LINK">
        {{ shareLinkRef }}
        <div>
          <a-button @click="copy" type="primary">复制文件链接</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, h, reactive, ref, watch } from "vue";
import FileSelector from "../components/FileSelector.vue";
import ZipDownload, {
  ZipFileInfo,
  ZipFileProp,
  ZipState,
} from "../components/ZipFile.vue";
import ZipShare from "../components/ZipShare.vue";
import { getFileSize } from "@/utils/utils";
import { saveAs } from "file-saver";
import { CHECK_TOKEN, SHARE_FILE } from "@/api/api";
import { Button, notification } from "ant-design-vue";
import router from "@/router";

export enum ModalContentType {
  EMPTY = 0,
  ZIP = 1,
  CHOOSE = 2,
  SHARE = 3,
  SHARE_LINK = 4,
}

export default defineComponent({
  name: "HomeView",
  components: {
    FileSelector,
    ZipDownload,
    ZipShare,
  },
  setup() {
    CHECK_TOKEN().then((res: any) => {
      if (!res?.checked?.checked) {
        const key = `noTokenWarning${Date.now()}`;
        notification.warning({
          message: "未登录",
          description: "未登录状态无法使用分享功能",
          btn: () =>
            h(
              Button,
              {
                type: "primary",
                size: "small",
                onClick: () => {
                  router.push("/login");
                  notification.close(key);
                },
              },
              { default: () => "去登录" }
            ),
          key,
        });
      }
    });
    const fileState = reactive({
      fileList: [],
      isSingleFile: false,
    });

    const modalState = reactive({
      visible: false,
      title: "压缩",
    });

    const modalContentTypeRef = ref<ModalContentType>(ModalContentType.EMPTY);
    const zipInfoRef = ref<ZipFileInfo>();
    const shareLinkRef = ref<any>({});

    const onFileSelectorChange = ({ zipItemFileList, isSingleFile }: any) => {
      fileState.fileList = zipItemFileList;
      fileState.isSingleFile = isSingleFile;
    };

    const updateModal = (modalOptions: any) => {
      modalOptions.visible !== undefined &&
        (modalState.visible = modalOptions.visible);
      modalState.title = modalOptions.title;
    };

    const startZip = () => {
      modalContentTypeRef.value = ModalContentType.ZIP;
      updateModal({ visible: true, title: "压缩" });
    };

    const onZipStateChange = (options: ZipFileProp) => {
      console.log(options);

      if (options.zipState !== ZipState.FINISHED) return;
      zipInfoRef.value = options.zipInfo || {};
      modalContentTypeRef.value = ModalContentType.CHOOSE;
      updateModal({ title: "选择" });
    };

    const savaToLocal = () => {
      const _data = zipInfoRef.value?.zippedData,
        _name = zipInfoRef.value?.fileInfo?.name;
      console.log(_name);

      if (!_data || !_name) return;
      saveAs(_data, _name);
      updateModal({ visible: false });
    };

    const startShare = () => {
      modalContentTypeRef.value = ModalContentType.SHARE;
      updateModal({ visible: true, title: "分享设置" });
    };

    const shareFileSuccess = async (options: any) => {
      shareLinkRef.value = options;
      modalContentTypeRef.value = ModalContentType.SHARE_LINK;
      updateModal({ visible: true, title: "分享链接" });
    };

    watch(modalState, () => {
      if (modalState.visible) return;
      modalContentTypeRef.value = ModalContentType.EMPTY;
    });

    return {
      ModalContentType,
      fileState,
      modalState,
      modalContentTypeRef,
      zipInfoRef,
      shareLinkRef,
      getFileSize,
      onFileSelectorChange,
      updateModal,
      startZip,
      onZipStateChange,
      savaToLocal,
      startShare,
      shareFileSuccess,
    };
  },
});
</script>
<style>
html,
body {
  padding: 0 50px;
}
</style>

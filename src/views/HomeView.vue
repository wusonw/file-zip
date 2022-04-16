<template>
  <div class="home">
    <div class="start-zip-button">
      <a-button
        :disabled="fileState.fileList.length === 0 && !modalState.visible"
        @click="startZip"
      >
        开始压缩
      </a-button>
    </div>
    <div>
      <file-selector @onFileSelectorChange="onFileSelectorChange" />
    </div>

    <div>
      <a-modal
        class="modal-container"
        :maskClosable="false"
        :visible="modalState.visible"
        @cancel="updateModal({ visible: false })"
        :title="modalState.title"
        :footer="null"
      >
        <div class="modal-content">
          <zip-file
            v-if="modalContentTypeRef === ModalContentType.ZIP"
            @onZipStateChange="onZipStateChange"
            :fileList="fileState.fileList"
            :isSingleFile="fileState.isSingleFile"
          />

          <div v-else-if="modalContentTypeRef === ModalContentType.CHOOSE">
            <div class="choose-option-container">
              <div class="share-size-info">
                <div>
                  <span>压缩前文件大小</span>
                  <span>{{ getFileSize(zipInfoRef.originSize) }}</span>
                </div>
                <div>
                  <span>压缩后文件大小</span>
                  <span>{{ getFileSize(zipInfoRef.zippedSize) }}</span>
                </div>
              </div>

              <div class="choose-type-container">
                <div class="two-seperate-choices">
                  <a-button @click="saveToLocal">保存</a-button>
                  <a-button @click="startShare">分享</a-button>
                </div>
                <a-button @click="saveAndShare">保存后分享</a-button>
              </div>
            </div>
          </div>

          <zip-share
            :zipInfo="zipInfoRef"
            @shareFileSuccess="shareFileSuccess"
            v-else-if="modalContentTypeRef === ModalContentType.SHARE"
          />

          <div v-else-if="modalContentTypeRef === ModalContentType.SHARE_LINK">
            {{ shareLinkRef.shareId }}
            <div>
              <a-button @click="copyLink" type="primary">复制文件链接</a-button>
            </div>
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h, reactive, ref, watch } from "vue";
import FileSelector from "../components/FileSelector.vue";
import ZipFile, {
  ZipFileInfo,
  ZipFileProp,
  ZipState,
} from "../components/ZipFile.vue";
import ZipShare from "../components/ZipShare.vue";
import { getFileSize } from "@/utils/utils";
import { saveAs } from "file-saver";
import { baseURL, CHECK_TOKEN } from "@/api/api";
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
    ZipFile,
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

    const saveToLocal = () => {
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
    const saveAndShare = () => {
      saveToLocal();
      startShare();
    };

    const shareFileSuccess = async (options: any) => {
      shareLinkRef.value = options;
      modalContentTypeRef.value = ModalContentType.SHARE_LINK;
      updateModal({ visible: true, title: "分享链接" });
    };

    const copyLink = async () => {
      try {
        await navigator.clipboard.writeText(
          `localhost:8080/share/${shareLinkRef.value.shareId}`
        );
        notification.success({ message: "文件链接已复制" });
      } catch (err) {
        notification.error({ message: "复制链接失败" });
      }
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
      saveToLocal,
      startShare,
      saveAndShare,
      shareFileSuccess,
      copyLink,
    };
  },
});
</script>
<style>
html,
body {
  width: 100vw;
  height: 100vh;
  padding: 2vh 10vw;
  position: relative;
}

.start-zip-button {
  position: absolute;
  right: 10vw;
  transform: translate(-100% 0);
}
.modal-container {
  width: 70vw;
}

.modal-content {
  width: 100%;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.choose-option-container {
  width: 250px;
  display: flex;
  flex-direction: column;
}
.choose-type-container {
  height: 80px;
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  justify-content: space-between;
  align-self: center;
}
.choose-type-container div,
.share-size-info div {
  display: flex;
  justify-content: space-around;
}
</style>

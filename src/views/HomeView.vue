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
        v-else-if="modalContentTypeRef === ModalContentType.SHARE"
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import FileSelector from "../components/FileSelector.vue";
import ZipDownload, {
  ZipFileInfo,
  ZipFileProp,
  ZipState,
} from "../components/ZipFile.vue";
import { getFileSize } from "@/utils/utils";
import { saveAs } from "file-saver";

export enum ModalContentType {
  EMPTY = 0,
  ZIP = 1,
  CHOOSE = 2,
  SHARE = 3,
}

export default defineComponent({
  name: "HomeView",
  components: {
    FileSelector,
    ZipDownload,
  },
  setup() {
    const fileState = reactive({
      fileList: [],
      isSingleFile: false,
    });

    const modalState = reactive({
      visible: false,
      title: "压缩",
    });

    const modalContentTypeRef = ref<ModalContentType>(ModalContentType.EMPTY);

    const zipInfoRef = ref<ZipFileInfo>({});

    const onFileSelectorChange = ({ zipItemFileList, isSingleFile }: any) => {
      // console.log(modalState,fileState);

      fileState.fileList = zipItemFileList;
      fileState.isSingleFile = isSingleFile;
    };

    const updateModal = (modalOptions: any) => {
      modalOptions.visible !== undefined &&
        (modalState.visible = modalOptions.visible);
      modalState.title = modalOptions.title;
    };
    // watch(modalState,()=>{
    //   console.log(modalState);
    // })
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
      if (!_data || !_name) return;
      saveAs(_data, _name);
      updateModal({visible:false})
    };

    const startShare = ()=>{
      modalContentTypeRef.value = ModalContentType.SHARE;
      updateModal({visible:true,title:"分享"})

    }

    watch(modalState, () => {
      console.log("modalstate", modalState);

      if (modalState.visible) return;
      modalContentTypeRef.value = ModalContentType.EMPTY;
      zipInfoRef.value = {};
    });

    return {
      ModalContentType,
      fileState,
      modalState,
      modalContentTypeRef,
      zipInfoRef,
      getFileSize,
      onFileSelectorChange,
      updateModal,
      startZip,
      onZipStateChange,
      savaToLocal,
      startShare
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

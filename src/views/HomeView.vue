<template>
  <div class="home">
    <file-selector @onFileListChange="onFileListChange" />
    <zip-download :fileList="state.fileList" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import {} from "@zip.js/zip.js";
import FileSelector, { ZipItemFileType } from "../components/FileSelector.vue";
import ZipDownload from "../components/ZipDownload.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    FileSelector,
    ZipDownload,
  },
  setup() {
    const state = reactive({
      fileList: [],
    });
    const onFileListChange = ({ zipItemFileList }: any) => {
      state.fileList = zipItemFileList;
    };

    return {
      state,
      onFileListChange,
    };
  },
});
</script>

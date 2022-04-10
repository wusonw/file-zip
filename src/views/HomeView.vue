<template>
  <div class="home">
    <file-selector
      @onFileListChange="onFileListChange"
      @doneSelect="visible = true"
    />
    <zip-download
      :fileList="state.fileList"
      :visible="visible"
      @closeModal="visible = false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import FileSelector from "../components/FileSelector.vue";
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

    const visible = ref<boolean>(false);
    const onFileListChange = ({ zipItemFileList }: any) => {
      state.fileList = zipItemFileList;
    };

    return {
      state,
      visible,
      onFileListChange,
    };
  },
});
</script>

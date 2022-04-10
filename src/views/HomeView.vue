<template>
  <div class="home">
    <file-selector @doneSelect="doneSelect" />
    <zip-download
      :fileList="state.fileList"
      :totalSize="state.totalSize"
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
      totalSize: '',
    });

    const visible = ref<boolean>(false);
    const doneSelect = ({ zipItemFileList, totalSize }: any) => {
      state.fileList = zipItemFileList;
      state.totalSize = totalSize;
      visible.value = true;
    };

    return {
      state,
      visible,
      doneSelect,
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

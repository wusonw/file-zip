<template>
  <div class="clearfix">
    <a-upload
      :file-list="fileList"
      :before-upload="beforeUpload"
      @change="onChange"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        Select File
      </a-button>
    </a-upload>
    <a-button @click="saveFile"> Save </a-button>
  </div>
</template>
<script lang="ts">
import { UploadOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, watch } from "vue";
import type { UploadProps } from "ant-design-vue";
import { Zip } from "../utils/Zip";

export default defineComponent({
  components: {
    UploadOutlined,
  },
  setup() {
    const fileList = ref<any>([]);
    const uploading = ref<boolean>(false);
    const zip = new Zip();

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
      fileList.value = [...fileList.value, file];
      return false;
    };

    const onChange: UploadProps["onChange"] = (info: any) => {
      console.log(info);
      zip.addFile(info.file);
    };

    const saveFile = () => {
      zip.save({ fileName: "1234" });
    };

    return {
      fileList,
      uploading,
      beforeUpload,
      onChange,
      saveFile,
    };
  },
});
</script>

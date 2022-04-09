<template>
  <a-upload-dragger
    :fileList="fileList"
    :multiple="true"
    :before-upload="beforeUpload"
    @change="onChange"
  >
    <p class="ant-upload-drag-icon">
      <inbox-outlined></inbox-outlined>
    </p>
  </a-upload-dragger>
</template>
<script lang="ts">
import { InboxOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, toRefs } from "vue";
import type { UploadProps } from "ant-design-vue";
import { ZipWriterAddDataOptions } from "@zip.js/zip.js";

export interface ZipItemFileType {
  file: File;
  options: ZipWriterAddDataOptions;
}

export default defineComponent({
  components: {
    InboxOutlined,
  },
  setup(props: any, context) {
    const zipItemFileListRef = ref<ZipItemFileType[]>([]);
    const fileList = ref<any>([]);
    

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
      fileList.value = [...fileList.value, file];
      return false;
    };

    const onChange = (chanegd: any) => {
      zipItemFileListRef.value = chanegd.fileList.map((f: any) => ({
        file: f,
        options: {},
      }));
      context.emit("onFileListChange", {
        zipItemFileList: zipItemFileListRef.value,
      });
      // console.log(zipItemFileListRef.value)
    };

    return {
      fileList,
      beforeUpload,
      onChange,
      zipItemFileListRef
    };
  },
});
</script>

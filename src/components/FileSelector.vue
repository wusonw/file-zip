<template>
  <div class="clearfix">
    <a-upload
      :file-list="fileList"
      :before-upload="beforeUpload"
      @change="onChange"
    >
      <a-button>
        <upload-outlined></upload-outlined>
        选择文件
      </a-button>
    </a-upload>
    <a-button @click="setZipOptions = true"> 完成 </a-button>
  </div>
  <div v-if="setZipOptions" style="border:1px solid blue">
   <zip-options @saveFile="saveFile"/>
  </div>
</template>
<script lang="ts">
import { UploadOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import type { UploadProps } from "ant-design-vue";
import { Zip } from "../utils/Zip";
import ZipOptions from '@/components/ZipOptions.vue';

export default defineComponent({
  components: {
    UploadOutlined,
    ZipOptions
  },
  setup() {
    const fileList = ref<any>([]);
    const uploading = ref<boolean>(false);
    const zip = new Zip();
    const setZipOptions = ref<any>(false)

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
      fileList.value = [...fileList.value, file];
      return false;
    };

    const onChange: UploadProps["onChange"] = (info: any) => {
      // console.log(info);
      zip.addFile(info.file);
    };

    const saveFile = (options:any) => {
      setZipOptions.value = false
      zip.save(options);
    };

    return {
      fileList,
      uploading,
      beforeUpload,
      onChange,
      saveFile,
      setZipOptions
    };
  },
});
</script>

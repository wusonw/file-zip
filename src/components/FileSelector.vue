<template>
  <!-- <a-alert showIcon="true" message="未选择文件" type="warning" /> -->
  <a-upload-dragger
    :fileList="fileList"
    :multiple="true"
    :showUploadList="false"
    :before-upload="beforeUpload"
    @change="onChange"
  >
    <p class="ant-upload-drag-icon">
      <inbox-outlined />
    </p>
  </a-upload-dragger>
  <a-list size="small" bordered :data-source="fileList">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-checkbox
          :checked="selectedFileList.includes(item)"
          @change="selectFile($event, item)"
        ></a-checkbox>
        {{ item.name }}
      </a-list-item>
    </template>
    <template #header>
      <div>
        文件列表
        <a-checkbox
          @change="selectAllFiles"
          :checked="
            fileList.length <= 0
              ? false
              : fileList.length === selectedFileList.length
          "
          >全选/取消全选</a-checkbox
        >
        <a-button @click="deleteSelected"><delete-outlined />删除选中</a-button>
        <a-button @click="doneSelect">完成选择</a-button>
      </div>
    </template>
  </a-list>
</template>
<script lang="ts">
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref } from "vue";
import type { UploadProps } from "ant-design-vue";
import { ZipWriterAddDataOptions } from "@zip.js/zip.js";

export interface ZipItemFileType {
  file: File;
  options: ZipWriterAddDataOptions;
}

export default defineComponent({
  components: {
    InboxOutlined,
    DeleteOutlined,
  },
  setup(props: any, context) {
    const zipItemFileListRef = ref<ZipItemFileType[]>([]);
    const fileList = ref<any>([]);
    const selectedFileList = ref<any>([]);

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
      fileList.value = fileList.value.filter((f: any) => f.name !== file.name);
      fileList.value = [...fileList.value, file];
      return false;
    };

    const onChange = () => {
      zipItemFileListRef.value = fileList?.value?.map((f: any) => ({
        file: f,
        options: {},
      }));
      context.emit("onFileListChange", {
        zipItemFileList: zipItemFileListRef.value,
      });
    };

    const selectFile = (e: any, file: any) => {
      if (e.target.checked) selectedFileList.value.push(file);
      else
        selectedFileList.value.forEach((f: any, index: number) => {
          if (f.name === file.name) selectedFileList.value.splice(index, 1);
        });

      console.log(selectedFileList.value, fileList.value);
    };

    const deleteSelected = () => {
      fileList.value = fileList.value.filter((f: any) => {
        if (!selectedFileList.value.includes(f)) return f;
      });
      selectedFileList.value = []
    };

    const selectAllFiles = (e: any) => {
      selectedFileList.value = e.target.checked ? fileList.value.slice(0) : [];
    };

    const doneSelect = () => {
      if (selectedFileList.value.length <= 0) {
        alert("未选择文件");
        return;
      }
      context.emit("doneSelect");
    };

    return {
      fileList,
      beforeUpload,
      onChange,
      zipItemFileListRef,
      doneSelect,
      selectFile,
      selectedFileList,
      selectAllFiles,
      deleteSelected,
    };
  },
});
</script>

<template>
  <div class="file-selector-container">
    <div class="top-container">
      <a-radio-group
        class="zip-type-toggle"
        button-style="solid"
        v-model:value="isSingleFile"
      >
        <a-radio-button :value="false">多文件压缩</a-radio-button>
        <a-radio-button :value="true">单文件压缩</a-radio-button>
      </a-radio-group>
      <div class="upload-dragger-container">
        <a-upload-dragger
          :fileList="fileList"
          :multiple="!isSingleFile"
          :showUploadList="false"
          :before-upload="beforeUpload"
        >
          <p class="ant-upload-drag-icon">
            <inbox-outlined />
          </p>
          <p>点击或拖拽上传文件</p>
        </a-upload-dragger>
      </div>
    </div>

    <div v-show="!isSingleFile" class="file-list-container">
      <a-list size="small" bordered :data-source="fileList">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-checkbox
              :checked="selectedFileList.includes(item)"
              @change="selectFile($event, item)"
              ><div class="file-list-item">
                {{ item.name }}
                <p>{{ getFileSize(item.size) }}</p>
              </div>
            </a-checkbox>
          </a-list-item>
        </template>
        <template #header>
          <div class="file-list-header">
            <h3 class="file-list-header-title">文件列表</h3>
            <div class="file-list-header-control">
              <a-checkbox
                @change="selectAllFiles"
                :disabled="fileList.length === 0"
                :checked="
                  fileList.length <= 0
                    ? false
                    : fileList.length === selectedFileList.length
                "
                >全选/取消全选</a-checkbox
              >
              <a-button
                @click="deleteSelected"
                :disabled="selectedFileList.length === 0"
                ><delete-outlined />删除选中</a-button
              >
              <a-button
                :disabled="selectedFileList.length === 0"
                @click="doneSelect"
                >开始压缩</a-button
              >
            </div>
          </div>
        </template>
      </a-list>
    </div>
  </div>
</template>
<script lang="ts">
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, watch } from "vue";
import type { UploadProps } from "ant-design-vue";
import { ZipWriterAddDataOptions } from "@zip.js/zip.js";
import getFileSize from "@/utils/getFileSize";

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
    const isSingleFile = ref<boolean>(false);
    const totalSize = ref<number>(0);

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
      if (isSingleFile.value && fileList.value.length > 0) {
        alert("如需压缩多文件，可选择多文件压缩");
        return;
      }
      fileList.value = fileList.value.filter((f: any) => f.name !== file.name);
      selectedFileList.value = selectedFileList.value.filter(
        (f: any) => f.name !== file.name
      );
      fileList.value = [...fileList.value, file];
      selectedFileList.value = [...selectedFileList.value, file];
      return false;
    };

    const selectFile = (e: any, file: any) => {
      if (e.target.checked) selectedFileList.value.push(file);
      else
        selectedFileList.value.forEach((f: any, index: number) => {
          if (f.name === file.name) selectedFileList.value.splice(index, 1);
        });

      // console.log(selectedFileList.value, fileList.value);
    };

    const deleteSelected = () => {
      fileList.value = fileList.value.filter((f: any) => {
        if (!selectedFileList.value.includes(f)) return f;
      });
      selectedFileList.value = [];
    };

    const selectAllFiles = (e: any) => {
      selectedFileList.value = e.target.checked ? fileList.value.slice(0) : [];
    };

    const doneSelect = () => {
      if (selectedFileList.value.length <= 0) {
        alert("未选择文件");
        return;
      }

      totalSize.value = 0;

      zipItemFileListRef.value =
        selectedFileList?.value?.map((f: any) => {
          totalSize.value += f.size;
          return { file: f, options: {} };
        }) || [];
      context.emit("doneSelect", {
        zipItemFileList: zipItemFileListRef.value,
        totalSize: getFileSize(totalSize.value),
      });
    };

    watch(isSingleFile, () => {
      fileList.value = [];
      selectedFileList.value = [];
    });

    return {
      fileList,
      beforeUpload,
      zipItemFileListRef,
      doneSelect,
      selectFile,
      selectedFileList,
      selectAllFiles,
      deleteSelected,
      isSingleFile,
      getFileSize,
    };
  },
});
</script>

<style scoped>
.file-selector-container {
  display: flex;
  flex-direction: column;
}
.top-container {
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 200px;
}
.upload-dragger-container {
  flex: 1;
}
.file-list-item {
  align-items: center;
  width: 700px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.file-list-header {
  align-items: center;
  display: flex;
  flex-direction: row;
}
.file-list-header-title {
  margin: 0;
}
.file-list-header-control {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}
.file-list-header-control * {
  margin-left: 10px;
}
</style>

<template>
  <div class="file-selector-container">
    <div class="upload-dragger-container">
      <a-radio-group
        class="zip-type-toggle"
        button-style="solid"
        v-model:value="isSingleFile"
      >
        <a-radio-button :value="false">多文件压缩</a-radio-button>
        <a-radio-button :value="true">单文件压缩</a-radio-button>
      </a-radio-group>
      <div class="upload-dragger-body">
        <a-upload-dragger
          :fileList="fileList"
          :multiple="!isSingleFile"
          :showUploadList="false"
          :before-upload="beforeUpload"
        >
          <div class="upload-dragger-tip">
            <p class="ant-upload-drag-icon">
              <inbox-outlined />
            </p>
            <p>点击或拖拽上传文件</p>
          </div>
        </a-upload-dragger>
      </div>
    </div>
    <div v-if="!isSingleFile" class="file-list-container">
      <a-list size="small" bordered :data-source="fileList">
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <span>{{ getFileSize(item.size) }}</span>
            </template>
            <a-checkbox
              style="overflow: hidden"
              :checked="selectedFileList.includes(item)"
              @change="selectFile($event, item)"
            >
              <span>{{ item.name }}</span>
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
            </div>
          </div>
        </template>
      </a-list>
    </div>
    <div
      v-else-if="isSingleFile && selectedFileList.length !== 0"
      class="single-file-display"
    >
      <div class="single-file-info-display">
        <div>
          {{ selectedFileList[0].name }}
        </div>
        <div>
          {{ getFileSize(selectedFileList[0].size) }}
        </div>
      </div>
      <div class="delete-single">
        <a-button @click="deleteSelected">
          <delete-outlined />删除选中
        </a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { defineComponent, ref, watch } from "vue";
import type { UploadProps } from "ant-design-vue";
import { ZipWriterAddDataOptions } from "@zip.js/zip.js";
import { getFileSize } from "@/utils/utils";

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

    const beforeUpload: UploadProps["beforeUpload"] = (file) => {
      if (isSingleFile.value && fileList.value.length > 0) {
        fileList.value = [];
        selectedFileList.value = [];
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
      if (e.target.checked) {
        selectedFileList.value = [...selectedFileList.value, file];
        return;
      }
      selectedFileList.value.forEach((f: any, index: number) => {
        if (f.name === file.name) selectedFileList.value.splice(index, 1);
        selectedFileList.value = [...selectedFileList.value];
      });
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

    watch(selectedFileList, () => {
      zipItemFileListRef.value =
        selectedFileList?.value?.map((f: any) => ({ file: f, options: {} })) ||
        [];
      context.emit("onFileSelectorChange", {
        zipItemFileList: zipItemFileListRef.value,
        isSingleFile: isSingleFile.value,
      });
    });

    watch(isSingleFile, () => {
      fileList.value = [];
      selectedFileList.value = [];
    });

    return {
      fileList,
      beforeUpload,
      zipItemFileListRef,
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
html,
body {
  padding: 2vh 10vw;
  position: relative;
}

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
.upload-dragger-body {
  margin-bottom: 10px;
  height: 200px;
  border-radius: 2px;
}

.upload-dragger-tip {
  transform: translateY(50%);
  color: #bbb;
}
.zip-type-toggle {
  margin-bottom: 20px;
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
.single-file-display {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 30px;
}
.single-file-info-display {
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 20px;
}
</style>

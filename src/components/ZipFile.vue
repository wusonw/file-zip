<template>
  <div>
    <a-progress
      v-if="isClickedZipButton"
      type="circle"
      :width="120"
      :percent="zipPercentRef"
    />
    <a-form
      v-if="!isSingleFile && !isClickedZipButton"
      :model="formState"
      @finish="onFinish"
      v-bind="formItemLayout"
    >
      <a-form-item name="level" label="压缩比例">
        <a-slider
          :step="10"
          :min="10"
          :max="90"
          v-model:value="formState['level']"
        />
      </a-form-item>

      <a-form-item
        name="fileName"
        label="压缩包名称"
        :rules="[{ required: true, message: '请输入文件名' }]"
      >
        <a-input v-model:value="formState['fileName']">
          <template #addonAfter>
            <a-select v-model:value="zipFileTypeRef" style="width: 80px">
              <a-select-option
                v-for="(item, index) in zipFileTypeListRef"
                :key="item"
                :value="index"
                >{{ item.label }}</a-select-option
              >
            </a-select>
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="password" label="解压密码">
        <a-input-password
          v-model:value="formState['password']"
          placeholder="如需设置解压密码，请输入"
        />
      </a-form-item>

      <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        <a-button type="primary" html-type="submit">开始压缩</a-button>
      </a-form-item>
    </a-form>
    <a-form
      v-else-if="isSingleFile && !isClickedZipButton"
      :model="formState"
      v-bind="formItemLayout"
      @finish="onFinish"
    >
      <a-form-item name="level" label="压缩比例">
        <a-slider
          :step="10"
          :min="10"
          :max="100"
          v-model:value="formState['level']"
        />
      </a-form-item>
      <a-form-item
        name="fileName"
        label="文件名称"
        :rules="[{ required: true, message: '请输入文件名' }]"
      >
        <a-input v-model:value="formState['fileName']">
          <template #addonAfter>
            {{ singleFileNameRef.slice(singleFileNameRef.lastIndexOf(".")) }}
          </template>
        </a-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 6 }">
        <a-button type="primary" html-type="submit">开始压缩</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts">
import { Zip } from "@/utils/Zip";
import { defineComponent, reactive, ref, toRefs, watch } from "vue";

export enum ZipState {
  NOT_START = 0,
  ZIPPING = 1,
  FINISHED = 2,
}

export interface ZipFileInfo {
  originSize?: number | undefined;
  zippedSize?: number | undefined;
  zippedData?: any;
  fileInfo?: {
    name: string;
    password?: string | undefined;
  };
}

export interface ZipFileProp {
  zipState: ZipState;
  zipInfo?: ZipFileInfo;
}

export default defineComponent({
  name: "ZipDownload",
  props: {
    fileList: Array,
    isSingleFile: Boolean,
  },

  setup(props: any, context) {
    context.emit("onZipStateChange", { zipState: ZipState.NOT_START });
    const { fileList, isSingleFile } = toRefs(props);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const showShare = ref<boolean>(false);

    const zipPercentRef = ref<number>(0);
    const zipFileTypeRef = ref<number>(0);
    const zipFileTypeListRef = ref([
      {
        label: ".zip",
        value: "application/zip",
      },
      {
        label: ".tar",
        value: "application/octet-stream",
      },
      {
        label: ".gz",
        value: "application/octet-stream",
      },
      {
        label: ".rar",
        value: "application/octet-stream",
      },
    ]);
    const zipProcessMapRef = ref<any>({});

    watch(zipProcessMapRef, () => {
      if (
        Object.keys(zipProcessMapRef.value).length === fileList.value?.length
      ) {
        let process = 0,
          total = 0;
        Object.keys(zipProcessMapRef.value).forEach((i) => {
          const pro = zipProcessMapRef.value[i];
          process += pro.process;
          total += pro.total;
        });
        zipPercentRef.value = parseInt(
          ((total === 0 ? 0 : process / total) * 100).toString()
        );
        if (zipPercentRef.value === 100) {
          const _zipData = zip.getBlobData();
          const originSize = fileList.value.reduce(
            (pre: number, cur: any) => pre + cur.file.size,
            0
          );
          context.emit("onZipStateChange", {
            zipState: ZipState.FINISHED,
            zipInfo: {
              originSize,
              zippedSize: _zipData.size,
              zippedData: _zipData,
              fileInfo: {
                name: `${formState.fileName}${
                  isSingleFile.value
                    ? singleFileNameRef.value.slice(
                        singleFileNameRef.value.lastIndexOf(".")
                      )
                    : zipFileTypeListRef.value[zipFileTypeRef.value].label ||
                      ".zip"
                }`,
                password: formState.password,
              },
            },
          });
        }
      }
    });

    const singleFileNameRef = ref<string>(fileList.value[0].file.name);

    const formState = reactive<Record<string, any>>({
      level: 30,
      fileName: isSingleFile.value
        ? singleFileNameRef.value.slice(
            0,
            singleFileNameRef.value.lastIndexOf(".")
          )
        : `file_${new Date().getTime()}`,
    });

    const zip = new Zip();
    const isClickedZipButton = ref<boolean>(false);
    const onFinish = async (options: any) => {
      isClickedZipButton.value = true;
      context.emit("onZipStateChange", { zipState: ZipState.ZIPPING });

      zipPercentRef.value = 0;
      (zipProcessMapRef.value = {}),
        (zip.zipOptions = {
          level: options.level / 10,
          password: options.password,
        });
      zip.mimeString = zipFileTypeListRef.value[zipFileTypeRef.value].value;

      await Promise.all(
        fileList?.value?.map((f: any, index: number) =>
          zip.addFile(f.file, {
            ...f.options,
            onprogress: (process, total) => {
              zipProcessMapRef.value = {
                ...zipProcessMapRef.value,
                [index]: {
                  process,
                  total,
                },
              };
            },
          })
        ) || []
      );
      // console.log(getfilesize(zip.getBlobData().size));
    };

    return {
      formState,
      onFinish,
      formItemLayout,
      zipPercentRef,
      zipFileTypeRef,
      zipFileTypeListRef,
      zip,
      singleFileNameRef,
      showShare,
      isClickedZipButton,
    };
  },
});
</script>

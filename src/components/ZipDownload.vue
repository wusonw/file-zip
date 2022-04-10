<template>
  <a-modal
    :visible="visible"
    width="800px"
    title="压缩参数设置"
    @cancel="closeModal"
    :footer="null"
  >
    <a-form
      :model="formState"
      name="validate_other"
      v-bind="formItemLayout"
      @finish="onFinish"
    >
      <a-progress style="width: 80%" :percent="zipPercentRef" />
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
                v-for="item in zipFileTypeListRef"
                :key="item.value"
                :value="item.value"
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
        <a-button type="primary" html-type="submit">下载到本地</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script lang="ts">
import { Zip } from "@/utils/Zip";
import { defineComponent, reactive, ref, toRefs } from "vue";

export default defineComponent({
  name: "ZipDownload",
  props: {
    fileList: Array,
    visible: Boolean,
  },

  setup(props, context) {
    // console.log(props);
    const { fileList, visible } = toRefs(props);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const zipPercentRef = ref<number>(0);
    const zipFileTypeRef = ref("application/zip");
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

    const formState = reactive<Record<string, any>>({
      level: 10,
      fileName: "file_" + new Date().getTime(),
    });
    const onFinish = async (options: any) => {
      // console.log("onFinish", options);

      zipPercentRef.value = 0;
      const zip = new Zip({
        zipOptions: {
          level: options.level / 10,
          password: options.password,
        },
        mimeString: zipFileTypeRef.value,
      });
      const fileZipArray =
        fileList?.value?.map((f: any) => ({ ...f, _total: 0, _process: 0 })) ||
        [];
      console.log(fileZipArray);

      fileList?.value?.map((f: any) => ({
        ...f,
        _total: 0,
        _process: 0,
      })) || [];

      await Promise.all(
        fileZipArray.map((f: any) =>
          zip.addFile(f.file, {
            ...f.options,
            onprogress: (pro, total) => {
              f._total = total;
              f._process = pro;
              let fileProcess = 0,
                fileTotal = 0;
              fileZipArray.forEach((file) => {
                fileTotal += file._total;
                fileProcess += file._process;
              });

              zipPercentRef.value = parseInt(
                (
                  (fileTotal === 0 ? 0 : fileProcess / fileTotal) * 100
                ).toString()
              );
            },
          })
        ) || []
      );
      await zip.save({
        fileName: `${options.fileName}${
          zipFileTypeListRef.value.find(
            (item) => item.value === zipFileTypeRef.value
          )?.label || ".zip"
        }`,
      });

      closeModal();
    };

    const closeModal = () => {
      context.emit("closeModal");
      zipPercentRef.value = 0;
    };

    return {
      formState,
      onFinish,
      formItemLayout,
      zipPercentRef,
      zipFileTypeRef,
      zipFileTypeListRef,
      closeModal,
    };
  },
});
</script>

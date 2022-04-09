<template>
  <a-form
    :model="formState"
    name="validate_other"
    v-bind="formItemLayout"
    @finish="onFinish"
  >
    <a-form-item name="level" label="压缩比例">
      <a-slider v-model:value="formState['level']" />
    </a-form-item>

    <a-form-item
      name="fileName"
      label="压缩包名称"
      :rules="[{ required: true, message: '请输入文件名' }]"
    >
      <a-input v-model:value="formState['fileName']">
        <template #addonAfter>
          <a-select v-model:value="formState['type']" style="width: 80px">
            <a-select-option value=".zip">.zip</a-select-option>
            <a-select-option value=".tar">.tar</a-select-option>
            <a-select-option value=".gz">.gz</a-select-option>
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
</template>
<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  setup(props,context) {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const formState = reactive<Record<string, any>>({
      level: 10,
      type: ".zip",
      fileName: "file_" + new Date().getTime(),
    });
    const onFinish = (options: any) => {
      context.emit("saveFile", formState);
    };

    return {
      formState,
      onFinish,
      formItemLayout,
    };
  },
});
</script>


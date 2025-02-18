<!--
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
-->
<template>
  <span class="page-debugger">
    <el-button type="primary" :circle="true" title="Schema Json Editor" @click="openSchemaEditor">S</el-button>
    <el-button type="danger" :circle="true" title="Page Visual Designer" v-if="path" danger
      @click="openXuiPageEditor">V</el-button>
  </span>

  <el-dialog v-model="schemaVisible" title="Page Schema" width="600px" :height="500" :center="true" class="debug-modal"
    :mask="false" :maskClosable="false" :draggable="true" :footer="null" :append-to-body="true" destroyOnClose>
    <AmisSchemaPage :schema="debuggerSchema" :actions="schemaActions" :data="schemaData" />
  </el-dialog>

  <el-dialog :destroyOnClose="true" class="page-full-screen" v-model="designerVisible" :maskClosable="false"
    :append-to-body="true" width="100%" height="100%" :align-center="true" :fullscreen="true" :footer="null"
    :closable="false" :keyboard="false">
    <header></header>
    <XuiPageEditor :path="path" @exit="handleEditorExit" />
  </el-dialog>
</template>

<style>
.page-full-screen .el-dialog__body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.page-full-screen .el-dialog__header {
  display: none
}

.page-debugger {
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 100;
}
</style>

<script lang="ts" setup>
import { shallowRef, ref } from 'vue';
import { ElDialog, ElButton } from 'element-plus';

import AmisSchemaPage from './AmisSchemaPage';
import debuggerSchema from './debugger';
import yaml from 'js-yaml';

import XuiPageEditor from './XuiPageEditor.vue';

const props = defineProps({
  path: {
    type: String,
    required:true,
  },
  schema: Object,
});

const emit = defineEmits(['update:schema', 'rebuild']);

const schemaVisible = ref(false);

const schemaData = shallowRef({
  schema: '',
  lang: 'json',
});

function openSchemaEditor() {
  schemaData.value = { schema: yaml.dump(props.schema), lang: 'yaml' };
  schemaVisible.value = true
}

const schemaActions: Record<string, Function> = {
  "ok": handleOk,
  "cancel": handleCancel,
  "change": handleChange,
  "rebuild": handleRebuild,
  "toggleYaml": handleToggleYaml,
}

function handleChange(options: any) {
  const data = options.data
  let json = schemaData.value.lang == 'yaml' ? yaml.load(data.schema) : JSON.parse(data.schema);
  emit('update:schema', json);
}

function handleOk(data: any) {
  handleChange(data);
  schemaVisible.value = false
}

function handleCancel() {
  schemaVisible.value = false
}

function handleRebuild() {
  emit('rebuild');
}

function handleToggleYaml(options: any) {
  let schema = options.data.schema;
  if (options.data.lang == 'yaml') {
    schemaData.value = { lang: 'json', schema: JSON.stringify(yaml.load(schema), null, '  ') };
  } else {
    schemaData.value = { lang: 'yaml', schema: yaml.dump(JSON.parse(schema)) };
  }
}

const designerVisible = ref(false);

function openXuiPageEditor() {
  designerVisible.value = true;
}

function handleEditorExit() {
  designerVisible.value = false;
}

</script>

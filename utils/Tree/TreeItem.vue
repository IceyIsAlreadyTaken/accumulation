<template>
  <li class="tree-item">
    <div class="vertical-line"></div>
    <div class="horizontal-line"></div>
    <div class="line-wrapper">
      <template v-if="props.dataItem.children && props.dataItem.children.length">
        <mtd-icon v-if="props.dataItem.folded" name="add-square-fill" @click="expand"></mtd-icon>
        <mtd-icon v-else name="checkbox-indetermina" @click="collapse"></mtd-icon>
      </template>

      <mtd-input :model-value="props.dataItem.paramName" @input="changeValue('paramName', $event)"></mtd-input>

      <mtd-input :model-value="props.dataItem.label" @change="changeValue('label', $event)"></mtd-input>

      <mtd-radio-group :model-value="props.dataItem.required" @change="changeValue('required', $event)">
        <mtd-radio :value="true">必填</mtd-radio>
        <mtd-radio :value="false">非必填</mtd-radio>
      </mtd-radio-group>
    </div>

    <ul v-if="props.dataItem.children && props.dataItem.children.length && !props.dataItem.folded" class="sub-tree">
      <TreeItem
        v-for="(item, index) in props.dataItem.children"
        :key="index"
        :data-item="item"
        :click-event="props.clickEvent"
        :change-data="props.changeData"
        style="margin-left: 50px"
      ></TreeItem>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

const emit = defineEmits(['click', 'update:dataItem']);

const props = defineProps({
  dataItem: {
    type: Object as PropType<IDataItem>,
    required: true,
  },
  clickEvent: {
    type: Function as PropType<(data: IDataItem) => void>,
    required: true,
  },
  changeData: {
    type: Function as PropType<(data: IDataItem, key: keyof IDataItem, value: IDataItem[keyof IDataItem]) => void>,
    required: true,
  },
});

function expand() {
  props.clickEvent(props.dataItem);
}

function collapse() {
  props.clickEvent(props.dataItem);
}

function changeValue(key: keyof IDataItem, value: IDataItem[keyof IDataItem]) {
  console.log('changeValue=>>>>', key, value);
  props.changeData(props.dataItem, key, value);
}

// function changeValue(key: string, value: unknown) {
//   console.log('changeValue=>>>>', key, value);
//   props.changeData(props.dataItem, key, value);
// }
</script>

<style lang="scss" scoped>
.tree-item {
  background: #f9fafc;
  border-radius: 6px;
  position: relative;

  .line-wrapper {
    margin-bottom: 10px;
  }

  .sub-tree {
    .vertical-line {
      position: absolute;
      height: calc(100% + 10px);
      border: 1px dashed #dcdddf;
      top: -24px;
      left: -44px;
    }
    .horizontal-line {
      position: absolute;
      width: 44px;
      border-bottom: 1px dashed #dcdddf;
      left: -44px;
      top: 18px;
    }
  }
}

.tree-item:last-child {
  .vertical-line {
    position: absolute;
    height: 36px;
    border: 1px dashed #dcdddf;
    top: -21px;
    left: -44px;
  }
}
</style>

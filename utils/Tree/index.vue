<template>
  <div class="page-content">
    <ul v-for="(tree, index) in treeData" :key="index" class="vue-tree">
      <TreeItem
        v-for="(subTree, subIndex) in tree.children"
        :key="subIndex"
        :data-item="subTree"
        :click-event="handleClickEvent"
        :change-data="changeData"
      ></TreeItem>
    </ul>
    <mtd-button type="primary" @click="submit">确认</mtd-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import TreeItem from './components/TreeItem.vue';

const treeData = reactive<IDataItem[]>([
  {
    paramName: 'tree',
    label: 'tree',
    required: false,
    description: '根组件',
    children: [
      {
        paramName: 'value1',
        label: '1',
        required: true,
        description: '1',
        children: [
          {
            paramName: 'value11',
            label: '1-1',
            required: true,
            description: '1-1',
            children: [
              {
                paramName: 'value111',
                label: '1-1-1',
                required: true,
                description: '1-1-1',
                children: [
                  {
                    paramName: 'value1111',
                    label: '1-1-1-1',
                    required: true,
                    description: '1-1-1-1',
                    children: [
                      {
                        paramName: 'value11111',
                        label: '1-1-1-1-1',
                        required: true,
                        description: '1-1-1-1-1',
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                paramName: 'value112',
                label: '1-1-2',
                required: true,
                description: '1-1-2',
                children: [
                  {
                    paramName: 'value1121',
                    label: '1-1-2-1',
                    required: true,
                    description: '1-1-2-1',
                    children: [
                      {
                        paramName: 'value11211',
                        label: '1-1-2-1-1',
                        required: true,
                        description: '1-1-2-1-1',
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            paramName: 'value12',
            label: '1-2',
            required: true,
            description: '1-2',
            children: [],
          },
        ],
      },
      {
        paramName: '2',
        label: '2',
        required: false,
        description: '2',
        children: [],
      },
    ],
  },
]);

function handleClickEvent(item: IDataItem) {
  item.folded = !item.folded;
}

function changeData(item: IDataItem, key: keyof IDataItem, value: IDataItem[keyof IDataItem]) {
  item[key] = value;
}

function submit() {
  console.log('treeData=>>>', treeData);
}
</script>

<style lang="scss" scoped>
.page-content {
  padding: 20px;
}

.vue-tree {
  list-style: none;
  padding: 0;
  margin-bottom: 10px;
}
</style>

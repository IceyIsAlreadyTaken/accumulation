<template>
  <mtd-modal
    :visible="visible"
    :destroy-on-close="true"
    :mount-on-create="false"
    :title="data ? '编辑监控台' : '新增监控台'"
    width="900px"
    @close="cancel"
    @closed="modalClose"
  >
    <mtd-form ref="form" :label-width="100" :model="formData" :rules="ruleCustom">
      <mtd-form-item label="名称：" prop="name">
        <mtd-input v-model="formData.name" type="text" :class="$style.width100" />
      </mtd-form-item>
      <mtd-form-item label="租户名称：" prop="tenantId">
        <tenant-select v-model="formData.tenantId" clearable :class="$style.width100" />
      </mtd-form-item>
      <mtd-form-item label="维度：" prop="dimensionTypeList">
        <mtd-checkbox-group v-model="formData.dimensionTypeList">
          <mtd-checkbox v-for="[code, name] in Object.entries(DimensionTypeEnum)" :key="code" :value="code">
            {{ name }}
          </mtd-checkbox>
        </mtd-checkbox-group>
      </mtd-form-item>
      <mtd-form-item label="粒度：" prop="monitorSize">
        <mtd-select v-model="formData.monitorSize" :class="$style.width100">
          <mtd-option v-for="item in MonitorSizeMap" :key="item[1]" :label="item[0]" :value="item[1]" />
        </mtd-select>
      </mtd-form-item>
      <mtd-form-item label="预警配置：" prop="ruleGroups">
        <div v-for="(ruleGroup, ruleGroupIdx) in formData.ruleGroups" :key="ruleGroupIdx">
          <mtd-form-item label="触发条件：" :label-width="95">
            <mtd-table :data="ruleGroup.ruleList">
              <mtd-table-column prop="ruleList.ruleQuote" label="预警指标" width="120">
                <template slot-scope="scope">
                  <mtd-form-item
                    :prop="'ruleGroups.' + ruleGroupIdx + '.ruleList.' + scope.$index + '.ruleQuote'"
                    :rules="ruleCustom['ruleList.ruleQuote']"
                  >
                    <mtd-select v-model="scope.row.ruleQuote" :class="$style.width100" clearable>
                      <mtd-option v-for="item in QuotaEnum" :key="item[1]" :label="item[0]" :value="item[1]" />
                    </mtd-select>
                  </mtd-form-item>
                </template>
              </mtd-table-column>
              <mtd-table-column prop="ruleComparatorPeriod" label="对比方式" width="150">
                <template slot-scope="scope">
                  <mtd-form-item
                    :prop="'ruleGroups.' + ruleGroupIdx + '.ruleList.' + scope.$index + '.ruleComparatorPeriod'"
                    :rules="ruleCustom['ruleList.ruleComparatorPeriod']"
                  >
                    <mtd-select v-model="scope.row.ruleComparatorPeriod" :class="$style.width100" clearable>
                      <mtd-option label="当前值" :value="0" />
                      <mtd-option label="上个窗口期" :value="1" />
                    </mtd-select>
                  </mtd-form-item>
                </template>
              </mtd-table-column>
              <mtd-table-column prop="ruleComparator" label="对比符" width="150">
                <template slot-scope="scope">
                  <mtd-form-item
                    :prop="'ruleGroups.' + ruleGroupIdx + '.ruleList.' + scope.$index + '.ruleComparator'"
                    :rules="ruleCustom['ruleList.ruleComparator']"
                  >
                    <mtd-select v-model="scope.row.ruleComparator" :class="$style.width100" clearable>
                      <mtd-option
                        v-for="item in ComparatorEnum"
                        :key="item[1]"
                        :label="item[0]"
                        :value="item[1]"
                        :disabled="getComparatorDisable(item, scope.row)"
                      />
                    </mtd-select>
                  </mtd-form-item>
                </template>
              </mtd-table-column>
              <mtd-table-column prop="ruleComparatorValue" label="变化值" width="120">
                <template slot-scope="scope">
                  <mtd-form-item
                    :prop="'ruleGroups.' + ruleGroupIdx + '.ruleList.' + scope.$index + '.ruleComparatorValue'"
                    :rules="ruleCustom['ruleList.ruleComparatorValue']"
                  >
                    <mtd-input
                      v-model="scope.row.ruleComparatorValue"
                      :controls="false"
                      :precision="0"
                      :class="$style.width100"
                    >
                      <template
                        v-if="
                          scope.row.ruleComparator === ComparatorEnum.get('上升相对值') ||
                          scope.row.ruleComparator === ComparatorEnum.get('下降相对值') ||
                          scope.row.ruleQuote === QuotaEnum.get('接通率')
                        "
                        slot="append"
                      >
                        %
                      </template>
                    </mtd-input>
                  </mtd-form-item>
                </template>
              </mtd-table-column>
              <mtd-table-column prop="status" label="状态" width="140">
                <template slot-scope="scope">
                  <mtd-form-item
                    :prop="'ruleGroups.' + ruleGroupIdx + '.ruleList.' + scope.$index + '.status'"
                    :rules="ruleCustom['ruleList.status']"
                  >
                    <mtd-radio-group v-model="scope.row.status" size="small" :class="$style.width100">
                      <mtd-radio :value="1">启用</mtd-radio>
                      <mtd-radio :value="0">禁用</mtd-radio>
                    </mtd-radio-group>
                  </mtd-form-item>
                </template>
              </mtd-table-column>

              <mtd-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <mtd-button type="primary" size="small" @click="deleteRule(ruleGroupIdx, scope.$index)">
                    删除
                  </mtd-button>
                </template>
              </mtd-table-column>
            </mtd-table>

            <div :class="$style.addTableRow">
              <mtd-button
                v-bind="$attrs"
                :dashed="true"
                :class="$style.addRowBtn"
                icon="mtdicon mtdicon-add"
                @click="addRule(ruleGroupIdx)"
              >
                添加条件
              </mtd-button>
            </div>
          </mtd-form-item>
          <mtd-form-item
            label="适用时段："
            :prop="'ruleGroups.' + ruleGroupIdx + '.monitorPeriod'"
            :class="$style.width100"
            :rules="ruleCustom['ruleGroups.monitorPeriod']"
            :label-width="95"
          >
            <my-time-picker
              v-model="ruleGroup.monitorPeriod[0]"
              :max-time="ruleGroup.monitorPeriod[1]"
              type="time"
              placeholder="开始时间"
              style="display: inline-block; width: 180px"
              format="HH:mm"
            />
            -
            <my-time-picker
              v-model="ruleGroup.monitorPeriod[1]"
              :min-time="ruleGroup.monitorPeriod[0]"
              type="time"
              placeholder="结束时间"
              style="display: inline-block; width: 180px"
              format="HH:mm"
            />
          </mtd-form-item>
        </div>
        <div :class="$style.addRuleGroup">
          <mtd-button class="btn-demo-item" type="text" icon="mtdicon mtdicon-file-add-o" @click="addRuleGroup">
            添加规则组
          </mtd-button>
          <span>(规则组之间为【或】关系)</span>
        </div>
      </mtd-form-item>
      <mtd-form-item label="预警接收人" prop="postUidList">
        <mis-select
          v-model="formData.postUidList"
          :class="$style.width100"
          init-type="userId"
          :init-users="formData.postUidList"
          clearable
          multiple
          placeholder="请输入"
        />
      </mtd-form-item>
    </mtd-form>
    <div slot="footer">
      <mtd-button @click="cancel">取消</mtd-button>
      <mtd-button type="primary" @click="submit">确定</mtd-button>
    </div>
  </mtd-modal>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { DimensionTypeEnum, MonitorSizeMap } from '@/common/operation';
import { format } from '@/utils/index';

@Component({
  name: 'AddSystemMonitor',
})
export default class AddSystemMonitor extends Vue {
  @Prop() visible: boolean;
  @Prop() data: Api.SystemMonitorData | null;
  // 系统监控-监控维度枚举
  DimensionTypeEnum = DimensionTypeEnum;

  // 系统监控-监控指标枚举

  QuotaEnum = new Map([
    ['拨打数', 'callCount'],
    ['接通数', 'answerCount'],
    ['接通率', 'answerRate'],
  ]);

  MonitorSizeMap = MonitorSizeMap;

  ComparatorEnum = new Map([
    ['下降相对值', 0],
    ['上升相对值', 1],
    ['大于等于', 2],
    ['小于等于', 3],
    ['等于', 4],
    ['下降了', 5],
    ['上升了', 6],
  ]);

  formData: Api.SystemMonitorData = {} as Api.SystemMonitorData;
  ruleCustom = {
    name: {
      required: true,
      message: '必填',
    },
    tenantId: {
      required: true,
      message: '必填',
    },
    dimensionTypeList: {
      required: true,
      message: '必填',
    },
    monitorSize: {
      required: true,
      message: '必填',
    },
    'ruleGroups.monitorPeriod': {
      required: true,
      message: '必填',
      validator(rule: any, value: Date[], callback: Function) {
        if (!value || value.length < 2) {
          return callback(new Error('必填'));
        }
        return callback();
      },
    },
    'ruleList.ruleQuote': {
      required: true,
      message: '必填',
    },
    'ruleList.ruleComparatorPeriod': {
      required: true,
      message: '必填',
    },
    'ruleList.ruleComparatorValue': {
      required: true,
      message: '必填',
    },
    'ruleList.ruleComparator': {
      required: true,
      message: '必填',
    },

    'ruleList.status': {
      required: true,
      message: '必填',
    },
  };

  @Watch('data', { immediate: true })
  onDataChange(newVal: Api.SystemMonitorData) {
    if (newVal) {
      const { ruleGroups } = newVal;
      this.formData = {
        ...newVal,
        ruleGroups: ruleGroups.map((item) => {
          return {
            ...item,
            monitorPeriod: item.monitorPeriod.map((time) => new Date(`1970.1.1 ${time}`)),
          };
        }),
      };
    } else {
      this.initFormData();
    }
  }

  initFormData() {
    this.formData = {
      name: '',
      tenantId: '',
      dimensionTypeList: [],
      monitorSize: 0,
      ruleGroups: [
        {
          ruleList: [
            {
              ruleQuote: '',
              ruleComparator: null,
              ruleComparatorPeriod: null,
              ruleComparatorValue: null,
              status: 1,
            },
          ],
          monitorPeriod: [new Date(1970, 0, 1), new Date(1970, 0, 1, 23, 59, 0)],
        },
      ],
      postUidList: [],
    };
  }

  addRule(index: number) {
    this.formData.ruleGroups[index].ruleList.push({
      ruleQuote: '',
      ruleComparator: null,
      ruleComparatorPeriod: null,
      ruleComparatorValue: null,
      status: 1,
    });
  }

  deleteRule(ruleGroupIdx: number, ruleIdx: number) {
    this.formData.ruleGroups[ruleGroupIdx].ruleList.splice(ruleIdx, 1);
    if (!this.formData.ruleGroups[ruleGroupIdx].ruleList.length) {
      this.formData.ruleGroups.splice(ruleGroupIdx, 1);
    }
  }

  addRuleGroup() {
    this.formData.ruleGroups.push({
      ruleList: [
        {
          ruleQuote: '',
          ruleComparator: null,
          ruleComparatorPeriod: null,
          ruleComparatorValue: null,
          status: 1,
        },
      ],
      monitorPeriod: [new Date(1970, 0, 1), new Date(1970, 0, 1, 23, 59, 0)],
    });
  }

  submit() {
    (this.$refs.form as Api.VForm).validate((valid) => {
      if (valid) {
        const { ruleGroups } = this.formData;
        const data = {
          ...this.formData,
          ruleGroups: ruleGroups.map((item) => {
            return {
              ...item,
              monitorPeriod: item.monitorPeriod.map((time) => format(time, 'HH:mm')),
            };
          }),
        };

        this.$emit('submit', data);
      }
    });
  }

  cancel() {
    this.$emit('update:visible', false);
  }

  modalClose() {
    this.initFormData();
  }

  getComparatorDisable(item: [string, number], rule: Api.RuleItem) {
    if (
      (item[1] === this.ComparatorEnum.get('上升相对值') || item[1] === this.ComparatorEnum.get('下降相对值')) &&
      rule.ruleComparatorPeriod === 0
    ) {
      return true;
    }
    if (
      (item[1] === this.ComparatorEnum.get('上升了') || item[1] === this.ComparatorEnum.get('下降了')) &&
      rule.ruleComparatorPeriod === 1
    ) {
      return true;
    }
    return false;
  }
}
</script>

<style lang="scss" module>
.add-table-row {
  width: 100%;
  margin: 10px 0;

  .add-row-btn {
    width: 100%;
  }
}

.add-rule-group {
  :global(.mtd-btn) {
    color: #0a70f5;
    line-height: 32px;
    height: 32 px;
  }
}

.width100 {
  width: 100% !important;
}
</style>

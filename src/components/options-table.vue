<template>
  <div class="q-gutter-y-md">
    <div class="row">
      <q-input
        v-model="textValue"
        :label="inputLabel"
        class="col"
        @keypress.prevent.enter="onAddClick"
      ></q-input>
      <q-btn
        color="primary"
        icon="add"
        @click="onAddClick"
        :disabled="!textValue"
        class="col col-grow offset-1"
      ></q-btn>
    </div>
    <q-table :columns="columns" :rows="modelValue" :title="tableTitle" :rows-per-page-options="[0]">
      <template #body-cell-actions="props">
        <q-td :props="props">
          <div>
            <q-btn color="primary" icon="delete" @click="onDeleteLinkClick(props.row)" />
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import { type QInput, type QTableColumn } from 'quasar';
import { onMounted } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';

export type TOption = {
  value: string;
};

type TProps = {
  modelValue: TOption[];
  inputLabel: string;
  tableTitle: string;
  validate?: (value: string) => Promise<boolean>;
};

type TEmits = {
  'update:modelValue': [nextValue: TOption[]];
};

const props = defineProps<TProps>();
const emits = defineEmits<TEmits>();

const textValue = ref('');

const columns = computed<QTableColumn<TOption>[]>(() => [
  {
    label: 'Значение',
    name: 'value',
    align: 'left',
    field: (row) => row.value,
  },
  {
    label: ' ',
    name: 'actions',
    field: () => null,
  },
]);

const onAddClick = async () => {
  if (!textValue.value) return;
  const isValid = (await props.validate?.(textValue.value)) ?? true;

  if (!isValid) return;
  const nextOptions = [...props.modelValue, { value: textValue.value }];
  textValue.value = '';
  emits('update:modelValue', nextOptions);
};

const onDeleteLinkClick = (row: TOption) => {
  emits(
    'update:modelValue',
    props.modelValue.filter((link) => link.value !== row.value),
  );
};

onMounted(() => {
  // inputNativeElement.value?.addEventListener('keypress', onKeyPress);
});
</script>

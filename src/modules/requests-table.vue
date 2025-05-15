<template>
  <div>
    <q-table
      :loading="isLoading"
      :columns="columns"
      :rows="requests"
      v-model:pagination="pagination"
      title="Таблица запросов"
      :rows-per-page-options="[0]"
      @request="onRequest"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <div class="q-gutter-md">
            <q-btn color="primary" icon="delete" @click="onRequestDelete(props.row)" />
            <q-btn color="primary" icon="edit" :to="`/requests/edit/${props.row.id}`" />
          </div>
        </q-td>
      </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" to="/requests/add" />
    </q-page-sticky>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar, type QTableColumn, type QTableProps } from 'quasar';
import { getBasePaginationProps } from 'src/lib/helpers/table-helpers';
import { useRequestsStore } from 'src/stores/requests-store';
import { type TRequest } from 'src/stores/requests-store';

const $q = useQuasar();
const pagination = ref(getBasePaginationProps());
const isLoading = ref(false);
const requests = ref<TRequest[]>([]);
const requestStore = useRequestsStore();
const columns = computed<QTableColumn<TRequest>[]>(() => [
  {
    name: 'id',
    label: 'ID',
    align: 'left',
    field: (row) => row.id,
  },
  {
    name: 'name',
    label: 'Название',
    align: 'left',
    field: (row) => row.name,
  },
  {
    name: 'social',
    label: 'Социальная сеть',
    align: 'left',
    field: (row) => row.social,
  },
  {
    name: 'links',
    label: 'Количество ссылок',
    align: 'left',
    field: (row) => row.links.length,
  },
  {
    name: 'contexts',
    label: 'Количество контекстов',
    align: 'left',
    field: (row) => row.contexts.length,
  },
  {
    name: 'actions',
    label: '',
    align: 'right',
    field: (row) => row,
  },
]);

const onRequestDelete = (row: TRequest) => {
  $q.dialog({
    title: 'Подтвердите действие',
    ok: { color: 'negative', label: 'Удалить' },
    cancel: { label: 'Отменить', color: 'primary' },
    message: `Вы уверены, что хотите удалить запрос "${row.name}"?`,
  }).onOk(() => {
    $q.loading.show();
    void requestStore.deleteRequest(row.id).then((data) => {
      $q.loading.hide();
      if (data.isSuccess) {
        $q.notify({ message: `Запрос "${row.name}" успешно удален!`, type: 'positive' });
        pagination.value = getBasePaginationProps();
        void getRequests();
      }
    });
  });
};

const onRequest: QTableProps['onRequest'] = (props) => {
  console.log(props);
};

const getRequests = async () => {
  isLoading.value = true;
  const data = await requestStore.getRequests(
    pagination.value?.page ?? 0,
    pagination.value?.rowsPerPage ?? 0,
  );
  isLoading.value = false;

  requests.value = data?.list || [];
};

onMounted(() => {
  void getRequests();
});
</script>

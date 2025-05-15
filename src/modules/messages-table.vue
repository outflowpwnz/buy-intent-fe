<template>
  <div>
    <q-table
      :loading="isLoading"
      :columns="columns"
      :rows="messages"
      v-model:pagination="pagination"
      title="Таблица сообщений"
      :rows-per-page-options="[0]"
      @request="onRequest"
    >
      <template #body-cell-actions="props">
        <q-td :props="props">
          <div class="q-gutter-md">
            <q-btn
              color="primary"
              icon="check"
              @click="onCheckMessage(props.row)"
              v-if="!isWorkedOut"
            />
            <q-btn
              color="primary"
              icon="link"
              :href="`https://t.me/${props.row.link.url}/${props.row.userMessageId}`"
              target="blank"
            />
            <q-btn
              color="primary"
              icon="person"
              :href="`https://t.me/${props.row.userName}`"
              target="blank"
            />
          </div>
        </q-td>
      </template>
    </q-table>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar, type QTableColumn, type QTableProps } from 'quasar';
import { getBasePaginationProps } from 'src/lib/helpers/table-helpers';
import { type TMessage, useMessagesStore } from 'src/stores/messages-store';
import { onBeforeUnmount } from 'vue';

type TProps = {
  isWorkedOut: boolean;
  isPaginationDisabled?: boolean;
};

const REFETCH_DELAY = 5000;
const $q = useQuasar();
const props = defineProps<TProps>();
const refetchInterval = ref<ReturnType<typeof setInterval>>();
const pagination = ref(getBasePaginationProps(props.isPaginationDisabled));
const isLoading = ref(false);
const messages = ref<TMessage[]>([]);
const messagesStore = useMessagesStore();
const columns = computed<QTableColumn<TMessage>[]>(() => [
  {
    name: 'id',
    label: 'ID',
    align: 'left',
    field: (row) => row.id,
  },
  {
    name: 'name',
    label: 'Название запросе',
    align: 'left',
    field: (row) => row.request.name,
  },
  {
    name: 'userName',
    label: 'Имя пользователя',
    align: 'left',
    field: (row) => row.userName,
  },
  {
    name: 'userMessage',
    label: 'Сообщение пользователя',
    align: 'left',
    field: (row) => row.userMessage,
  },
  {
    name: 'actions',
    label: '',
    align: 'right',
    field: (row) => row,
  },
]);

const onRequest: QTableProps['onRequest'] = (props) => {
  console.log(props);
};

const onCheckMessage = (row: TMessage) => {
  $q.dialog({
    title: 'Подтвердите действие',
    ok: { color: 'positive', label: 'Отработать' },
    cancel: { label: 'Отменить', color: 'primary' },
    message: `Вы уверены, что хотите отработать сообщение "${row.userMessage}" от "${row.userName}"?`,
  }).onOk(() => {
    $q.loading.show();
    void messagesStore.editMessage({ id: row.id }).then((data) => {
      $q.loading.hide();
      if (data.id) {
        $q.notify({
          message: `Cообщение "${row.userMessage}" от "${row.userName} успешно отработано!`,
          type: 'positive',
        });
        pagination.value = getBasePaginationProps(props.isPaginationDisabled);
        void getMessages();
      }
    });
  });
};

const getMessages = async () => {
  isLoading.value = true;
  const data = await messagesStore.getMessages(
    props.isWorkedOut,
    props.isPaginationDisabled ? null : (pagination.value?.page ?? null),
    props.isPaginationDisabled ? null : (pagination.value?.rowsPerPage ?? null),
  );
  isLoading.value = false;

  messages.value = data?.list || [];
};

onMounted(() => {
  void getMessages();

  if (props.isPaginationDisabled) {
    refetchInterval.value = setInterval(() => {
      void getMessages();
    }, REFETCH_DELAY);
  }
});

onBeforeUnmount(() => {
  if (refetchInterval.value) {
    clearInterval(refetchInterval.value);
  }
});
</script>

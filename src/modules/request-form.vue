<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <h2 class="text-h5">{{ title }}</h2>
    <q-input filled label="Название *" v-model="name" lazy-rules :rules="[requiredRule]"></q-input>
    <q-select
      filled
      label="Социальная сеть для поиска"
      v-model="selectedSocial"
      :options="socialOptions"
    ></q-select>
    <options-table
      inputLabel="Введите ссылку на открытый чат"
      tableTitle="Таблица ссылок на открытые чаты"
      :validate="validateLink"
      v-model="preparedLinks"
    />
    <options-table
      inputLabel="Введите текст искомого контекста (например: покупка цветов)"
      tableTitle="Таблица контекста"
      v-model="contexts"
    />
    <q-btn color="primary" type="submit" icon="save">Сохранить</q-btn>
  </q-form>
</template>

<script setup lang="ts">
import { useQuasar, type QSelectOption } from 'quasar';
import OptionsTable, { type TOption } from 'src/components/options-table.vue';
import { requiredRule } from 'src/lib/helpers/input-helpers';
import {
  ESocial,
  type TLinkOptionalId,
  type TContextOptionalId,
  useRequestsStore,
} from 'src/stores/requests-store';
import { useLinkStore } from 'src/stores/link-store';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

type Props = {
  id: number | null;
};

const props = defineProps<Props>();

const router = useRouter();
const $q = useQuasar();
const requestStore = useRequestsStore();
const linkStore = useLinkStore();
const socialOptions = computed<QSelectOption[]>(() => [
  { label: 'Telegram', value: ESocial.TELEGRAM },
]);

const selectedSocial = ref(socialOptions.value[0]);
const isLoading = ref(false);
const name = ref('');
const links = ref<TLinkOptionalId[]>([]);
const contexts = ref<TContextOptionalId[]>([]);
const isEdit = computed(() => Boolean(props.id));

const title = computed(() => (isEdit.value ? 'Редактирование запроса' : 'Создание запроса'));

const addRequest = async () => {
  isLoading.value = true;
  const data = await requestStore.addRequest({
    links: links.value,
    name: name.value,
    social: (selectedSocial.value?.value || ESocial.TELEGRAM) as ESocial,
    contexts: contexts.value,
  });
  isLoading.value = false;

  if (data.id) {
    $q.notify({ message: 'Запрос успешно создан', type: 'positive' });
    void router.push('/requests');
  }
};

const validateLink = async (link: string) => {
  const isUnique = !links.value.some(({ url }) => url === link);

  if (!isUnique) {
    $q.notify({ message: 'Такой чат уже добавлен', type: 'negative' });

    return !isUnique;
  }

  $q.loading.show();
  const data = await linkStore.checkChatExist({ url: link });
  $q.loading.hide();
  const isValid = !!data.isChatExist;
  if (!isValid) {
    $q.notify({ message: 'Такой чат не существует', type: 'negative' });
  }
  return isValid;
};

const editRequest = async () => {
  if (!props.id) return;

  isLoading.value = true;
  const data = await requestStore.editRequest({
    id: props.id,
    links: links.value,
    name: name.value,
    social: (selectedSocial.value?.value || ESocial.TELEGRAM) as ESocial,
    contexts: contexts.value,
  });
  isLoading.value = false;

  if (data.id) {
    $q.notify({ message: 'Запрос успешно отредактирован', type: 'positive' });
    void router.push('/requests');
  }
};

const onSubmit = () => {
  if (isEdit.value) {
    void editRequest();
  } else {
    void addRequest();
  }
};

const preparedLinks = computed({
  get: () => {
    return links.value.map((link) => ({ ...link, value: link.url }));
  },
  set: (nextOptions: TOption[]) => {
    links.value = nextOptions.map((option) => ({ ...option, url: option.value }));
  },
});

onMounted(async () => {
  if (isEdit.value && props.id) {
    $q.loading.show();
    const data = await requestStore.getRequest(props.id);
    $q.loading.hide();

    name.value = data.name || '';
    selectedSocial.value = socialOptions.value.find(
      ({ value }) => (value as ESocial) === data.social,
    );
    links.value = data.links || [];
    contexts.value = data.contexts || [];
  }
});
</script>

<template>
  <q-page class="q-qutter-md q-pa-md">
    <RequestForm :id="requestId" />
  </q-page>
</template>

<script setup lang="ts">
import RequestForm from 'src/modules/request-form.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const requestId = computed(() =>
  typeof route.params.id === 'string' ? parseInt(route.params.id, 10) : null,
);
</script>

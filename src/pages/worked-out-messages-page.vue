<template>
  <q-page class="q-qutter-md q-pa-md">
    <h1 class="text-h4">Отработанные сообщения</h1>
    <messages-table :is-worked-out="true" />
  </q-page>
</template>

<script setup lang="ts">
import MessagesTable from 'src/modules/messages-table.vue';
</script>

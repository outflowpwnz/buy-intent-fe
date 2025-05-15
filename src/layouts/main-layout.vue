<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="userStore.isAuth"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Buy Intent Fe</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-if="userStore.isAuth" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Навигация</q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { type EssentialLinkProps } from 'components/essential-link.vue';
import { useUserStore } from 'stores/user-store';

const userStore = useUserStore();
const linksList: EssentialLinkProps[] = [
  {
    title: 'Запросы',
    caption: 'Управление запросами',
    icon: 'request_page',
    link: '/requests',
  },
  {
    title: 'Успешные сообщения',
    caption: 'Управление успешными сообщениями',
    icon: 'mark_chat_read',
    link: '/success-messages',
  },
  {
    title: 'Отработанные сообщения',
    caption: 'Управление отработанными сообщениями',
    icon: 'speaker_notes_off',
    link: '/worked-out-messages',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>

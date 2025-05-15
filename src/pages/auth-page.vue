<template>
  <q-page>
    <q-tabs v-model="tab" align="left">
      <q-tab name="login" label="Логин" />
      <q-tab name="register" label="Регистрация" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="login">
        <login-form />
      </q-tab-panel>

      <q-tab-panel name="register">
        <register-form />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import LoginForm from 'src/modules/login-form.vue';
import RegisterForm from 'src/modules/register-form.vue';
import { ref } from 'vue';

const tab = ref('login');
</script>

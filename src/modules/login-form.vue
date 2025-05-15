<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <h2 class="text-h5">Форма логина</h2>
    <q-input filled label="email *" v-model="email" lazy-rules :rules="[requiredRule]"></q-input>
    <q-input
      filled
      label="Пароль *"
      v-model="pwd"
      type="password"
      lazy-rules
      :rules="[requiredRule]"
    ></q-input>
    <q-btn color="primary" type="submit" :loading="isLoading">Продолжить</q-btn>
  </q-form>
</template>

<script setup lang="ts">
import { requiredRule } from 'src/lib/helpers/input-helpers';
import { useUserStore } from 'src/stores/user-store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const email = ref('');
const pwd = ref('');
const isLoading = ref(false);
const router = useRouter();

const onSubmit = async () => {
  isLoading.value = true;
  const data = await userStore.login({ email: email.value, password: pwd.value });
  isLoading.value = false;

  if (!data.error) {
    void router.push('/requests');
  }
};
</script>

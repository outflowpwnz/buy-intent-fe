<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <h2 class="text-h5">Форма регистрация</h2>
    <q-input filled label="Email *" v-model="email" lazy-rules :rules="[requiredRule]"></q-input>
    <q-input
      filled
      label="Пароль *"
      v-model="pwd"
      type="password"
      lazy-rules
      :rules="[requiredRule]"
    ></q-input>
    <q-input
      type="password"
      filled
      label="Повторите пароль *"
      v-model="pwdRepeat"
      lazy-rules
      :rules="[requiredRule, pwdEqualsRule]"
    ></q-input>
    <q-btn type="submit" color="primary" :loading="isLoading">Продолжить</q-btn>
  </q-form>
</template>

<script setup lang="ts">
import { requiredRule } from 'src/lib/helpers/input-helpers';
import { useUserStore } from 'src/stores/user-store';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const email = ref('');
const pwd = ref('');
const pwdRepeat = ref('');
const isLoading = ref(false);

const pwdEqualsRule = (pwdRepeatVal: string) =>
  pwdRepeatVal === pwd.value || 'Пароли должны совпадать';

const onSubmit = async () => {
  isLoading.value = true;
  const data = await userStore.register({
    email: email.value,
    password: pwd.value,
    repeatPassword: pwdRepeat.value,
  });
  isLoading.value = false;

  if (!data.error) {
    void router.push('/requests');
  }
};
</script>

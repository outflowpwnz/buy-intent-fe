<template>
  <div class="theme-switcher">
    <q-toggle v-model="isLightTheme" @update:model-value="onLightThemeChange" color="dark">
      <q-icon name="light_mode" class="theme-switcher__icon theme-switcher__icon--left" />
      <q-icon name="dark_mode" class="theme-switcher__icon theme-switcher__icon--right" />
    </q-toggle>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { ref } from 'vue';
const $q = useQuasar();

const isLightTheme = ref($q.dark.isActive);

const onLightThemeChange = (nextValue: boolean) => {
  $q.dark.set(nextValue);
};
</script>

<style lang="scss">
.theme-switcher {
  padding: 0 14px;
  position: relative;

  &__icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    &--left {
      left: 0;
    }

    &--right {
      right: 0;
    }
  }
}
</style>

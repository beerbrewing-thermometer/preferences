<script setup lang="ts">
import { Toaster } from "@/components/ui/toast";
import { useColorMode } from "@vueuse/core";
const { store } = useColorMode({ disableTransition: false });
store.value = "auto";
</script>

<template>
  <Toaster />
  <router-view></router-view>
</template>

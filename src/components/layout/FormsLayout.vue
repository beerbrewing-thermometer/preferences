<script setup lang="ts">
import SidebarNav from "@/components/layout/SidebarNav.vue";
import Separator from "@/components/ui/separator/Separator.vue";
import LoadingState from "@/services/LoadingState";
import { LoaderCircle } from "lucide-vue-next";
</script>

<template>
  <div class="space-y-6 p-8 pb-14">
    <div class="space-y-0.5">
      <h2 class="text-2xl font-bold tracking-tight">Beerbrewing Thermometer</h2>
      <p class="text-muted-foreground">
        Configure your device settings, including display options, WiFi
        connectivity, time synchronization, and Firebase integration
      </p>
    </div>
    <Separator class="my-6" />
    <div class="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
      <aside class="lg:mr-6 lg:w-64">
        <SidebarNav />
      </aside>
      <div class="flex-1">
        <div
          v-if="LoadingState.isLoading.value === true"
          class="flex h-20 w-full items-center justify-center text-secondary-foreground"
        >
          <LoaderCircle class="h-20 w-20 animate-spin" />
        </div>
        <div
          class="space-y-6"
          :class="{ hidden: LoadingState.isLoading.value == true }"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

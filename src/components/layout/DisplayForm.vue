<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";

import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

import ApiService from "@/services/ApiService";
import LoadingState from "@/services/LoadingState";
import { Save, Undo } from "lucide-vue-next";
import { h } from "vue";

LoadingState.start();

const profileFormSchema = toTypedSchema(
  z.object({
    refreshDelay: z
      .number()
      .min(100, {
        message: "Refresh delay must be at least 100ms.",
      })
      .max(10000, {
        message: "Refresh delay must be at most 10,000ms.",
      }),

    wifiCheckDelay: z
      .number()
      .min(100, {
        message: "Wifi check delay must be at least 100ms.",
      })
      .max(60000, {
        message: "Wifi check delay must be at most 60,000ms.",
      }),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: profileFormSchema,
});

(async () => {
  const initialValues = await ApiService.getDisplaySettings();
  resetForm({ values: initialValues });
  LoadingState.end();
})();

const onSubmit = handleSubmit(async (values) => {
  toast({
    title: "Saving changes...",
  });
  await ApiService.updateDisplaySettings(values);
  resetForm({ values });
  toast({
    title: "Changes saved",
    description: h(
      "pre",
      { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
      h("code", { class: "text-white" }, JSON.stringify(values, null, 2))
    ),
  });
});
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">Display</h3>
    <p class="text-sm text-muted-foreground">
      Manage your display settings and set refresh intervals
    </p>
  </div>
  <Separator />
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="refreshDelay">
      <FormItem>
        <FormLabel>Refresh delay</FormLabel>
        <FormDescription>
          How frequently the display will refresh
        </FormDescription>
        <div class="flex items-center gap-2">
          <FormControl>
            <Input type="number" v-bind="componentField" />
          </FormControl>
          <div>ms</div>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="wifiCheckDelay">
      <FormItem>
        <FormLabel>WiFi check delay</FormLabel>
        <FormDescription>
          How frequently the WiFi connection and signal strength will be checked
        </FormDescription>
        <div class="flex items-center gap-2">
          <FormControl>
            <Input type="number" v-bind="componentField" />
          </FormControl>
          <div>ms</div>
        </div>
        <FormMessage />
      </FormItem>
    </FormField>

    <div class="flex justify-end gap-2">
      <Button type="button" variant="outline" @click="resetForm">
        <Undo class="h-4 w-4" />
        Reset Form
      </Button>
      <Button type="submit">
        <Save class="h-4 w-4" />
        Save
      </Button>
    </div>
  </form>
</template>

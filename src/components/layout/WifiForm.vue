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
import ApiService from "@/services/ApiService";
import LoadingState from "@/services/LoadingState";

import { toTypedSchema } from "@vee-validate/zod";
import { Eye, EyeOff, Save, Undo } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { h, ref } from "vue";
import * as z from "zod";

LoadingState.start();

const showPassword = ref(false);

const profileFormSchema = toTypedSchema(
  z.object({
    ssid: z
      .string()
      .min(1, { message: "SSID must be at least 1 character." })
      .max(32, { message: "SSID must be at most 32 characters." }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(63, { message: "Password must be at most 63 characters." }),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: profileFormSchema,
});

(async () => {
  const initialValues = await ApiService.getWifiSettings();
  resetForm({ values: initialValues });
  LoadingState.end();
})();

const onSubmit = handleSubmit(async (values) => {
  toast({
    title: "Saving changes...",
  });
  await ApiService.updateWifiSettings(values);
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
    <h3 class="text-lg font-medium">WiFi</h3>
    <p class="text-sm text-muted-foreground">
      Connect to a Wi-Fi network to enable cloud data synchronization
    </p>
  </div>
  <Separator />
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="ssid">
      <FormItem>
        <FormLabel>SSID</FormLabel>
        <FormDescription>
          The name of the network you want to connect to
        </FormDescription>
        <FormControl>
          <Input type="string" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="password">
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormDescription>
          The password for the network you want to connect to
        </FormDescription>
        <div class="relative">
          <FormControl>
            <Input
              :type="showPassword ? 'text' : 'password'"
              v-bind="componentField"
            />
          </FormControl>
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-sm leading-5"
          >
            <EyeOff v-if="showPassword" />
            <Eye v-else />
          </button>
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

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
    userEmail: z
      .string()
      .min(1, { message: "User email must not be empty." })
      .max(255, { message: "User email must be at most 255 characters." })
      .email({ message: "User email must be a valid email address." }),

    userPassword: z
      .string()
      .min(1, { message: "User password must not be empty." })
      .max(255, { message: "User password must be at most 255 characters." }),

    apiKey: z
      .string()
      .min(1, { message: "API key must not be empty." })
      .max(255, { message: "API key must be at most 255 characters." }),

    databaseUrl: z
      .string()
      .min(1, { message: "Database URL must not be empty." })
      .max(255, { message: "Database URL must be at most 255 characters." })
      .url({ message: "Database URL must be a valid URL." }),

    databasePath: z
      .string()
      .min(1, { message: "Database path must not be empty." })
      .max(255, { message: "Database path must be at most 255 characters." }),

    uploadDelay: z
      .number()
      .min(250, { message: "Upload delay must be at least 250ms." })
      .max(3600000, { message: "Upload delay must be at most 3600000ms." }),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: profileFormSchema,
});

(async () => {
  const initialValues = await ApiService.getFirebaseSettings();
  resetForm({ values: initialValues });
  LoadingState.end();
})();

const onSubmit = handleSubmit(async (values) => {
  toast({
    title: "Saving changes...",
  });
  await ApiService.updateFirebaseSettings(values);
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
    <h3 class="text-lg font-medium">Firebase</h3>
    <p class="text-sm text-muted-foreground">
      Configure the connection to your Firebase project
    </p>
  </div>
  <Separator />
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="userEmail">
      <FormItem>
        <FormLabel>User Email</FormLabel>
        <FormDescription>
          The email address of the user that will be used to authenticate with
          Firebase
        </FormDescription>
        <FormControl>
          <Input type="email" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="userPassword">
      <FormItem>
        <FormLabel>User Password</FormLabel>
        <FormDescription>
          The password of the user that will be used to authenticate with
          Firebase
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

    <FormField v-slot="{ componentField }" name="apiKey">
      <FormItem>
        <FormLabel>API Key</FormLabel>
        <FormDescription>
          The API key that will be used to authenticate with Firebase
        </FormDescription>
        <FormControl>
          <Input type="string" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="databaseUrl">
      <FormItem>
        <FormLabel>Database URL</FormLabel>
        <FormDescription>
          The URL of the Firebase Realtime Database that you want to connect to
        </FormDescription>
        <FormControl>
          <Input type="url" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="databasePath">
      <FormItem>
        <FormLabel>Database Path</FormLabel>
        <FormDescription>
          The path in the Firebase Realtime Database where the data will be
          stored
        </FormDescription>
        <FormControl>
          <Input type="string" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="uploadDelay">
      <FormItem>
        <FormLabel>Upload Delay</FormLabel>
        <FormDescription>
          The delay between data uploads to Firebase
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

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
import { Save, Undo } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { h } from "vue";
import * as z from "zod";

LoadingState.start();

const profileFormSchema = toTypedSchema(
  z.object({
    ntpServer: z
      .string()
      .min(1, { message: "NTP server must not be empty." })
      .max(255, { message: "NTP server must be at most 255 characters." })
      .regex(
        /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/,
        { message: "NTP server must be a valid DNS name." }
      ),

    timesyncDelay: z
      .number()
      .min(60000, { message: "Time sync delay must be at least 60000." })
      .max(86400000, { message: "Time sync delay must be at most 86400000." }),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: profileFormSchema,
});

(async () => {
  const initialValues = await ApiService.getTimeSettings();
  resetForm({ values: initialValues });
  LoadingState.end();
})();

const onSubmit = handleSubmit(async (values) => {
  toast({
    title: "Saving changes...",
  });
  await ApiService.updateTimeSettings(values);
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
    <h3 class="text-lg font-medium">Time</h3>
    <p class="text-sm text-muted-foreground">
      Configure the time synchronization settings for your device
    </p>
  </div>
  <Separator />
  <form class="space-y-8" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="ntpServer">
      <FormItem>
        <FormLabel>NTP Server</FormLabel>
        <FormDescription>
          The NTP server to use for time synchronization
        </FormDescription>
        <FormControl>
          <Input type="string" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="timesyncDelay">
      <FormItem>
        <FormLabel>Timesync Delay</FormLabel>
        <FormDescription>
          The delay between time synchronization intervals
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

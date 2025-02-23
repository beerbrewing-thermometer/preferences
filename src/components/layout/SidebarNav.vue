<script setup lang="ts">
import { Button } from "@/components/ui/button";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea.vue";
import { cn } from "@/lib/utils";
import { useRoute } from "vue-router";
import ScrollBar from "../ui/scroll-area/ScrollBar.vue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ApiService from "@/services/ApiService";
import { toast } from "@/components/ui/toast";

const routePath = useRoute().path;

interface Item {
  title: string;
  href: string;
}

const sidebarNavItems: Item[] = [
  {
    title: "Display",
    href: "/display",
  },
  {
    title: "WiFi",
    href: "/wifi",
  },
  {
    title: "Time",
    href: "/time",
  },
  {
    title: "Firebase",
    href: "/firebase",
  },
];

async function reset() {
  toast({
    title: "Resetting device...",
  });
  await ApiService.reset();
  toast({
    title: "The device has been successfully reset",
  });
  window.location.href = "/";
}
</script>

<template>
  <ScrollArea class="w-full overflow-x-auto">
    <div class="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      <RouterLink
        v-for="item in sidebarNavItems"
        :to="item.href"
        :key="item.title"
      >
        <Button
          :key="item.title"
          variant="ghost"
          :class="
            cn(
              'w-full text-left justify-start',
              routePath === `${item.href}` && 'bg-muted hover:bg-muted'
            )
          "
        >
          {{ item.title }}
        </Button>
      </RouterLink>
      <div class="lg:mt-4">
        <AlertDialog>
          <AlertDialogTrigger class="w-full">
            <Button
              variant="destructive"
              class="w-full justify-start text-left"
            >
              Reset Device
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is irreversible. It will permanently delete all
                device preferences and reset everything to the default settings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction @click="reset()">Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</template>

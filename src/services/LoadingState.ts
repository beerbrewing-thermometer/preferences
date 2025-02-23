import { ref } from "vue";

let isLoading = ref(false);

function start() {
  isLoading.value = true;
}

function end() {
  isLoading.value = false;
}

export default {
  isLoading,
  start,
  end,
};

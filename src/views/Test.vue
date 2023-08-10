<template>
  <div>
    <h1>{{ counterStore.counter }}</h1>
    <v-btn @click="counterStore.increment"> Increment </v-btn>
    <h1>Test</h1>
  </div>
</template>


<script>
import { useCounterStore } from "@/store/counter";

export default {
  setup() {
    const counterStore = useCounterStore();

    console.log(counterStore.counter); // Truy cập state trong store
    console.log(counterStore.doubleCount); // Truy cập getter trong store
    counterStore.increment(); // Gọi đến action trong store
    counterStore.counter++; // Thay đổi trực tiếp dữ liệu trong store

    return { counterStore };
  },
};
</script>

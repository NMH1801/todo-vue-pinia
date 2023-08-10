import { createPinia } from 'pinia';

const pinia = createPinia();

const useStore = pinia.useStore;

export default useStore
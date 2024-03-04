import { writable, type Writable } from 'svelte/store';

export const activeFilters: Writable<string[]> = writable([]);

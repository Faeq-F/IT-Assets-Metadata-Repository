import { writable, type Writable } from 'svelte/store';
/**
 * Stores the filters applied on the assets page
 * @author Faeq Faisal
 * @email faeqfaisal@hotmail.co.uk
 * @email zlac318@live.rhul.ac.uk
 */
export const activeFilters: Writable<string[]> = writable([]);
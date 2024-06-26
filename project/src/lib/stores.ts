import { writable, type Writable } from 'svelte/store';
/**
 * Stores the filters applied on the assets page
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export const activeFilters: Writable<string[]> = writable([]);

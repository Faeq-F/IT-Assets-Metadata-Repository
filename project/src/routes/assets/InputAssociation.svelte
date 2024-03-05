<script lang="ts">
	import { fetchDocuments } from '$lib/apiRequests';
	import { Autocomplete } from '@skeletonlabs/skeleton';
	export let fieldName: string;
	export let associationType: string;
	let addOptions = addAutocompleteOptions();

	async function addAutocompleteOptions() {
		if (associationType == 'Asset') {
			return await fetchDocuments('Asset').then((documents) => {
				let temp: AutocompleteOption<string>[] = [];
				for (let i of documents) {
					temp.push({
						label: i.assetName,
						value: i._id,
						field: fieldName
					});
				}
				return temp;
			});
		} else {
			return await fetchDocuments('AssetType').then((documents) => {
				let temp: AutocompleteOption<string>[] = [];
				for (let i of documents) {
					temp.push({
						label: i.typeName,
						value: i._id,
						field: fieldName
					});
				}
				return temp;
			});
		}
	}

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function onDocumentSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		dispatch('message', event);
	}

	let searchInput = '';
</script>

{#await addOptions}
	<p>Loading...</p>
{:then documentOptions}
	<input class="input" type="search" name="demo" bind:value={searchInput} placeholder="Search..." />
	<div class="card max-h-48 w-full max-w-sm overflow-y-auto p-4" tabindex="-1">
		<Autocomplete
			bind:input={searchInput}
			options={documentOptions}
			on:selection={onDocumentSelection}
		/>
	</div>
{/await}

<style></style>

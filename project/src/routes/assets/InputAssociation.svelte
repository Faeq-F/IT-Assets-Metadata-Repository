<script lang="ts">
	import { fetchDocuments } from '$lib/apiRequests';
	import { Autocomplete, type AutocompleteOption } from '@skeletonlabs/skeleton';
	export let list: boolean;
	export let fieldName: string;
	export let associationType: string;
	let addOptions = addAutocompleteOptions();

	async function addAutocompleteOptions() {
		if (associationType == 'Asset') {
			return await fetchDocuments('Asset').then((documents) => {
				let temp: AutocompleteOption<string>[] = [];
				for (let i of documents) {
					temp.push({
						label: i.assetName + ' (' + i.assetType + ')',
						value: i._id,
						meta: {
							name: i.assetName,
							extraDetail: i.assetType,
							field: fieldName,
							listable: list
						}
					});
				}
				return temp;
			});
		} else {
			return await fetchDocuments('User').then((documents) => {
				let temp: AutocompleteOption<string>[] = [];
				for (let i of documents) {
					temp.push({
						label: i.username + ' (' + i.email + ')',
						value: i._id,
						meta: {
							name: i.username,
							extraDetail: i.email,
							field: fieldName,
							listable: list
						}
					});
				}
				return temp;
			});
		}
	}

	//import { createEventDispatcher } from 'svelte';
	//const dispatch = createEventDispatcher();
	function onDocumentSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		//dispatch('message', event);
		if (list) {
			savedAssociation = [...savedAssociation, event.detail];
		} else {
			savedAssociation = event.detail;
		}
	}

	function removeFromList(association: any) {
		savedAssociation = savedAssociation.filter(
			(associationSaved: any) => associationSaved.value != association.value
		);
	}

	let savedAssociation: any;
	if (list) {
		savedAssociation = [];
	}
	let searchInput = '';
</script>

{#await addOptions}
	<p>Loading...</p>
{:then documentOptions}
	<div id={fieldName + '-associationCollector'}>
		{#if list}
			<p>Saved (This field is Multi-Value):</p>
			{#if savedAssociation.length == 0}
				Nothing saved
			{:else}
				<ul>
					{#each savedAssociation as associationSaved}
						<li
							class="card w-6/12 shadow-md"
							style="margin: 5px auto;"
							data-associatedObject={JSON.stringify(associationSaved)}
						>
							{associationSaved.label}
							<button
								class="btn"
								on:click|preventDefault={() => {
									removeFromList(associationSaved);
								}}><i class="fa-trash fa-solid"></i></button
							>
						</li>
					{/each}
				</ul>
			{/if}
		{:else}
			<div>
				<p>Saved (This field only allows a single value):</p>
				{#if savedAssociation == undefined}
					Nothing saved
				{:else}
					<li
						class="card block w-6/12 shadow-md"
						style="margin: 5px auto;"
						data-associatedObject={JSON.stringify(savedAssociation)}
					>
						{savedAssociation.label}
						<button
							class="btn"
							on:click|preventDefault={() => {
								savedAssociation = undefined;
							}}><i class="fa-trash fa-solid"></i></button
						>
					</li>
				{/if}
			</div>
		{/if}
	</div>

	<input
		id={fieldName + '-association'}
		class="input w-6/12"
		type="search"
		name="demo"
		bind:value={searchInput}
		placeholder={list
			? 'Search for multiple ' + associationType + 's to add'
			: 'Search for an ' + associationType + ' to add'}
	/>

	<div class="card h-64 w-6/12 overflow-y-auto p-4" tabindex="-1" style="margin: 0 auto;">
		<Autocomplete
			bind:input={searchInput}
			options={documentOptions}
			on:selection={onDocumentSelection}
		/>
	</div>
{/await}

<style></style>

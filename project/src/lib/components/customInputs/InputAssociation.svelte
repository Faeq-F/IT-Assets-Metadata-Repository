<script lang="ts">
	import { Autocomplete, type AutocompleteOption } from '@skeletonlabs/skeleton';
	import { addAutocompleteOptions } from './InputAssociation';
	export let list: boolean;
	export let fieldName: string;
	export let associationType: string;
	export let presavedAssociation: any;
	let addOptions = addAutocompleteOptions(associationType);

	function saveAssociation(event: CustomEvent<AutocompleteOption<string>>): void {
		if (list) {
			savedAssociation = [...savedAssociation, event.detail];
		} else {
			savedAssociation = event.detail;
		}
	}

	function removeAssociation(association: any) {
		savedAssociation = savedAssociation.filter(
			(associationSaved: any) => associationSaved.value != association.value
		);
	}

	let savedAssociation: any = presavedAssociation;
	if (list && presavedAssociation == undefined) {
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
				Nothing saved <button
					on:click|preventDefault={() => {
						savedAssociation = savedAssociation;
					}}>(Refresh)</button
				>
			{:else}
				<ul>
					{#each savedAssociation as associationSaved}
						<li
							class="card variant-ringed w-6/12 p-2 shadow-md"
							style="margin: 5px;"
							{...$$restProps}
							data-associatedObject={JSON.stringify(associationSaved)}
						>
							{associationSaved.label}
							<button
								class="btn"
								on:click|preventDefault={() => {
									removeAssociation(associationSaved);
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
						class="card variant-ringed block w-6/12 p-2 shadow-md"
						style="margin: 5px;"
						{...$$restProps}
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
		bind:value={searchInput}
		placeholder={list
			? 'Search for multiple ' + associationType + 's to add'
			: 'Search for an ' + associationType + ' to add'}
	/>

	<div class="card h-64 w-6/12 overflow-y-auto p-4" tabindex="-1" {...$$restProps}>
		<Autocomplete
			bind:input={searchInput}
			options={documentOptions}
			on:selection={saveAssociation}
		/>
	</div>
{/await}

<style></style>

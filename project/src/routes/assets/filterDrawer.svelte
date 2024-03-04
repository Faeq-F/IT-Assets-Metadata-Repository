<script lang="ts">
	import { ListBox, ListBoxItem, getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { fetchDocuments } from '../api/apiRequests';
	import { activeFilters } from '$lib/stores';

	let typeFilters: string[] = [];

	onMount(async () => {
		await fetchDocuments('Asset').then((Docs) => {
			for (let i of Docs) {
				if (!typeFilters.includes(i.assetType)) {
					typeFilters = [...typeFilters, i.assetType];
				}
			}
		});
	});

	const drawerStore = getDrawerStore();
</script>

<h1 class="h1">Filters</h1>
<div class="card" id="filters">
	<ListBox multiple id="ListBox">
		{#each typeFilters as item (item)}
			<ListBoxItem bind:group={$activeFilters} name="medium" value={item}>{item}</ListBoxItem>
		{/each}
	</ListBox>
</div>
<button
	type="button"
	id="applyButton"
	class="variant-ghost btn"
	on:click={() => {
		drawerStore.close();
	}}
>
	Close</button
>

<style>
	#filters {
		margin-left: 25%;
		margin-right: 25%;
	}
	.h1 {
		text-align: center;
		margin-top: 15%;
		margin-bottom: 5%;
	}
	#applyButton {
		text-align: center;
		margin-top: 5%;
		margin-left: 45%;
		margin-right: 45%;
	}
</style>

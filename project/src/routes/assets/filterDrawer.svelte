<script lang="ts">
	import { ListBox, ListBoxItem, getDrawerStore } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { fetchDocuments } from '$lib/apiRequests';
	import { activeFilters } from '$lib/stores';
	/* 
		this is contains a list of the different filters which are to be displayed
	*/
	let typeFilters: string[] = [];

	onMount(async () => {
		/*
			this generates the list of filters that appear in the drawer
		*/
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
	<!--this generates the list box for the filters-->
	<ListBox multiple id="ListBox">
		<!--this iterates through typeFilters and pulls out each item-->
		{#each typeFilters as item (item)}
		    <!--this turns each item into an item in a list box-->
			<ListBoxItem bind:group={$activeFilters} name="medium" value={item}>{item}</ListBoxItem>
		{/each}
	</ListBox>
</div>
<!--this makes the close drawer button which when clicked shuts the drawer -->
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
<!-- this is where the styling for the drawer is stated-->
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

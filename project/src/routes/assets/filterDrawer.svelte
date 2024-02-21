<script lang="ts">
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { injectAssetDivs } from './assetDivInjection';
	import { filterAssets } from './keywordSearch';
	export let activeFilters: string[] = [];
	
	let areThereAssets = false;
</script>

<h1 class="h1">Filters</h1>
<div class="card" id="filters">
	<ListBox multiple >
		<ListBoxItem bind:group={activeFilters} name="medium" value="Library" >Library</ListBoxItem>
		<ListBoxItem bind:group={activeFilters} name="medium" value="Framework">Framework</ListBoxItem>
		<ListBoxItem bind:group={activeFilters} name="medium" value="File">File</ListBoxItem>
	</ListBox>
</div>

<style>
	@import url('$lib/styles/root.css');
	#filters {
		margin-left: 25%;
		margin-right: 25%;
	}
	.h1 {
		text-align: center;
		margin-top: 15%;
		margin-bottom: 5%;
	}
</style>

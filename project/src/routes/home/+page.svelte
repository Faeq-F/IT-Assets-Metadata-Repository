<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { onMount } from 'svelte';
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	import { fetchDocuments } from '../api/apiRequests';
	onMount(() => {
		if (browser) {
			redirectWhenNotLoggedIn();
		}
	});

	let assetCount = 0;
	let typeCount = 0;

	onMount(async () => {
		fetchDocuments('Asset').then((Docs) => (assetCount = Docs.length));
		fetchDocuments('AssetType').then((Docs) => (typeCount = Docs.length));
	});
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<h1 class="h1">Home</h1>
<br />
<div class="card w-9/12 bg-modern-50 object-center shadow-md" id="HomeCard">
	<p>
		A holistic Web-based system that supports the metadata-based organization of different
		source-code related assets
	</p>
</div>
<div class=" flex w-9/12" style="margin: 0 auto;">
	<div class="card m-4 h-96 w-3/6 bg-modern-50 p-5 shadow-md">
		<div class="h3 font-medium">Your assets:</div>
		{#if assetCount == 0}
			⦿ You have no assets
		{:else if assetCount == 1}
			⦿ You have 1 asset
		{:else}
			⦿ You have a total of {assetCount} assets
		{/if}
	</div>
	<div class="card m-4 h-96 w-3/6 bg-modern-50 p-5 shadow-md">
		<div class="h3 font-medium">Your asset types:</div>
		{#if typeCount == 0}
			⦿ You have no active asset types
		{:else if typeCount == 1}
			⦿ You have 1 active asset type
		{:else}
			⦿ You have a total of {typeCount} asset types
		{/if}
	</div>
</div>

<style>
	@import url('$lib/styles/root.css');
	#HomeCard {
		padding: 20px;
		margin: 0 auto;
		text-align: center;
	}
</style>

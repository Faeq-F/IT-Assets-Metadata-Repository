<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { onMount } from 'svelte';

	import { AppBar, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	import { injectAssetDivs } from './assetDivInjection';
	import MakeAsset from './makeAsset.svelte';
	import { filterAssets } from './keywordSearch';

	let areThereAssets = false;

	onMount(() => {
		if (browser) {
			injectAssetDivs().then((thereAre: boolean) => {
				areThereAssets = thereAre;
				filterAssets();
			});
		}
	});

	const makeAssetPopup: PopupSettings = {
		event: 'click',
		target: 'makeAssetPopup',
		placement: 'bottom',
		closeQuery: ''
	};
</script>

<svelte:head>
	<title>Assets</title>
</svelte:head>

<h1 class="h1">Assets</h1>
<br />
<div>
	<div class="Card" id="assetHeader">
		<AppBar background="transparent">
			<svelte:fragment slot="lead">
				{#if areThereAssets}
					<p id="nothingHere">Your assets:</p>
				{:else}
					<p id="nothingHere">
						It doesn't look like you have any assets yet, click the ➕ to get started
					</p>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><i class="fa-solid fa-search"></i></div>
					<input
						type="search"
						id="keyword"
						name="keyword"
						placeholder="Enter search term"
						class=""
						on:keyup={filterAssets}
					/>
				</div>

				<button id="assetMaker" class="CardButton Card" use:popup={makeAssetPopup}>➕</button>
				<MakeAsset />
			</svelte:fragment>
		</AppBar>
	</div>
</div>
<br />
<div class="assetsContainer"></div>

<style>
	@import url('$lib/styles/root.css');
	@import url('$lib/styles/card.css');

	#assetMaker {
		width: 2vw;
		height: 2vw;
		padding: 0;
		float: right;
	}

	#nothingHere {
		display: inline;
		float: left;
	}

	#assetHeader {
		height: auto;
		padding: 0px;
	}

	#assetHeader::after {
		content: '';
		clear: both;
		display: table;
	}

	.assetsContainer {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		width: 90%;
		margin: 10px auto;
	}

	#keyword {
		display: inline;
		float: right;
		margin-right: 20px;
	}
</style>

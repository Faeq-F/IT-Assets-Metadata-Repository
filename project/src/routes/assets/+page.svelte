<script lang="ts">
	//Run 'npm install' to make sure you have all the dependencies
	import { Modal, Content, Trigger } from 'sv-popup';
	import FilterDrawer from './filterDrawer.svelte';
	import { injectFilterDivs } from './typeFilterInjection';
	import { AppBar, AppShell, Autocomplete } from '@skeletonlabs/skeleton';

	function searchKeyword() {
		alert((document.getElementById('keyword') as HTMLInputElement).value);
	}

	import { injectAssetDivs } from './assetDivInjection';
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { onMount } from 'svelte';
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	onMount(() => {
		if (browser) {
			redirectWhenNotLoggedIn();
		}
	});
	// code for the filter drawer
	import { initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';

	initializeStores();
	const drawerStore = getDrawerStore();

	function drawerOpen(): void {
		drawerStore.open({});
	}
	let filters: any[] = [];
	function applyFilters(): void {
		let areThereAssets = false;
		filterAssetsTypes(filters);
		console.log(filters);
		drawerStore.close();
	}

	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import MakeAsset from './makeAsset.svelte';
	import { filterAssets } from './keywordSearch';
	import { filterAssetsTypes } from './applyFilters';

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
<Drawer>
	<div>
		<FilterDrawer activeFilters={filters} />
	</div>
	<div class="typeFilter"></div>
	<div class="variant-ghost" id="applyButton">
		<button type="button" on:click={applyFilters}> Apply Filters</button>
	</div>
</Drawer>
<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
	<svelte:fragment slot="header">
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
					<button id="openDrawer" class="variant-ghost" on:click={drawerOpen}> Filters</button>
				</AppBar>
			</div>
		</div>
		<br />
	</svelte:fragment>
</AppShell>
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

	#applyButton {
		text-align: center;
		margin-top: 5%;
		margin-left: 45%;
		margin-right: 45%;
	}
</style>

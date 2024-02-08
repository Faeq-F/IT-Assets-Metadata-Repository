<script lang="ts">
	//Run 'npm install' to make sure you have all the dependencies
	import { Modal, Content, Trigger } from 'sv-popup';
	import MakeAsset from './makeAsset.svelte';
	import { AppBar, AppShell, Autocomplete } from '@skeletonlabs/skeleton';

	function searchKeyword() {
		alert((document.getElementById('keyword') as HTMLInputElement).value);
	}

	import { injectAssetDivs } from './assetDivInjection';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	injectAssetDivs();

	let AreThereAssets = false;
	onMount(() => {
		if (browser) {
			if (document.getElementsByClassName('assetsContainer')[0].firstChild) {
				AreThereAssets = true;
			}
		}
	});
	// code for the filter drawer
	import { initializeStores, Drawer, getDrawerStore } from '@skeletonlabs/skeleton';

	initializeStores();
	const drawerStore = getDrawerStore();

	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

<svelte:head>
	<title>Assets</title>
</svelte:head>
<Drawer>Filters</Drawer>
<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
	<svelte:fragment slot="header">
		<h1 class="h1">Assets</h1>
		<br />
		<div>
			<div class="card" id="assetHeader">
				<AppBar background="transparent">
					<svelte:fragment slot="lead">
						<div class="items-left">
							<button class="btn btn-sm mr-4 " on:click={drawerOpen}>
								Filters
							</button>
						</div>
						{#if AreThereAssets}
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
							/>
							<button class="variant-ghost" on:click={searchKeyword}>Submit</button>
						</div>
						<Modal>
							<Content>
								<MakeAsset />
							</Content>
							<Trigger>
								<button id="assetMaker" class="cardButton card">➕</button>
							</Trigger>
						</Modal>
					</svelte:fragment>
				</AppBar>
			</div>
		</div>
		<br />
	</svelte:fragment>
	<!-- <svelte:fragment slot="sidebarLeft">
		<FilterDrawer />
	</svelte:fragment> -->
</AppShell>
<div class="assetsContainer"></div>

<style>
	@import url('$lib/styles/root.css');
	@import url('$lib/styles/card.css');

	h1 {
		text-align: center;
		margin-top: 15%;
	}

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

<script lang="ts">
	import {
		AppBar,
		getModalStore,
		InputChip,
		type ModalComponent,
		type ModalSettings,
		getDrawerStore,
		RadioGroup,
		RadioItem,
		type PopupSettings,
		popup
	} from '@skeletonlabs/skeleton';

	import { onMount } from 'svelte';
	import { fetchDocuments } from '$lib/apiRequests';
	import Asset from './Asset.svelte';
	//@ts-ignore
	import MakeAsset from './makeAsset.svelte';
	import { highlight, keywordFilter } from '../../lib/scripts/keywordSearch';
	import Cookies from 'js-cookie';
	import { activeFilters } from '$lib/stores';
	import Placeholder from '$lib/components/cards/placeholder.svelte';

	const drawerStore = getDrawerStore();
	// This function opens the filter drawer
	function drawerOpen(): void {
		drawerStore.open({
			id: 'filterAssetsDrawer',
			width: 'w-[280px] md:w-[655px]',
			position: 'right'
		});
	}

	$: filters = $activeFilters;
	let keywordSearchInput: string[] = [];
	let AssetDocuments: any[];

	// This gets the documents related to the assets
	onMount(async () => {
		fetchDocuments('Asset').then((Docs) => {
			AssetDocuments = Docs;
		});
	});

	let role = Cookies.get('savedLogin-role');

	//This code sets up the code which will be used for loading modals
	const modalStore = getModalStore();
	const modalComponent: ModalComponent = { ref: MakeAsset };
	// This defines the settings of any modals used
	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};
	// This deines the setting for popups
	const association: PopupSettings = {
		event: 'hover',
		target: 'association',
		placement: 'top'
	};

	let viewType: number = 0;
</script>

<svelte:head>
	<title>Assets</title>
</svelte:head>

<!-- This tells the user what a certain symbol means-->
<div class="card z-[9999] p-4" data-popup="association">
	An item annotated with <i class="fa-solid fa-stroopwafel"></i> refers to Users & Assets on the
	system
	<div class="card arrow" />
</div>

<h1 class="h1" use:popup={association}>Assets</h1>
<br />
<div>
	<div class="card block w-11/12 bg-modern-50 drop-shadow-md" id="assetHeader">
		<AppBar background="transparent">
			<svelte:fragment slot="lead">
				<!-- This checks if the user has any assets created-->
				{#if AssetDocuments != undefined && AssetDocuments.length > 0}
					<!--This determines which way the assets will be displayed either
					as a grid with more detail or as a list with minium detail-->
					<RadioGroup
						background="transparent"
						class="text-token max-h-8  text-sm"
						active="variant-soft"
						hover="hover:variant-soft-primary"
						border="border-2 border-modern-500"
					>
						<!--This defines how assets are displayed when in grid form-->
						<RadioItem bind:group={viewType} name="grid" value={0} class="h-4"
							><i
								class="fa-solid fa-grip fa-md -mt-8 text-sm"
								style="vertical-align: middle; line-height: 4.6rem;"
							></i></RadioItem
						>
						<!--This defines how assets are displayed when in list form-->
						<RadioItem bind:group={viewType} name="list" value={1} class="h-4"
							><i
								class="fa-solid fa-list-ul fa-md -mt-8 text-sm"
								style="vertical-align: middle; line-height: 4.6rem;"
							></i></RadioItem
						>
					</RadioGroup>
					<p id="nothingHere" class="ml-2" use:popup={association}>Your assets:</p>
				{:else}
					<!-- This is the message displayed if the current user has no assets to be displayed-->
					<p id="nothingHere" class="ml-2">
						It doesn't look like you have any assets yet, click the <i class="fa-solid fa-plus"></i>
						to get started
					</p>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<!--Search by keyword bar-->
				<div class="inline max-h-8 rounded-full border-2 border-modern-500">
					<div class=" inline p-1 pl-3 pr-3"><i class="fa-solid fa-search"></i></div>
					<span class="divider-vertical inline h-20" />
					<!--This defines how to search box is formatted-->
					<InputChip
						bind:value={keywordSearchInput}
						id="keyword"
						name="keyword"
						placeholder="Enter search terms"
						chips="variant-filled rounded-md"
						rounded=" rounded-none"
						padding="p-0"
						class="float-right mr-2 inline w-9/12 border-0 bg-modern-50"
						style="background-color: transparent !important"
					/>
				</div>
				<!--Open Filter Drawer-->
				<button
					id="openDrawer"
					class="card rounded-full border-2 border-modern-500 bg-modern-50 px-2 py-0.5 text-sm"
					style="margin-right: 10px;"
					on:click={drawerOpen}><i class="fa-solid fa-filter"></i></button
				>
				<!--Create asset button-->
				<div>
					{#if role != 'viewer'}
						<button
							id="assetMaker"
							class="card card-hover border-2 border-modern-500 bg-modern-50 drop-shadow-md"
							on:click={() => modalStore.trigger(modal)}><i class="fa-solid fa-plus"></i></button
						>
					{/if}
				</div>
			</svelte:fragment>
		</AppBar>
	</div>
</div>
<br />
<!--Assets grid-->
<div class="assetsContainer">
	{#await fetchDocuments('Asset')}
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
	{:then AssetDocuments}
		{#each AssetDocuments as asset}
			{#await keywordFilter(asset, keywordSearchInput)}
				<Placeholder />
			{:then shouldShow}
				<!--This code defines how assets should be displayed in grid form and
				defines which assets should be displayed based off the filters selected and if
				shouldShow is true-->
				{#if shouldShow && (filters.includes(asset.assetType) || filters.length == 0)}
					<Asset
						{viewType}
						id={asset._id}
						name={highlight(asset.assetName, keywordSearchInput)}
						link={highlight(asset.assetLink, keywordSearchInput)}
						type={highlight(asset.assetType, keywordSearchInput)}
						metadata={asset.metadataFields}
						{keywordSearchInput}
					/>
				{/if}
			{/await}
		{/each}
	{/await}
</div>

<!--This contains the stlying options for the page-->
<style>
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
		margin: 0 auto;
	}

	#assetHeader::after {
		content: '';
		clear: both;
		display: table;
	}

	.assetsContainer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: stretch;
		width: 90%;
		margin: 10px auto;
	}
</style>

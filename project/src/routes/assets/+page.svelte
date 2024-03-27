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

	let role = Cookies.get('savedLogin-role');
	const modalStore = getModalStore();
	const drawerStore = getDrawerStore();

	// $ makes filters a reactive var
	$: filters = $activeFilters;
	let keywordSearchInput: string[] = [];
	let AssetDocuments: any[];
	let viewType: number = 0;

	// This gets the asset documents
	onMount(async () => {
		fetchDocuments('Asset').then((Docs) => {
			AssetDocuments = Docs;
		});
	});

	function drawerOpen(): void {
		drawerStore.open({
			id: 'filterAssetsDrawer',
			width: 'w-[280px] md:w-[655px]',
			position: 'right'
		});
	}

	const makeAssetModalComponent: ModalComponent = { ref: MakeAsset };
	const makeAssetModal: ModalSettings = {
		type: 'component',
		component: makeAssetModalComponent
	};

	const associationPopup: PopupSettings = {
		event: 'hover',
		target: 'association',
		placement: 'top'
	};
</script>

<svelte:head>
	<title>Assets</title>
</svelte:head>

<!-- This tells the user what certain symbols mean-->
<div class="card z-[9999] p-4" data-popup="association">
	An item annotated with <i class="fa-solid fa-stroopwafel"></i> refers to Users & Assets on the
	system
	<div class="card arrow" />
</div>

<h1 class="h1" use:popup={associationPopup}>Assets</h1>
<br />
<div>
	<div class="card bg-modern-50 block w-11/12 drop-shadow-md" id="assetHeader">
		<AppBar background="transparent">
			<svelte:fragment slot="lead">
				<!-- This checks if the user has any assets created-->
				{#if AssetDocuments != undefined && AssetDocuments.length > 0}
					<!--This determines which way the assets will be displayed either
					as a grid with more detail or as a list with minimal detail-->
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
					<p id="yourAssets" class="ml-2" use:popup={associationPopup}>Your assets:</p>
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
				<div class="border-modern-500 inline max-h-8 rounded-full border-2">
					<div class=" inline p-1 pl-3 pr-3"><i class="fa-solid fa-search"></i></div>
					<span class="divider-vertical inline h-20" />
					<!--This component allows the search bar to be tokenized-->
					<InputChip
						bind:value={keywordSearchInput}
						id="keyword"
						name="keyword"
						placeholder="Enter search terms"
						chips="variant-filled rounded-md"
						rounded=" rounded-none"
						padding="p-0"
						class="bg-modern-50 float-right mr-2 inline w-9/12 border-0"
						style="background-color: transparent !important"
					/>
				</div>
				<!--Drawer for filters, etc.-->
				<button
					id="openDrawer"
					class="card border-modern-500 bg-modern-50 rounded-full border-2 px-2 py-0.5 text-sm"
					style="margin-right: 10px;"
					on:click={drawerOpen}><i class="fa-solid fa-filter"></i></button
				>
				<!--Create asset button-->
				<div>
					{#if role != 'viewer'}
						<button
							id="assetMaker"
							class="card card-hover border-modern-500 bg-modern-50 border-2 drop-shadow-md"
							on:click={() => modalStore.trigger(makeAssetModal)}
							><i class="fa-solid fa-plus"></i></button
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
				<!--This code defines which assets should be displayed based off the filters selected and if
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

<style>
	#assetMaker {
		width: 2vw;
		height: 2vw;
		padding: 0;
		float: right;
	}

	#yourAssets,
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

<script lang="ts">
	import { onMount } from 'svelte';
	import {
		AppBar,
		type ModalComponent,
		type ModalSettings,
		RadioGroup,
		RadioItem,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import MakeType from './MakeType.svelte';
	import Type from './Type.svelte';
	import { fetchDocuments } from '$lib/apiRequests';
	import Cookies from 'js-cookie';
	import Placeholder from '$lib/components/cards/placeholder.svelte';

	let role = Cookies.get('savedLogin-role');
	let AssetTypesDocuments: any[];

	onMount(async () => {
		fetchDocuments('AssetType').then((Docs) => {
			AssetTypesDocuments = Docs;
		});
	});

	const modalStore = getModalStore();
	const modalComponent: ModalComponent = { ref: MakeType };
	const makeModal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};

	let viewType: number = 0;
</script>

<svelte:head>
	<title>Asset types</title>
</svelte:head>

<h1 class="h1">Asset types management</h1>
<br />
<div>
	<div class="card block w-11/12 bg-modern-50 drop-shadow-md" id="assetHeader">
		<AppBar background="transparent">
			<svelte:fragment slot="lead">
				{#if AssetTypesDocuments != undefined && AssetTypesDocuments.length > 0}
					<RadioGroup
						background="transparent"
						class="text-token max-h-8  text-sm"
						active="variant-soft"
						hover="hover:variant-soft-primary"
						border="border-2 border-modern-500"
					>
						<RadioItem bind:group={viewType} name="grid" value={0} class="h-4"
							><i
								class="fa-solid fa-grip fa-md -mt-8 text-sm"
								style="vertical-align: middle; line-height: 4.6rem;"
							></i></RadioItem
						>
						<RadioItem bind:group={viewType} name="list" value={1} class="h-4"
							><i
								class="fa-solid fa-list-ul fa-md -mt-8 text-sm"
								style="vertical-align: middle; line-height: 4.6rem;"
							></i></RadioItem
						>
					</RadioGroup>
					<p id="nothingHere" class="ml-2">Your types:</p>
				{:else}
					<p id="nothingHere" class="ml-2">
						It doesn't look like you have any types yet, click the <i class="fa-solid fa-plus"></i> to
						get started
					</p>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if role == 'admin'}
					<button
						id="assetMaker"
						class="card card-hover border-2 border-modern-500 bg-modern-50 drop-shadow-md"
						on:click={() => modalStore.trigger(makeModal)}><i class="fa-solid fa-plus"></i></button
					>
				{/if}
			</svelte:fragment>
		</AppBar>
	</div>
</div>

<div class="typesContainer">
	{#await fetchDocuments('AssetType')}
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
	{:then AssetTypesDocuments}
		{#each AssetTypesDocuments as type}
			<Type
				id={type._id}
				typeName={type.typeName}
				metadataFields={type.metadataFields}
				{viewType}
			/>
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

	.typesContainer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: stretch;
		width: 90%;
		margin: 10px auto;
	}
</style>

<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { onMount } from 'svelte';
	import {
		AppBar,
		type ModalComponent,
		type ModalSettings,
		getModalStore
	} from '@skeletonlabs/skeleton';
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	import MakeType from './MakeType.svelte';
	import Type from './Type.svelte';
	import { updateTypes } from './TypesSave';
	import { fetchDocuments } from '../api/apiRequests';

	onMount(() => {
		if (browser) {
			redirectWhenNotLoggedIn();
		}
	});

	let AssetTypesDocuments: any[];

	onMount(async () => {
		fetchDocuments('AssetType').then((Docs) => {
			AssetTypesDocuments = Docs;
		});
	});

	const modalStore = getModalStore();
	const modalComponent: ModalComponent = { ref: MakeType };
	const modal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};
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
					<p id="nothingHere">Your types:</p>
				{:else}
					<p id="nothingHere">
						It doesn't look like you have any types yet, click the <i class="fa-solid fa-plus"></i> to
						get started
					</p>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<button
					id="assetMaker"
					class="card card-hover border-2 border-modern-500 bg-modern-50 drop-shadow-md"
					on:click={() => modalStore.trigger(modal)}><i class="fa-solid fa-plus"></i></button
				>
			</svelte:fragment>
		</AppBar>
	</div>
</div>

<div class="typesContainer">
	{#if AssetTypesDocuments != undefined}
		{#each AssetTypesDocuments as type}
			<Type id={type._id} typeName={type.typeName} metadataFields={type.metadataFields} />
		{/each}
	{/if}
</div>

<style>
	@import url('$lib/styles/root.css');

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

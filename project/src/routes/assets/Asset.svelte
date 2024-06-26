<script lang="ts">
	import {
		getModalStore,
		getToastStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	//@ts-ignore
	import { page } from '$app/stores'; //Does work
	import { fetchDocumentByID, fetchDocuments } from '$lib/apiRequests';
	import ExpandedAsset from './ExpandedAsset.svelte';
	import { highlight } from '../../lib/scripts/keywordSearch';
	import UpdateAsset from './UpdateAsset.svelte';
	import Cookies from 'js-cookie';
	import AssociationCard from '../../lib/components/cards/AssociationCard.svelte';
	import ExpandedType from '../types/ExpandedType.svelte';
	import { onMount } from 'svelte';
	import { deleteAsset } from './Asset';
	const toastStore = getToastStore();

	export let name: string;
	export let id: string;
	export let link: string;
	export let type: string;
	export let metadata: any;
	export let keywordSearchInput: string[] = [];
	export let viewType: number;

	let expandTypeModalComponent: ModalComponent;
	let expandType: ModalSettings;

	onMount(async () => {
		await fetchDocuments('AssetType').then((docs) => {
			for (let i of docs) {
				if (i.typeName == type) {
					expandTypeModalComponent = {
						ref: ExpandedType,
						props: {
							id: i._id,
							typeName: i.typeName,
							metadataFields: i.metadataFields
						}
					};
					expandType = {
						type: 'component',
						component: expandTypeModalComponent,
						backdropClasses: '!p-0'
					};
				}
			}
		});
	});

	let role = Cookies.get('savedLogin-role');
	const modalStore = getModalStore();

	const expandModalComponent: ModalComponent = {
		ref: ExpandedAsset,
		props: { id: id, assetName: name, assetLink: link, assetType: type, metadataFields: metadata }
	};
	const expandModal: ModalSettings = {
		type: 'component',
		component: expandModalComponent,
		backdropClasses: '!p-0'
	};

	const updateModalComponent: ModalComponent = {
		ref: UpdateAsset,
		props: { id: id, assetName: name, assetLink: link, assetType: type, metadataFields: metadata }
	};
	const updateModal: ModalSettings = {
		type: 'component',
		component: updateModalComponent,
		backdropClasses: '!p-0'
	};

	let showMenu = 'none';
</script>

<div
	id="Asset"
	class="card card-hover bg-modern-50 drop-shadow-md"
	style={viewType != 0 ? 'width: 100%;' : ''}
>
	<!--Popup menu-->
	<div
		id="menuPopup"
		class="card card-hover p-3 drop-shadow-md"
		style="display: {showMenu}; position: absolute; right:10px; top: 10px; border-radius: 10px;"
	>
		<div class="">
			<!--This creates a button which is used to share an asset - it copies the url to the users clipboard-->
			<button
				class="variant-filled-surface btn btn-sm card-hover m-1"
				on:click={() => {
					navigator.clipboard.writeText($page.url.origin + '/shared?asset=' + id);
					toastStore.trigger({
						message: 'Copied link',
						background: 'variant-ghost-success',
						timeout: 3000
					});
				}}
			>
				<span><i class="fa-solid fa-share-nodes"></i></span>
				<span>Share</span>
			</button>
			<!--Expand button-->
			<button
				class="variant-filled-surface btn btn-sm card-hover m-1"
				on:click={() => modalStore.trigger(expandModal)}
			>
				<span><i class="fa-solid fa-maximize"></i></span>
				<span>Expand</span>
			</button>
			{#if role != 'viewer'}
				<!--Edit button-->
				<button
					class="variant-filled-surface btn btn-sm card-hover m-1"
					on:click={() => modalStore.trigger(updateModal)}
				>
					<span><i class="fa-solid fa-pen"></i></span>
					<span>Edit</span>
				</button>
				<!--Delete button-->
				<button
					class="variant-filled-surface btn btn-sm card-hover m-1"
					on:click={() => deleteAsset(id, toastStore)}
				>
					<span><i class="fa-solid fa-trash text-sm"></i></span>
					<span>Delete</span>
				</button>
			{/if}
		</div>
	</div>
	<!--menu button-->
	<div id="ButtonActions">
		<!-- this button is used to display the menu of actions which can be taken on the asset e.g. delete,expand,share or edit-->
		<button
			type="button"
			class="btn btn-sm"
			on:click={() => (showMenu == 'none' ? (showMenu = 'initial') : (showMenu = 'none'))}
			><i class="fa-solid fa-ellipsis-vertical"></i></button
		>
	</div>
	<!--asset details-->
	<div id="assetName" class="h3" style="margin:10px; font-weight: bold; margin-bottom: 3px;">
		<!-- eslint-disable svelte/no-at-html-tags-->
		{@html name}
	</div>
	<div class="m-0 mb-1 p-0">
		<a
			style="font-weight: 500"
			class="variant-soft chip m-0 ml-2 p-2 hover:variant-filled"
			href={link.startsWith('http') ? link : 'http://' + link}
		>
			<span><i class="fa-solid fa-paperclip"></i></span><span>{@html link}</span></a
		>
	</div>
	<!--This creates the button which enables to open the expanded view of the assets data type-->
	<button
		on:click={() => modalStore.trigger(expandType)}
		style="margin: 10px; font-weight: 500; margin-top:0;">{@html type}</button
	>

	{#if viewType == 0}
		<hr />
		<div class="ml-2 mt-1">
			<!-- metadata -->
			{#each Object.entries(metadata) as [field, value]}
				<!-- eslint-disable svelte/no-at-html-tags-->
				{#if Array.isArray(value)}
					⦿ {@html highlight(field, keywordSearchInput)}:
					{#each value as item}
						<br />
						{#if (item + '').startsWith('DOCUMENT-ID: ')}
							{#await fetchDocumentByID(('' + item).replace('DOCUMENT-ID: ', ''))}
								&nbsp;&nbsp;&nbsp;&nbsp; <i class="fa-solid fa-stroopwafel"></i>
								<span>Loading association</span>
							{:then document}
								&nbsp;&nbsp;&nbsp;&nbsp; <i class="fa-solid fa-stroopwafel"></i>
								{#if Object.keys(document).length == 0}
									<span style="color: red; font-weight: bold;">Deleted item</span>
								{:else}
									<AssociationCard {document} />
								{/if}
							{/await}
						{:else}
							<!-- eslint-disable svelte/no-at-html-tags-->
							&nbsp;&nbsp;&nbsp;&nbsp; ⦿ {@html highlight(item, keywordSearchInput)}
						{/if}
					{/each}
				{:else if (value + '').startsWith('DOCUMENT-ID: ')}
					<i class="fa-solid fa-stroopwafel"></i>
					{@html highlight(field, keywordSearchInput)}:
					{#await fetchDocumentByID(('' + value).replace('DOCUMENT-ID: ', ''))}
						<span>Loading association</span>
					{:then document}
						{#if Object.keys(document).length == 0}
							<span style="color: red; font-weight: bold;">Deleted item</span>
						{:else}
							<AssociationCard {document} {keywordSearchInput} />
						{/if}
					{/await}
				{:else}
					⦿ {@html highlight(field, keywordSearchInput)}:
					<!-- eslint-disable svelte/no-at-html-tags-->
					{@html highlight(value, keywordSearchInput)}
				{/if}
				<br />
			{/each}
		</div>
	{/if}
</div>

<style>
	#Asset {
		margin: 10px;
		padding: 10px;
		flex-grow: 1;
		position: relative;
	}

	#ButtonActions {
		position: absolute;
		top: 10px;
		right: 20px;
		width: 10px;
	}
</style>

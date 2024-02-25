<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	import { deleteDocument, fetchDocuments } from '../api/apiRequests';
	import { highlight } from './keywordSearch';
	const toastStore = getToastStore();

	export let name: string;
	export let id: string;
	export let link: string;
	export let type: string;
	export let metadata: any;
	export let keywordSearchInput: string[] = [];

	async function deleteAsset() {
		await deleteDocument('Asset', id);
		toastStore.trigger({
			message: 'Asset deleted',
			background: 'variant-ghost-success',
			timeout: 3000
		});
	}

	let showMenu = 'none';
</script>

<div id="Asset" class="card card-hover bg-modern-50 drop-shadow-md">
	<div
		id="menuPopup"
		class="card card-hover p-3 drop-shadow-md"
		style="display: {showMenu}; position: absolute; right:10px; top: 10px; border-radius: 10px;"
	>
		<div class="">
			<button class="variant-filled-surface btn btn-sm card-hover m-1">
				<span><i class="fa-solid fa-maximize"></i></span>
				<span>Expand</span>
			</button>
			<button class="variant-filled-surface btn btn-sm card-hover m-1">
				<span><i class="fa-solid fa-pen"></i></span>
				<span>Edit</span>
			</button>
			<button class="variant-filled-surface btn btn-sm card-hover m-1" on:click={deleteAsset}>
				<span><i class="fa-solid fa-trash text-sm"></i></span>
				<span>Delete</span>
			</button>
		</div>
	</div>
	<div id="ButtonActions">
		<button
			type="button"
			class="btn btn-sm"
			on:click={() => (showMenu == 'none' ? (showMenu = 'initial') : (showMenu = 'none'))}
			><i class="fa-solid fa-ellipsis-vertical"></i></button
		>
	</div>
	<div class="h3" style="margin:10px; font-weight: bold; margin-bottom: 3px;">{@html name}</div>
	<div class="m-0 mb-1 p-0">
		<a
			style="font-weight: 500"
			class="variant-soft chip m-0 ml-2 p-2 hover:variant-filled"
			href="http://{link}"
		>
			<span><i class="fa-solid fa-paperclip"></i></span><span>{@html link}</span></a
		>
	</div>

	<div style="margin: 10px; font-weight: 500; margin-top:0;">{@html type}</div>
	<hr />
	<div class="ml-2 mt-1">
		<!-- ( -->
		{#each Object.entries(metadata) as [field, value]}
			⦿ {@html highlight(field, keywordSearchInput)}:
			{#if Array.isArray(value)}
				{#each value as item}
					<br />
					&nbsp;&nbsp;&nbsp;&nbsp; ⦿ {@html highlight(item, keywordSearchInput)}
				{/each}
			{:else}
				{@html highlight(value, keywordSearchInput)}
			{/if}
			<br />
		{/each}
	</div>
	<!-- <div style="margin: 10px; font-weight: 500">Fields required:</div>
	<ul>
		{#each metadataFields as field}
			<li>
				⦿ {field.field}
				<span class="assetCard card variant-ghost-surface badge">{field.dataType}</span>
				{#if field.list}
					<span class="assetCard card variant-ghost-surface badge">Multi-value</span>
				{/if}
			</li>
		{/each}
	</ul> -->
</div>

<style>
	#Asset {
		margin: 10px;
		padding: 10px;
		flex-grow: 1;
		position: relative;
	}
	li {
		margin-top: 5px;
		margin-left: 20px;
	}
	li span {
		margin-left: 5px;
		padding: 2px 5px;
	}
	#ButtonActions {
		position: absolute;
		top: 10px;
		right: 20px;
		width: 10px;
	}
</style>

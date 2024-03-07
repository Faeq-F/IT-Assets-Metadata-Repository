<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import '../node_modules/@joint/plus/joint-plus.css';
	import { onMount } from 'svelte';
	import { dia, ui, shapes } from '@joint/plus/joint-plus.js';



	export let id: string;
	export let assetName: string;
	export let assetLink: string;
	export let assetType: string;
	export let metadataFields: any;

	const modalStore = getModalStore();
</script>

<div class=" bg-surface-100-800-token h-screen w-screen p-52">
	<div class=" m-9">
		<i style="font-size: 1.7em;" class=" fa-solid fa-fingerprint inline"></i>
		<p class="h3 mt-1 inline">{id}</p>
	</div>
	<div class=" ml-14">
		<div class="h1" style="margin:10px; font-weight: bold;">
			{assetName}
		</div>
		<div class="m-0 mb-1 p-0">
			<a
				style="font-weight: 500"
				class="variant-soft chip m-0 ml-2 p-2 hover:variant-filled"
				href={assetLink.startsWith('http') ? assetLink : 'http://' + assetLink}
			>
				<span><i class="fa-solid fa-paperclip"></i></span><span>{assetLink}</span></a
			>
		</div>
		<div class="h3" style="margin:10px; font-weight: bold;">
			{assetType}
		</div>
		<br />
		<hr />
		<br />
		<div class="ml-2 mt-1 text-lg">
			<!-- metadata -->
			{#each Object.entries(metadataFields) as [field, value]}
				⦿ {field}:
				{#if Array.isArray(value)}
					{#each value as item}
						<br />
						&nbsp;&nbsp;&nbsp;&nbsp; ⦿ {item}
					{/each}
				{:else}
					{value}
				{/if}
				<br />
			{/each}
		</div>
	</div>
</div>

<button
	class="variant-filled-primary btn absolute bottom-3 right-3"
	on:click={() => modalStore.close()}>Close</button
>

<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';

	export let id: string;
	export let assetName: string;
	export let assetLink: any[];
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
			{assetLink}
			{assetType}
		</div>
		<div style="margin: 10px; font-weight: 500" class=" text-lg">Fields required:</div>
		<ul class="text-md">
			{#each Object.entries(metadataFields) as field}
				<li class="mb-1">
					{field}
					<!-- &nbsp;&nbsp;&nbsp;&nbsp;⦿ {field.field}
					<span class="assetCard card variant-ghost-surface badge">{field.dataType}</span>
					{#if field.list}
						<span class="assetCard card variant-ghost-surface badge">Multi-value</span>
					{/if} -->
				</li>
			{/each}
		</ul>
	</div>
</div>

<button
	class="variant-filled-primary btn absolute bottom-3 right-3"
	on:click={() => modalStore.close()}>Close</button
>

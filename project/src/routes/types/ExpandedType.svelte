<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';

	export let id: string;
	export let typeName: string;
	export let metadataFields: any[];

	const modalStore = getModalStore();
</script>

<div class=" bg-surface-100-800-token h-screen w-screen p-24">
	<div class="h-full overflow-y-scroll">
		<div class=" m-9">
			<i style="font-size: 1.7em;" class=" fa-solid fa-fingerprint inline"></i>
			<p class="h3 mt-1 inline">{id}</p>
		</div>
		<div class=" ml-14">
			<div class="h1" style="margin:10px; font-weight: bold;">
				{typeName}
			</div>
			<div style="margin: 10px; font-weight: 500" class=" text-lg">Fields required:</div>
			<ul class="text-md">
				{#each metadataFields as field}
					<li class="mb-1">
						&nbsp;&nbsp;&nbsp;&nbsp;⦿ {field.field}
						<span class="assetCard card variant-ghost-surface badge">{field.dataType}</span>
						{#if field.list}
							<span class="assetCard card variant-ghost-surface badge">Multi-value</span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<button
	class="variant-filled-primary btn absolute bottom-3 right-3"
	on:click={() => modalStore.close()}>Close</button
>

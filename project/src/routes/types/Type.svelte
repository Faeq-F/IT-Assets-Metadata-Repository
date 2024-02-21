<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { deleteAssetType } from './deleteType';

	export let id: string;
	export let typeName: string;
	export let metadataFields: any[];

	const menuPopup: PopupSettings = {
		event: 'click',
		target: 'menuPopup',
		placement: 'top'
	};
</script>

<div
	id="menuPopup"
	class="card variant-filled-surface z-10 w-72 p-4 shadow-xl"
	data-popup="menuPopup"
>
	<button style="margin: 0 auto;" on:click={() => deleteAssetType(id)}>
		<i class="fa-solid fa-trash text-sm"></i>
	</button>
	<div class="bg-surface-100-800-token arrow" />
</div>

<div id="Type" data-assettypeid={id} class="">
	<div class="h3" style="margin:10px; font-weight: bold;">
		<button type="button" class="btn btn-sm"
			><i class="fa-solid fa-ellipsis-vertical" use:popup={menuPopup}></i></button
		>
		{typeName}
	</div>
	<div style="margin: 10px; font-weight: 500">Fields required:</div>
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
	</ul>
</div>

<style>
	#Type {
		position: relative;
		padding: 10px;
		border-radius: 5px;
		background-color: #ffffff;
		box-shadow:
			rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
			rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
		margin: 10px;
		padding: 20px;
	}
	li {
		margin-top: 5px;
		margin-left: 20px;
	}
	li span {
		margin-left: 5px;
		padding: 2px 5px;
	}
	button {
		position: absolute;
		top: 10px;
		right: 5px;
	}
	#menuPopup {
		width: 10px;
		padding: 10px;
		height: 40px;
	}
</style>

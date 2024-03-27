<script lang="ts">
	import { fetchDocumentByID, updateDocument } from '$lib/apiRequests';
	import InputAssociation from '$lib/components/customInputs/InputAssociation.svelte';
	import { generatePreSavedAssociations } from '$lib/scripts/associations';
	import { getModalStore, getToastStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { updateContainer } from './Container';
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	toastStore.trigger({
		message: 'You may have to refresh teh association list',
		background: 'variant-ghost-warning',
		timeout: 3000
	});

	let name: string = $modalStore[0].meta.container.ContainerName;
	let description: string = $modalStore[0].meta.container.ContainerDescription;
	const requiredField: PopupSettings = {
		event: 'hover',
		target: 'requiredField',
		placement: 'top'
	};
</script>

<div class="bg-initial card p-4" data-popup="requiredField">
	<p>Required Field</p>
	<div class="bg-initial arrow" />
</div>

<div class="makeAssets card p-5 shadow-xl" id="makeTypePopup">
	<div class="card bg-modern-50 h-full p-5">
		<header class="h2 card-header text-center">Update Container</header>
		<br /><br />
		<form id="rootCreateTypeForm">
			<label for="typeName" class="formlabel text-center">
				<p class="p-1">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Container Name:
				</p>
				<input
					type="text"
					id="typeName"
					name="typeName"
					placeholder="Enter name"
					data-focusindex="0"
					class="input w-96"
					bind:value={name}
				/>
			</label>
			<br />
			<label for="Description" class="formlabel text-center">
				<p class="p-4">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Description:
				</p>
				<textarea
					id="Description"
					name="Description"
					placeholder="Enter Description"
					data-focusindex="0"
					class="input w-9/12 rounded-2xl"
					style="resize: both; overflow:auto;"
					rows="4"
					bind:value={description}
				/>
			</label>
			<br />
			<label id="values" for="assetType" class="formlabel text-center">
				<p class="p-4 text-center">Values:</p>
				{#if $modalStore[0].meta.container.ContainerType == 'Assets'}
					<InputAssociation
						list
						fieldName="Values"
						associationType="Asset"
						presavedAssociation={generatePreSavedAssociations(
							$modalStore[0].meta.container.ContainerValues,
							'Asset'
						)}
						style="margin: 5px auto;"
					/>
				{:else}
					<InputAssociation
						list
						fieldName="Values"
						associationType="User"
						presavedAssociation={generatePreSavedAssociations(
							$modalStore[0].meta.container.ContainerValues,
							'User'
						)}
						style="margin: 5px auto;"
					/>
				{/if}
			</label>
			<br />
			<hr />
			<br />
			<button
				class="variant-filled-primary btn w-52"
				style="margin: 0 auto; display:block;"
				id="assetMaker"
				on:click|preventDefault={() =>
					updateContainer($modalStore, name, description, toastStore, modalStore)}
				>Update Container</button
			>
		</form>
	</div>
</div>

<style>
	.makeAssets {
		height: 70vh;
		width: 70vw;
	}

	form {
		position: relative;
		top: initial;
	}

	#rootCreateTypeForm {
		height: 75%;
		overflow-y: scroll;
	}
</style>

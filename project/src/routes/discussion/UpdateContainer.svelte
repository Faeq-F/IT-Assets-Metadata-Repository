<script lang="ts">
	import InputAssociation from '$lib/components/customInputs/InputAssociation.svelte';
	import { getModalStore, getToastStore, popup } from '@skeletonlabs/skeleton';
	import { updateContainer } from './Container';
	import { generatePreSavedAssociations } from '$lib/components/customInputs/InputAssociation';
	import RequiredField from '$lib/components/cards/RequiredField.svelte';
	import { requiredField } from '$lib/components/cards/RequiredField';
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	toastStore.trigger({
		message: 'You may have to refresh teh association list',
		background: 'variant-ghost-warning',
		timeout: 3000
	});

	let name: string = $modalStore[0].meta.container.ContainerName;
	let description: string = $modalStore[0].meta.container.ContainerDescription;
</script>

<RequiredField />

<div class="makeAssets card p-5 shadow-xl" id="makeTypePopup">
	<div class="card h-full bg-modern-50 p-5">
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
					updateContainer(name, description, toastStore, modalStore, $modalStore)}
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

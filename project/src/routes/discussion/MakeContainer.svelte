<script lang="ts">
	import { updateDocument } from '$lib/apiRequests';
	import InputAssociation from '$lib/components/customInputs/InputAssociation.svelte';
	import { getModalStore, getToastStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { makeContainer } from './Container';
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let name: string;
	let description: string;
	const requiredField: PopupSettings = {
		event: 'hover',
		target: 'requiredField',
		placement: 'top'
	};
	let type: string;
</script>

<div class="bg-initial card p-4" data-popup="requiredField">
	<p>Required Field</p>
	<div class="bg-initial arrow" />
</div>

<div class="makeAssets card p-5 shadow-xl" id="makeTypePopup">
	<div class="card bg-modern-50 h-full p-5">
		<header class="h2 card-header text-center">Make a Container</header>
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
			<label for="assetType" class="formlabel text-center">
				<p class="p-4 text-center">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> What the container is
					holding:
				</p>
				<select id="assetType" class="select w-96" bind:value={type}>
					<option>Assets</option>
					<option>Users</option>
				</select>
			</label>
			<br />
			<label id="values" for="assetType" class="formlabel text-center">
				<p class="p-4 text-center">Values:</p>
				{#if type == 'Assets'}
					<InputAssociation
						list
						fieldName="Values"
						associationType="Asset"
						presavedAssociation={undefined}
						style="margin: 5px auto;"
					/>
				{:else}
					<InputAssociation
						list
						fieldName="Values"
						associationType="User"
						presavedAssociation={undefined}
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
					makeContainer(modalStore, toastStore, name, description, type, $modalStore)}
				>Make Container</button
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

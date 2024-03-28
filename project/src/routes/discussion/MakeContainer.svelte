<script lang="ts">
	import InputAssociation from '$lib/components/customInputs/InputAssociation.svelte';
	import { getModalStore, getToastStore, popup } from '@skeletonlabs/skeleton';
	import { makeContainer } from './Container';
	import RequiredField from '$lib/components/cards/RequiredField.svelte';
	import { requiredField } from '$lib/components/cards/RequiredField';
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let name: string;
	let description: string;
	let type: string;
</script>

<RequiredField />
<div class="makeContainer card p-5 shadow-xl" id="makeContainer">
	<div class="card h-full bg-modern-50 p-5">
		<header class="h2 card-header text-center">Make a Container</header>
		<br /><br />
		<form id="rootCreateForm">
			<label for="containerName" class="formlabel text-center">
				<p class="p-1">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Container Name:
				</p>
				<input
					type="text"
					id="containerName"
					name="containerName"
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
			<label for="type" class="formlabel text-center">
				<p class="p-4 text-center">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> What the container is
					holding:
				</p>
				<select id="type" class="select w-96" bind:value={type}>
					<option>Assets</option>
					<option>Users</option>
				</select>
			</label>
			<br />
			<label id="values" for="values" class="formlabel text-center">
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
				id="containerMaker"
				on:click|preventDefault={() =>
					makeContainer(name, description, type, modalStore, $modalStore, toastStore)}
				>Make Container</button
			>
		</form>
	</div>
</div>

<style>
	.makeContainer {
		height: 70vh;
		width: 70vw;
	}

	form {
		position: relative;
		top: initial;
	}

	#rootCreateForm {
		height: 75%;
		overflow-y: scroll;
	}
</style>

<script lang="ts">
	import { getToastStore, popup } from '@skeletonlabs/skeleton';
	import { makeType, removeBottom, addMetadataField } from './MakeType';
	import RequiredField from '$lib/components/cards/RequiredField.svelte';
	import { requiredField } from '$lib/components/cards/RequiredField';

	const toastStore = getToastStore();
	let fieldsSaved: any[] = [];
	let fieldListable: boolean = false;
</script>

<RequiredField />

<div class="makeAssets card p-5 shadow-xl" id="makeTypePopup">
	<div class="card h-full bg-modern-50 p-5">
		<header class="h2 card-header text-center">Make an Asset Type</header>
		<br /><br />
		<form id="rootCreateTypeForm">
			<label for="typeName" class="formlabel text-center">
				<p class="p-1">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Type Name:
				</p>
				<input
					type="text"
					id="typeName"
					name="typeName"
					placeholder="Enter Type Name"
					data-focusindex="0"
					class="input w-96"
				/>
			</label>
			<br />
			<label for="metadataFields" class="formlabel text-center">
				<p class="inline p-1">Metadata Fields:</p>
				<button
					class="absolute right-4 inline cursor-pointer text-sm"
					on:click|preventDefault={() => {
						fieldsSaved = removeBottom(fieldsSaved);
					}}
				>
					remove bottom field
				</button>
				<div class="min-h-24">
					<ul class="list" id="createdMetadataFieldsList">
						{#each fieldsSaved as field}
							<li class="">
								<span class="flex-auto">
									⦿ {field.field}
									<span class="card variant-ghost-surface badge">{field.dataType}</span>
									{#if field.list}
										<span class="card variant-ghost-surface badge">Multi-value</span>
									{/if}
								</span>
							</li>
						{/each}
					</ul>
				</div>
			</label>
			<br />

			<label for="addMetadata" class="formlabel text-center">
				<p class="p-1">Add a metadata field:</p>
				<button
					id="metadataFieldAdder"
					class=" card card-hover h-3 w-3 border-2 border-modern-600 shadow-md"
					on:click|preventDefault={() => {
						fieldsSaved = addMetadataField(toastStore, fieldsSaved, fieldListable);
					}}><i class="fa-solid fa-plus"></i></button
				>
				<input
					type="text"
					id="addMetadataFieldName"
					name="addMetadataFieldName"
					placeholder="Field name, e.g. Author"
					data-focusindex="0"
					class="input w-auto"
				/>
				<select id="addMetadataFieldDataType" class="select w-auto">
					<option>Select data type</option>
					<option>Text</option>
					<option>Number</option>
					<option>Account</option>
					<option>Asset</option>
				</select>
				<span style="display: inline-block;">
					<input class="checkbox" type="checkbox" bind:checked={fieldListable} />
					{#if fieldListable}
						The Field holds a list
					{:else}
						The Field is a single value
					{/if}
				</span>
			</label>
			<br />
			<hr />
			<br />
			<button
				class="variant-filled-primary btn w-52"
				style="margin: 0 auto; display:block;"
				id="assetMaker"
				on:click|preventDefault={() => makeType(toastStore, fieldsSaved)}>Make Type</button
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

	#metadataFieldAdder {
		width: 2vw;
		height: 2vw;
		margin-left: 10px;
		padding: 0;
		display: inline;
	}
</style>

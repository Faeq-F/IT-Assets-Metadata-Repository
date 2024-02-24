<script lang="ts">
	import { getToastStore, SlideToggle } from '@skeletonlabs/skeleton';
	import { insertDocument } from '../api/apiRequests';
	const toastStore = getToastStore();

	function makeType() {
		var name = (document.getElementById('typeName') as HTMLInputElement).value;
		if (name == '') {
			toastStore.trigger({
				message: 'Please give the type a name',
				background: 'variant-ghost-error',
				timeout: 3000
			});
		} else {
			var typeObject = { typeName: name, metadataFields: fieldsSaved };
			const data = new FormData();
			data.append('newData', JSON.stringify(typeObject));
			insertDocument('AssetType', data)
				.then((response) => {
					console.log(response);
					toastStore.trigger({
						message: 'Asset Type created',
						background: 'variant-ghost-success',
						timeout: 3000
					});
				})
				.catch((err) => {
					console.log(err);
					toastStore.trigger({
						message: 'Unable to create type - does one of the same name already exist?',
						background: 'variant-ghost-error',
						timeout: 3000
					});
				});
		}
	}

	let fieldsSaved: any[] = [];
	let fieldListable: boolean = false;

	function removeBottom(): void {
		fieldsSaved.pop();
		fieldsSaved = fieldsSaved; //required for reactivity
	}

	function addMetadataField() {
		let name = (document.getElementById('addMetadataFieldName') as HTMLInputElement).value;
		let typeList = document.getElementById('addMetadataFieldDataType') as HTMLSelectElement;
		let type = typeList.options[typeList.selectedIndex].text;
		if (name == '') {
			toastStore.trigger({
				message: 'Please give the field a name',
				background: 'variant-ghost-error',
				timeout: 3000
			});
		} else if (type == 'Select data type') {
			toastStore.trigger({
				message: 'Please choose a data type for the field',
				background: 'variant-ghost-error',
				timeout: 3000
			});
		} else {
			fieldsSaved = [...fieldsSaved, { field: name, dataType: type, list: fieldListable }];
		}
	}
</script>

<div class="makeAssets card p-5 shadow-xl" id="makeTypePopup">
	<div class="card h-full bg-modern-50 p-5">
		<header class="h2 card-header text-center">Make an Asset Type</header>
		<br /><br />
		<form id="rootCreateTypeForm">
			<label for="typeName" class="formlabel text-center">
				<p class="p-1">Type Name:</p>
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
					on:click|preventDefault={removeBottom}
				>
					remove bottom field
				</button>

				<ul class="list" id="createdMetadataFieldsList">
					{#each fieldsSaved as field}
						<li class="">
							<span class="flex-auto">
								{field.field}
								<span class="card variant-ghost-surface badge">{field.dataType}</span>
								{#if field.list}
									<span class="card variant-ghost-surface badge">Multi-value</span>
								{/if}
							</span>
						</li>
					{/each}
				</ul>
			</label>
			<br />

			<label for="addMetadata" class="formlabel text-center">
				<p class="p-1">Add a metadata field:</p>
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
					<SlideToggle name="list" bind:checked={fieldListable} active="bg-primary-700"
						>{#if fieldListable}
							The Field holds a list
						{:else}
							The Field is a single value
						{/if}
					</SlideToggle>
				</span>
				<button
					id="metadataFieldAdder"
					class=" card card-hover border-2 border-modern-600 shadow-md"
					on:click|preventDefault={addMetadataField}><i class="fa-solid fa-plus"></i></button
				>
			</label>
			<br />
			<button
				class="variant-filled-primary btn w-52"
				style="margin: 0 auto; display:block;"
				id="assetMaker"
				on:click|preventDefault={makeType}>Make Type</button
			>
		</form>
	</div>
</div>

<style>
	/* @import url('$lib/styles/card.css'); */
	/* @import url('$lib/styles/makeModal.css'); */

	.makeAssets {
		height: 70vh;
		width: 70vw;
	}

	form {
		position: relative;
		top: initial;
	}

	#metadataFieldAdder {
		width: 2vw;
		height: 2vw;
		margin-left: 10px;
		padding: 0;
		display: inline;
	}
	/* #rootCreateTypeForm {
		height: 75%;
		overflow-y: scroll;
	} */
</style>

<script lang="ts">
	import { getToastStore, SlideToggle } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { insertDocument } from '../api/apiRequests';
	import { injectTypeDivs } from './typeDivInjection';

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

			injectTypeDivs();
		}
	}

	let fieldsSaved: any[] = [];

	let currentFieldAddition: boolean = false;

	function removeBottom(): void {
		fieldsSaved.pop();
		loadValuesIntoMetadataFieldsList();
	}

	function loadValuesIntoMetadataFieldsList() {
		let list = document.getElementById('createdMetadataFieldsList') as HTMLUListElement;
		let temp = '';
		for (let field of fieldsSaved) {
			temp += `<li class="variant-ghost-surface card"><span class="flex-auto">${field.field} is of type ${field.dataType} and it is ${field.list} that it can hold a list</span></li>`;
		}
		list.innerHTML = temp;
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
			fieldsSaved.push({ field: name, dataType: type, list: currentFieldAddition });
			loadValuesIntoMetadataFieldsList();
		}
	}
</script>

<div class="makeAssets card w-72 p-4 shadow-xl" data-popup="makeTypePopup" id="makeTypePopup">
	<div class="Card">
		<header class="h2">Make an Asset Type</header>
		<br /><br />
		<form id="rootCreateTypeForm">
			<label for="typeName" class="formlabel">
				<p>Type Name:</p>
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
			<label for="metadataFields" class="formlabel">
				<p class="inline">Metadata Fields:</p>
				<p class="absolute right-4 inline cursor-pointer text-sm" on:click={removeBottom}>
					remove bottom field
				</p>
				<ul class="list" id="createdMetadataFieldsList"></ul>
			</label>
			<br />
			<label for="addMetadata" class="formlabel">
				<p>Add a metadata field:</p>
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
				<button id="metadataFieldAdder" class="CardButton Card" on:click={addMetadataField}
					>➕</button
				>
				<span style="margin-top: 10px;display: block;">
					<SlideToggle name="list" bind:checked={currentFieldAddition} active="bg-primary-700"
						>{#if currentFieldAddition}
							The Field holds a list
						{:else}
							The Field is a single value
						{/if}
					</SlideToggle>
				</span>
			</label>
			<br />
			<button class="variant-filled-primary btn w-52" id="assetMaker" on:click={makeType}
				>Make Type</button
			>
		</form>
	</div>
</div>

<style>
	@import url('$lib/styles/card.css');
	@import url('$lib/styles/makeModal.css');
	#makeTypePopup {
		position: absolute;
		top: 50% !important;
		left: 50% !important;
		transform: translate(-50%, -50%);
		width: 50vw;
		height: 60vh;
		z-index: 2;
	}
	#metadataFieldAdder {
		width: 2vw;
		height: 2vw;
		margin-left: 10px;
		padding: 0;
		display: inline;
	}
	#rootCreateTypeForm {
		height: 75%;
		overflow-y: scroll;
	}
</style>

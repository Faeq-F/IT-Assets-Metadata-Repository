<script lang="ts">
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	export let id: string;
	export let typeName: string;
	export let metadataFields: any[];

	let NewTypeName: string = typeName;
	let NewTypeFields: any[] = metadataFields;

	const modalStore = getModalStore();

	function updateType() {
		let tempNewTypeFields = [];
		let ul = document.getElementById('createdMetadataFieldsList')?.getElementsByTagName('li');
		if (ul) {
			for (let i of ul) {
				let inputs = i.getElementsByTagName('input');
				let select = i.getElementsByTagName('select');
				let checkbox = false;
				let name = '';
				for (let i of inputs) {
					if (i.classList.contains('checkbox')) {
						checkbox = i.checked;
					} else {
						name = i.value;
					}
				}
				tempNewTypeFields.push({ field: name, dataType: select[0].value, list: checkbox });
			}
		}
		let NewTypeObject = { typeName: NewTypeName, metadataFields: tempNewTypeFields };
		console.log(NewTypeObject);
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
			NewTypeFields = [...NewTypeFields, { field: name, dataType: type, list: fieldListable }];
		}
	}

	let fieldListable: boolean;

	function removeField(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		const fieldSpan = event.currentTarget.parentElement;
		let inputs = fieldSpan?.getElementsByTagName('input');
		let select = fieldSpan?.getElementsByTagName('select');
		let name = '';
		//let checkbox = false;
		if (inputs && select) {
			for (let i of inputs) {
				if (!i.classList.contains('checkbox')) {
					// 	checkbox = i.checked;
					// } else {
					name = i.placeholder;
				}
			}
			//let fieldToRemove = { field: name, dataType: select[0].value, list: checkbox };
			NewTypeFields = NewTypeFields.filter((field) => field.field != name);
		}
	}
</script>

<div class=" bg-surface-100-800-token h-screen w-screen p-52">
	<div class=" m-9">
		<i style="font-size: 1.7em;" class=" fa-solid fa-fingerprint inline"></i>
		<p class="h3 mt-1 inline">{id}</p>
	</div>
	<div class=" ml-14">
		<div class="h1" style="margin:10px; font-weight: bold;">
			<input
				class="input variant-form-material !rounded-lg"
				bind:value={NewTypeName}
				id="typeName"
				placeholder={typeName}
			/>
		</div>
		<div style="margin: 10px; font-weight: 500" class=" text-lg">Fields required:</div>
		<label for="metadataFields" class="formlabel">
			<div class=" relative h-72 overflow-y-scroll">
				<ul class="list" id="createdMetadataFieldsList">
					{#each NewTypeFields as field}
						<li class="">
							<span class="flex-auto">
								⦿ <input
									class="input variant-form-material inline w-6/12 !rounded-lg"
									value={field.field}
									placeholder={field.field}
								/>
								<select
									id="addMetadataFieldDataType"
									class="select variant-form-material w-auto"
									value={field.dataType}
								>
									<option>Select data type</option>
									<option>Text</option>
									<option>Number</option>
									<option>Account</option>
									<option>Asset</option>
								</select>
								<input class="checkbox" type="checkbox" checked={field.list} /> Multi-Value
								<button class="variant-ghost btn btn-sm ml-4" on:click={removeField}
									><i class="fa-solid fa-trash text-sm"></i></button
								>
							</span>
						</li>
					{/each}
				</ul>
			</div>
		</label>
		<br />
		<hr />
		<br />
		<label for="addMetadata" class="formlabel text-center">
			<p class="p-1">Add a metadata field:</p>
			<button
				id="metadataFieldAdder"
				class=" card card-hover h-10 w-10 border-2 border-modern-600 shadow-md"
				on:click|preventDefault={addMetadataField}><i class="fa-solid fa-plus"></i></button
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
	</div>
</div>
<div class="absolute bottom-3 right-36">
	<button
		class="variant-filled-primary btn m-2"
		on:click={() => {
			updateType();
			// modalStore.close();
		}}>Update</button
	>
	<button class="variant-filled-primary btn absolute m-2" on:click={() => modalStore.close()}
		>Close</button
	>
</div>

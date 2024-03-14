<script lang="ts">
	export let fieldName: string;
	export let dataType: string;
	export let presavedValues: string[] | number[] | undefined;

	let currentInputValue: string | number;
	let listOfValues: any[];

	if (presavedValues === undefined) {
		listOfValues = [];
	} else {
		listOfValues = presavedValues;
	}

	function addNextValue(evt: KeyboardEvent): any {
		if (evt.key === 'Enter' || evt.keyCode === 13) {
			listOfValues = [...listOfValues, currentInputValue];
			currentInputValue = '';
		} else if (
			(evt.key === 'Backspace' || evt.key === 'Delete' || evt.keyCode == 8 || evt.keyCode == 46) &&
			currentInputValue == ''
		) {
			listOfValues.pop();
			listOfValues = listOfValues;
		}
	}
</script>

<div id={fieldName + '-ListInputCollector'}>
	<p>Saved (This field is Multi-Value):</p>

	{#if listOfValues.length == 0}
		Nothing saved <button
			on:click|preventDefault={() => {
				listOfValues = listOfValues;
			}}>(Refresh)</button
		>
	{:else}
		<ul>
			{#each listOfValues as item}
				<li
					class="card variant-ringed w-6/12 p-2 shadow-md"
					style="margin: 5px;"
					{...$$restProps}
					data-itemSaved={item}
				>
					{item}
				</li>
			{/each}
		</ul>
	{/if}
</div>

{#if dataType == 'number'}
	<input
		id={fieldName + '-InputList'}
		class="input w-6/12"
		type="number"
		bind:value={currentInputValue}
		on:keyup|preventDefault={addNextValue}
		placeholder="hit ⏎ to add numbers, or ⌫ to remove them"
	/>
{:else}
	<input
		id={fieldName + '-InputList'}
		class="input w-6/12"
		type="text"
		bind:value={currentInputValue}
		on:keyup|preventDefault={addNextValue}
		placeholder="hit ⏎ to add strings of text, or ⌫ to remove them"
	/>
{/if}

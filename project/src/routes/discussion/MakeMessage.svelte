<script lang="ts">
	import { insertDocument } from '$lib/apiRequests';
	import { getToastStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import Cookies from 'js-cookie';

	let boardName: string;
	let description: string;
	const toastStore = getToastStore();

	async function Message() {}
</script>

<div class="makeAssets card p-5 shadow-xl" id="makeAssetPopup">
	<div class="card bg-modern-50 h-full p-5">
		<form id="rootCreateAssetForm" class="text-center">
			<br />
			<label for="Description" class="formlabel">
				<p class="p-4 text-center">Message:</p>
				<textarea
					id="Description"
					name="Description"
					placeholder="Enter Message"
					data-focusindex="0"
					class="input w-9/12 rounded-2xl"
					style="resize: both; overflow:auto;"
					rows="9"
					bind:value={description}
				/>
			</label>
			<button
				class="variant-filled-primary btn w-52"
				style="margin: 0 auto; display:block;"
				id="assetMaker"
				on:click|preventDefault={() => {
					console.log('');
				}}>Submit</button
			>
		</form>
	</div>
</div>

<style>
	.makeAssets {
		height: 70vh;
		width: 70vw;
	}

	#rootCreateAssetForm {
		height: 75%;
		overflow-y: scroll;
	}
</style>

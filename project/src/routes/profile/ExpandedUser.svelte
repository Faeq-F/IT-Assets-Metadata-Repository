<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
    /*
		these lines export the following variables so that
		they can be imported and used elsewhere in the code
	*/
	export let id: string; 
	export let username: string;
	export let email: string;
	export let role: string;

    // gets the modalStore
	const modalStore = getModalStore();
</script>

<div class=" bg-surface-100-800-token h-screen w-screen p-24">
	<div class="h-full overflow-y-scroll">
		<div class=" m-9">
			<i style="font-size: 1.7em;" class=" fa-solid fa-fingerprint inline"></i>
			<p class="h3 mt-1 inline">{id}</p>
		</div>
		<div class="ml-14">
			<div class="h1" style="margin:10px; font-weight: bold;">
				{username}
			</div>
			<div style="margin: 10px; font-weight: 500" class=" text-lg">{email}</div>
			<div style="margin: 10px; font-weight: 500" class=" text-md">{role}</div>
		</div>
	</div>
</div>

<!--this makes the close button which closes the modal-->
<button
	{...$$restProps}
	class="variant-filled-primary btn absolute bottom-3 right-3"
	on:click={() => modalStore.close()}>Close</button
>

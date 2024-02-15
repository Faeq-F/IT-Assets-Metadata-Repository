<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { onMount } from 'svelte';
	import { AppBar, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	import { injectTypeDivs } from './typeDivInjection';
	import MakeType from './MakeType.svelte';

	let areThereAssetTypes = false;

	onMount(() => {
		if (browser) {
			injectTypeDivs().then((thereAre: boolean) => (areThereAssetTypes = thereAre));
		}
	});

	const makeTypePopup: PopupSettings = {
		event: 'click',
		target: 'makeTypePopup',
		placement: 'bottom',
		closeQuery: ''
	};
</script>

<svelte:head>
	<title>Asset types</title>
</svelte:head>

<h1 class="h1">Asset types management</h1>
<br />
<div>
	<div class="Card" id="assetHeader">
		<AppBar background="transparent">
			<svelte:fragment slot="lead">
				{#if areThereAssetTypes}
					<p id="nothingHere">Your types:</p>
				{:else}
					<p id="nothingHere">
						It doesn't look like you have any types yet, click the ➕ to get started
					</p>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<button id="assetMaker" class="CardButton Card" use:popup={makeTypePopup}>➕</button>
				<MakeType />
			</svelte:fragment>
		</AppBar>
	</div>
</div>

<div class="typesContainer"></div>

<style>
	@import url('$lib/styles/root.css');
	@import url('$lib/styles/card.css');

	#assetMaker {
		width: 2vw;
		height: 2vw;
		padding: 0;
		float: right;
	}

	#nothingHere {
		display: inline;
		float: left;
	}

	#assetHeader {
		height: auto;
		padding: 0px;
	}

	#assetHeader::after {
		content: '';
		clear: both;
		display: table;
	}

	.typesContainer {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		width: 90%;
		margin: 10px auto;
	}
</style>

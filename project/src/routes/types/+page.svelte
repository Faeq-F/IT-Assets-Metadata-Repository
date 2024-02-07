<script>
	import { Content, Modal, Trigger } from 'sv-popup';
	import MakeType from './MakeType.svelte';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { injectTypeDivs } from './typeDivInjection';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	injectTypeDivs();

	let AreThereTypes = false;
	onMount(() => {
		if (browser) {
			if (document.getElementsByClassName('typesContainer')[0].firstChild) {
				AreThereTypes = true;
			}
		}
	});
</script>

<svelte:head>
	<title>Asset types</title>
</svelte:head>

<h1 class="h1">Asset types management</h1>
<br />
<div>
	<div class="card" id="assetHeader">
		<AppBar background="transparent">
			<svelte:fragment slot="lead">
				{#if AreThereTypes}
					<p id="nothingHere">Your types:</p>
				{:else}
					<p id="nothingHere">
						It doesn't look like you have any types yet, click the ➕ to get started
					</p>
				{/if}
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<Modal>
					<Content>
						<MakeType />
					</Content>
					<Trigger>
						<button id="assetMaker" class="cardButton card">➕</button>
					</Trigger>
				</Modal>
			</svelte:fragment>
		</AppBar>
	</div>
</div>

<div class="typesContainer"></div>

<style>
	@import url('$lib/styles/card.css');

	h1 {
		text-align: center;
		margin-top: 15vh;
	}
	#bottom {
		margin-top: 150vh;
	}

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

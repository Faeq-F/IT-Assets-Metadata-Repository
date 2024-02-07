<script>
	import { Content, Modal, Trigger } from 'sv-popup';
	import MakeType from './MakeType.svelte';
	import { AppBar } from '@skeletonlabs/skeleton';
	import MakeAsset from '../assets/makeAsset.svelte';
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
				<p id="nothingHere">
					It doesn't look like you have any types yet, click the ➕ to get started
				</p>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<Modal>
					<Content>
						<MakeAsset />
					</Content>
					<Trigger>
						<button id="assetMaker" class="cardButton card">➕</button>
					</Trigger>
				</Modal>
			</svelte:fragment>
		</AppBar>
	</div>
</div>

<div class="assetsContainer">
	<div class="assetCard card">Example Type Card 1</div>
</div>

<p id="bottom">Something at the bottom to see navbar animation work</p>

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

	.assetsContainer {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		width: 90%;
		margin: 10px auto;
	}
</style>

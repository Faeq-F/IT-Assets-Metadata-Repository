<script>
	import { Content, Modal, Trigger } from 'sv-popup';
	import MakeType from './MakeType.svelte';
</script>

<svelte:head>
	<title>Asset types</title>
</svelte:head>

<h1>Asset types management</h1>
<div class="card" id="assetHeader">
	<Modal>
		<Content>
			<MakeType />
		</Content>
		<Trigger>
			<button id="assetMaker" class="card cardButton">➕</button>
		</Trigger>
	</Modal>
	<p id="nothingHere">It doesn't look like you have any types yet, click the ➕ to get started</p>
</div>

<div class="assetsContainer">
	<div class="card assetCard">Example Type Card 1</div>
</div>

<p id="bottom">Something at the bottom to see navbar animation work</p>

<style>
	@import url('$lib/styles/root.css');
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
		height: 4vh;
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

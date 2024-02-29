<script>
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
</script>

<div style="padding: 10px;">
	<div class=" bg-surface-50-900-token sticky rounded-3xl drop-shadow-md">
		<AppBar
			gridColumns="grid-cols-3"
			slotDefault="place-self-center"
			slotTrail="place-content-end"
			class="header"
			background="bg-transparent"
		>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase"
					><i class="fa-brands fa-codepen"></i>&nbsp;&nbsp;IT Assets Metadata Repository
				</strong>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<LightSwitch width="w-10" height="h-5" />
				<a class="bg-transparent btn btn-sm" href="/home" rel="noreferrer"> Home </a>
				<a class="bg-transparent btn btn-sm" href="/assets" rel="noreferrer"> Assets </a>
				<a class="bg-transparent btn btn-sm" href="/types" rel="noreferrer"> Types </a>

				<a href="/profile" rel="noreferrer"><i class="fa-solid fa-circle-user text-3xl"></i></a>
			</svelte:fragment>
		</AppBar>
	</div>
</div>

<script lang="ts">
	import { Doughnut } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import { onMount } from 'svelte';
	import { fetchDocuments } from '$lib/apiRequests';
	import getRandomColor from '$lib/scripts/randomThemeColor';
	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	let data = {
		labels: [''],
		datasets: [
			{
				data: [0],
				backgroundColor: [''],
				label: ' assets of this type'
			}
		]
	};

	onMount(async () => {
		await fetchDocuments('Asset').then(async (AssetDocs) => {
			await fetchDocuments('AssetType').then(async (TypeDocs) => {
				const myMap = new Map();
				for (let i of TypeDocs) {
					myMap.set(i.typeName, 0);
				}
				for (let i of AssetDocs) {
					myMap.set(i.assetType, myMap.get(i.assetType) + 1);
				}
				data.labels.pop();
				data.datasets[0].data.pop();
				data.datasets[0].backgroundColor.pop();
				for (let [key, value] of myMap) {
					if (value > 0) {
						data.labels.push(key);
						data.datasets[0].data.push(value);
						data.datasets[0].backgroundColor.push(getRandomColor());
					}
				}
			});
		});
		data = data; // for reactivity - update the view when the graph is ready
	});
</script>

<Doughnut {data} options={{ responsive: true }} />

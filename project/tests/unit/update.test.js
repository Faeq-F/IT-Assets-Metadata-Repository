import { expect, test } from 'vitest';
import { updateDocument } from '../../src/routes/api/apiRequests.ts';

test("UpdateAssetType", async () => {
	const data = new FormData();
	data.append('newData', JSON.stringify([{typeName:'g',metadataFields:[]}]));
	return updateDocument('AssetType','65d4aa1ce91cc1e107af75e1', data).then((response) => {
		console.log(response);
	});


})
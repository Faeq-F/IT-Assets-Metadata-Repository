//remember to wrap these in onMount checks

/**
 * Gets documents from a collection in the database & returns them in json form
 * @param collectionName The collection to fetch documents from
 * @returns The documents in the collection
 */
export const fetchDocuments = (collectionName: string) => {
	return fetch('http://localhost:5038/api/get/collection/' + collectionName)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			return data;
		});
};

/**
 * Inserts a document into a collection in the database
 * @param collectionName The collection to insert a document into
 * @param formData The FormData object that holds the document to insert in the 'newData' key
 * @returns Acknowledgment from the database
 */
export const insertDocument = (collectionName: string, formData: any) => {
	return fetch('http://localhost:5038/api/insert/collection/' + collectionName, {
		method: 'POST',
		body: formData
	})
		.then((response) => {
			return response;
		})
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err;
		});
};

/**
 * Deletes a document from a collection in the database
 * @param collectionName The collection to delete a document from
 * @param documentID The _id value of the document to delete
 * @returns Acknowledgment from the database, including json representing the original document that has now been removed
 */
export const deleteDocument = (collectionName: string, documentID: string) => {
	return fetch(
		'http://localhost:5038/api/delete/collection/' + collectionName + '/document/' + documentID,
		{
			method: 'DELETE'
		}
	)
		.then((response) => {
			return response;
		})
		.then((data) => {
			return data;
		})
		.catch((err) => {
			return err;
		});
};

/**
 * Updates a document in a collection from the database
 * @param collectionName The collection that holds the document to update
 * @param formData The FormData object that holds the document to update in the 'newData' key. The document must have it's _id passed
 * @returns Acknowledgment from the database
 */
export const updateDocuments = (collectionName: string, formData: any) => {
	return fetch('http://localhost:5038/api/update/' + collectionName, {
		method: 'PUT',
		body: formData
	})
		.then((response) => {
			return response;
		})
		.then((data) => {
			return data;
		});
};

import Cookies from 'js-cookie';

/**
 * Creates an object representing the user that is currently logged in, through browser cookies
 * @returns an object representing the user that is currently logged in
 * @author Christian-Frederick Cubos - zlac145@live.rhul.ac.uk
 */
function getCurrentUser(): {
	username: string | undefined;
	passwordHash: string | undefined;
	role: string | undefined;
} {
	return {
		username: Cookies.get('savedLogin-username'),
		passwordHash: Cookies.get('savedLogin-password'),
		role: Cookies.get('savedLogin-role')
	};
}

//remember to wrap these in onMount checks

/**
 * Gets documents from a collection in the database & returns them in JSON form.
 * @param collectionName The collection to fetch documents from
 * @returns The documents in the collection
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export const fetchDocuments = (collectionName: string): Promise<any> => {
	return fetch('http://localhost:5038/api/get/collection/' + collectionName).then((response) => {
		return response.json();
	});
};

/**
 * Gets a document from the database & returns it in JSON form
 * @param id The id of the document to fetch
 * @returns The fetched document, {} if it doesn't exist
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 * @author Hossam Babari - zlac241@live.rhul.ac.uk
 */
export const fetchDocumentByID = (id: string): Promise<any> => {
	return fetch('http://localhost:5038/api/get/document/' + id).then((response) => {
		return response.json();
	});
};

/**
 * Inserts a document into a collection in the database
 * @param collectionName The collection to insert a document into
 * @param formData The FormData object that holds the document (stringified JSON) to insert in the 'newData' key
 * @returns Acknowledgment from the database
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 * @author Hossam Babari - zlac241@live.rhul.ac.uk
 * @author Christian-Frederick Cubos - zlac145@live.rhul.ac.uk
 */
export const insertDocument = (collectionName: string, formData: any): Promise<any> => {
	formData.set('userData', JSON.stringify(getCurrentUser()));
	return fetch('http://localhost:5038/api/insert/collection/' + collectionName, {
		method: 'POST',
		body: formData
	})
		.then(async (response) => {
			return await response.json();
		})
		.catch((err) => {
			return err;
		});
};

/**
 * Updates a document in a collection from the database
 * @param collectionName The collection that holds the document to update
 * @param id The _id of the document to update
 * @param formData The FormData object that holds the document (stringified JSON) to update in the 'newData' key.
 * @returns Acknowledgment from the database
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 * @author Hossam Babari - zlac241@live.rhul.ac.uk
 * @author Christian-Frederick Cubos - zlac145@live.rhul.ac.uk
 */
export const updateDocument = (collectionName: string, id: string, formData: any): Promise<any> => {
	// adds user details into formData
	formData.set('userData', JSON.stringify(getCurrentUser()));
	return fetch(
		'http://localhost:5038/api/update/collection/' + collectionName + '/document/' + id,
		{
			method: 'PUT',
			body: formData
		}
	).then((response) => {
		return response;
	});
};

/**
 * Deletes a document from a collection in the database
 * @param collectionName The collection to delete a document from
 * @param documentID The _id of the document to delete
 * @returns Acknowledgment from the database, including JSON representing the original document that has now been removed
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 * @author Hossam Babari - zlac241@live.rhul.ac.uk
 * @author Christian-Frederick Cubos - zlac145@live.rhul.ac.uk
 */
export const deleteDocument = (collectionName: string, documentID: string): Promise<any> => {
	const formData = new FormData();
	formData.set('userData', JSON.stringify(getCurrentUser()));
	return fetch(
		'http://localhost:5038/api/delete/collection/' + collectionName + '/document/' + documentID,
		{
			method: 'DELETE',
			body: formData
		}
	)
		.then((response) => {
			return response;
		})
		.catch((err) => {
			return err;
		});
};

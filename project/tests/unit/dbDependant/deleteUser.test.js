import { assert, test } from 'vitest';
import { deleteDocument, insertDocument, fetchDocuments } from '$lib/apiRequests';
import { hashCode } from '$lib/scripts/validate';

const password = 'password123';
const passwordHash = hashCode(password);
const username = "testDeletingUser";
const email = "testDelete@mail.com";
const role = 'viewer';
const userObj = { username: username, passwordHash: passwordHash, email: email, role: role};

test('Delete user account', async () => {
    // Create a new user and insert it into the database
    const data = new FormData();
    data.append('newData', JSON.stringify(userObj));
    insertDocument('User', data);

    fetchDocuments('User').then((documentsReturned) => {
        for (let i of documentsReturned) {
            if (i.username == username) {
                
                //User was found, so delete it from the table
                deleteDocument('User', i._id);

                // Check if the user appears in the table again
                fetchDocuments('User').then((documentsReturned) => {
                    for (let i of documentsReturned) {
                        if (i.username == username) {
                            assert.fail('User should not exist in the table after deletion')
                        }
                    }
                 })
            } 
        }

        assert.fail('Inserted user not found')

    })

    
});

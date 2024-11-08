
1. create (cloud) firestore database
2. click on "Start collection" 
    - collection name: team
    - save it
3. click on "Add document"
    - create your first team
    - document ID should match code used sign ups
4. Select recently created document and add these fields
    - name (your team name visible in Team meetings or Contacts list)
    - users[] (users array where user.uids will be stored, make sure that there are not empty strings in array after creation)
5. Go to [Rules] tab at the top and paste these rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read; 
    }
    // Make sure the uid of the requesting user matches name of the user
    // document. The wildcard expression {userId} makes the userId variable
    // available in rules.
    match /users/{userId} {
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /user_interactions/{userId} {
    	allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /team/{teamId} { // can only write if user belongs to the team
    	allow write: if request.auth != null;
    }
  }
}
```
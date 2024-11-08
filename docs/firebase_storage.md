
# mandatory

1. create to create new storage at the top
2. once done, select [Rules] tab at the top
3. paste these rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024 && request.resource.contentType.matches('image/.*');
    }
  }
}
```


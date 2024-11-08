
1. Click to create firebase realtime database
2. after setup go to [Rules] tab and copy/paste these rules below

```
{
  "rules": {
    ".read": "auth !== null",  // 2022-01-13
    ".write": false,  // 2022-01-13 
      
    "missed_calls":{
      ".write": true, // userA can adjsut userB or other way around
    },
    
    "presence_v2":{
      "$userId":{
        ".write": "$userId === auth.uid", // only can adjust your own presence
      }
    },
    "private_call":{ // old one, in case anything is tested on main
    // "$inviteeId":{
      	// "$inviterId":{
      		// ".write": "$inviteeId === auth.uid || $inviterId === auth.id", // doesnt work like that???
      	// }
    // }
      	".write": "auth !== null"
    },
    "private_call_v2":{
      	// "$inviteeId":{
      	// "$inviterId":{
      		// ".write": "$inviteeId === auth.uid || $inviterId === auth.id", // doesnt work like that???
      	// }
    	// }
      	".write": "auth !== null"
    },
      
    "team_call_v2":{ // effective with version >= 1.1.0
      "$teamId":{
        ".write" : true, // TODO - only users within the team can alter this. Do we store teamUid in auth or get (slower) from db everytime?
      }
    },
      
    "team_presence_v2":{
      "$teamId":{
        "$userId":{
          ".write": "$userId === auth.uid",
        }
      }
    },

    "company_users_state":{
      "$companyId":{
        "$userId":{
          ".write" : "$userId === auth.uid",
        }
      }
    }
      
  }
}
```
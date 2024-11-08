# create account

Create account at https://www.100ms.live/

# create app

1. go to https://dashboard.100ms.live
2. on side navigation click - Templates
3. click a button to "Create your first app"
4. then select tempalte named "Video Conferencing starter"

# setup roles

1. go to https://dashboard.100ms.live
2. on side navigation click - Templates
3. create guest role with no permissions (disable audio, video, screen share)
4. this role should "subscribe to" existing roles (user and host)
5. for permissions - mark only "can receive preview room state"
6. click save

# advanced settings

1. go to Your app
2. choose "Advanced Settings"
3. make sure that all roles in "Roles with room-state permission" are marked in dropdown

# user/host role
1. go to https://dashboard.100ms.live
2. on side navigation click - Templates
3. select "user" role on the left side submenu
4. under "Publich strategies" set "Video Aspect ratio" as 16:9
5. make sure that this role is subscribed to "user and host"

# video quality
- by default video quality is set to 360p in 100ms live dashboard
- if  you trust internet connection of users, you can increase it via "Templates" page in 100ms live dashbaord


# save 100ms app data to "functions/.env"
1. go to https://dashboard.100ms.live
2. on the left side nav click "Templates" and select your app
3. will need to copy "Template ID" into "functions/.env" and update HMS_TEMPLATE_ID
4. on the left side nav click "Developer"
5. copy "App access key" and update variable HMS_ACCESS_KEY in "functions/.env"
6. copy "App secret" and update variable HMS_SECRET in "functions/.env"
7. done


# quicker updates? (need testing)
TODO - should we set "Room-state Message Interval (in seconds)" to lower than 10s? This exists in "Advanced settings" within Templates page

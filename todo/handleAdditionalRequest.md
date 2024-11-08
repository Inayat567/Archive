
If person is already in a call - show a notification about incoming additional call

realtime db
- change realtime db key to private_calls/user_id/inviter_id

app
- change listeners for private calls
- if minimized - unminimize and focus app on extra request

outgoing 
- change how request is sent (different key)
- (BIG) if user is already in a call - he/she wont hear you right away.. so need more states to handle that (invite -> joined -> accept/reject?)

incoming
- change how information is received (url includes inviter uid)
- show popup about new incoming call
- redirect to new call page


team call
- 

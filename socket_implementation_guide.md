Chat Socket Implementation Guide
এই guide-টা `web` আর `Flutter app` developer দুজনের জন্য। এখানে chat socket integration-এর exact flow, event contract, payload shape, আর recommended implementation pattern দেওয়া আছে।
Overview
Socket server: `http://localhost:7777/ws`
Protocol: `socket.io`
Auth: JWT token required
Socket payload rule: request payload and response payload keys use `snake\\\_case`
Client emit rule: `conversation\\\_id`, `user\\\_id`, `message\\\_ids` style keys use করতে হবে, `conversationId` / camelCase accepted না
Delivery rule: socket event only ওই user বা users-দের কাছেই যাবে যাদের জন্য event relevant
Main use cases:
realtime new message
delivered/read status
typing indicator
online/offline presence
incoming/ended call notification
Connection
Socket connect করার সময় JWT token পাঠাতে হবে।
Web example
```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:7777/ws', {
  auth: {
    token: JWT\\\_TOKEN,
  },
  transports: \\\['websocket'],
  reconnection: true,
});
```
App example
```js
const socket = io(`${BASE\\\_URL}/ws`, {
  auth: { token: accessToken },
  transports: \\\['websocket'],
  reconnection: true,
});
```
Flutter example
Package recommendation: `socket\\\_io\\\_client`
```dart
import 'package:socket\\\_io\\\_client/socket\\\_io\\\_client.dart' as IO;

final socket = IO.io(
  'http://localhost:7777/ws',
  IO.OptionBuilder()
      .setTransports(\\\['websocket'])
      .disableAutoConnect()
      .setAuth({'token': jwtToken})
      .enableReconnection()
      .build(),
);

socket.connect();
```
Alternative auth
`Authorization: Bearer <token>` header দিয়েও token read করা যায়, কিন্তু app/web দুই জায়গায় `auth.token` use করাই cleaner।
Connection Lifecycle
Client listens
`connection:ok`
Successful auth-এর পর server emit করবে:
```json
{
  "user\\\_id": "USER\\\_ID"
}
```
`connection:error`
Unauthorized বা deleted user হলে:
```json
{
  "code": "UNAUTHORIZED",
  "message": "Unauthorized"
}
```
বা:
```json
{
  "code": "UNAUTHORIZED",
  "message": "Your session is no longer valid. Please log in again."
}
```
Recommended client behavior
`connection:ok` পেলে socket ready state set করো
`connection:error` পেলে logout বা re-login flow trigger করো
reconnect হলে current open conversation আবার join করো
Must Join Conversation Room
`typing` পাওয়ার জন্য conversation room join করা লাগবে। `message:new` আর status event targeted user room দিয়েও আসতে পারে।
Client emits
`conversation:join`
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID"
}
```
Server emits
`conversation:joined`
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID"
}
```
`error:conversation`
Invalid payload বা membership না থাকলে:
```json
{
  "code": "BAD\\\_REQUEST",
  "message": "conversation\\\_id required"
}
```
বা:
```json
{
  "code": "JOIN\\\_FAILED",
  "message": "Not a member of conversation"
}
```
Recommended rule
user যখন conversation open করবে, তখনই `conversation:join` emit করো
reconnect-এর পর active/open conversation আবার `join` করো
conversation list load করলেই সব room join করার দরকার নেই
emit payload-এ camelCase key দিও না
Incoming Server Events
`message:new`
নতুন message এলে intended user বা users এটা পাবে।
Practical delivery rule:
new message -> sender + intended recipients
not a full blind broadcast
```json
{
  "id": "MESSAGE\\\_ID",
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "sender": {
    "id": "USER\\\_ID",
    "name": "Sender Name"
  },
  "content": {
    "text": "Hello"
  },
  "attachments": \\\[],
  "reply\\\_to": null,
  "status": "SENT",
  "created\\\_at": "2026-05-24T10:00:00.000Z"
}
```
Client action
active conversation হলে message append করো
active না হলে conversation preview update করো
sender আমি না হলে unread count increment করো
active conversation-এ sender আমি না হলে immediately read flow চালাও
`message:status`
Message receipt status update।
Practical delivery rule:
`DELIVERED` / `READ` status -> only affected message sender(s)
full conversation room broadcast না
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "user\\\_id": "READER\\\_OR\\\_RECEIVER\\\_ID",
  "status": "DELIVERED",
  "message\\\_ids": \\\["MSG\\\_1", "MSG\\\_2"]
}
```
Possible `status` values:
`SENT`
`DELIVERED`
`READ`
Client action
own sent message bubble-এ status icon update করো
যদি `last\\\_message` own message হয় এবং `message\\\_ids`-এ থাকে, conversation list preview status-ও update করো
`message:read`
Conversation-level read activity signal।
Practical delivery rule:
only relevant sender side-এ যাবে
reader already নিজের action জানে, তাই unnecessary room-wide emit avoid করা হয়
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "user\\\_id": "READER\\\_ID",
  "at": "2026-05-24T10:00:00.000Z"
}
```
Client action
optional event
UI refresh trigger করতে পারো
primary double-tick logic `message:status` দিয়েই handle করা উচিত
`typing`
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "user\\\_id": "USER\\\_ID",
  "user\\\_name": "User Name",
  "on": true
}
```
Client action
current open conversation হলে typing bar দেখাও
`on: false` বা timeout-এ typing hide করো
`presence:update`
```json
{
  "user\\\_id": "USER\\\_ID",
  "online": true
}
```
Client action
DM header-এ online/offline show করা যায়
conversation list presence badge থাকলে update করো
`call:incoming`
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "call\\\_session\\\_id": "CALL\\\_SESSION\\\_ID",
  "started\\\_by": "USER\\\_ID",
  "started\\\_at": "2026-05-24T10:00:00.000Z",
  "room\\\_name": "group-call-abc12345-def67890",
  "conversation\\\_type": "GROUP",
  "conversation\\\_title": "Group Chat",
  "caller": {
    "id": "USER\\\_ID",
    "name": "Caller Name",
    "username": "caller\\\_username",
    "avatar": "https://example.com/avatar.png"
  },
  "kind": "AUDIO",
  "at": "2026-05-24T10:00:00.000Z"
}
```
`call:ended`
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "by\\\_user\\\_id": "USER\\\_ID",
  "at": "2026-05-24T10:00:00.000Z"
}
```
Note
RTC controller + signaling API এখন active, আর gateway-level realtime notification events-ও ready আছে।
`call:participant\\\_joined`
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "call\\\_session\\\_id": "CALL\\\_SESSION\\\_ID",
  "participant\\\_count": 3,
  "joined\\\_at": "2026-05-24T10:00:00.000Z",
  "user": {
    "id": "USER\\\_ID",
    "name": "Maria Smith",
    "username": "maria",
    "avatar": "https://example.com/avatar.png"
  },
  "participant": {
    "id": "CALL\\\_PARTICIPANT\\\_ID",
    "user\\\_id": "USER\\\_ID",
    "camera": true,
    "microphone": true,
    "is\\\_screen\\\_sharing": false
  }
}
```
`call:participant\\\_left`
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "call\\\_session\\\_id": "CALL\\\_SESSION\\\_ID",
  "user\\\_id": "USER\\\_ID",
  "participant\\\_count": 2,
  "left\\\_at": "2026-05-24T10:00:00.000Z"
}
```
`call:participant\\\_updated`
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "call\\\_session\\\_id": "CALL\\\_SESSION\\\_ID",
  "participant": {
    "id": "CALL\\\_PARTICIPANT\\\_ID",
    "user\\\_id": "USER\\\_ID",
    "camera": false,
    "microphone": true,
    "is\\\_screen\\\_sharing": false
  }
}
```
`call:declined`
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "call\\\_session\\\_id": "CALL\\\_SESSION\\\_ID",
  "user\\\_id": "USER\\\_ID",
  "at": "2026-05-24T10:00:00.000Z"
}
```
Outgoing Client Events
`typing`
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "on": true
}
```
Stop typing:
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "on": false
}
```
Important
server-side throttle আছে
too frequent emit করার দরকার নেই
text input change-এ `on: true`
send/cancel/blur-এর সময় `on: false`
`message:read`
```json
{
  "conversation\\\_id": "CONVERSATION\\\_ID",
  "at": "2026-05-24T10:00:00.000Z"
}
```
Important
`message:read` emit করার আগে REST API call করো:
`PATCH /conversations/:conversation\\\_id/read`
socket event alone enough না
backend source of truth হলো HTTP mark-as-read + socket notify
Required REST + Socket Sequence
1. Open conversation
`GET /conversations`
user conversation select করবে
`socket.emit('conversation:join', { conversation\\\_id })`
`GET /conversations/:conversation\\\_id/messages`
2. Mark messages as read
newest incoming message id detect করো
`PATCH /conversations/:conversation\\\_id/read`
success হলে:
`socket.emit('message:read', { conversation\\\_id, at })`
3. Send message
`POST /conversations/:conversation\\\_id/messages`
backend Redis publish করবে
sender + intended recipient users `message:new` পাবে
receiver online থাকলে পরে `DELIVERED`
receiver read করলে `READ`
Status Transition
একটা normal outgoing message flow:
sender message send করল
initial status: `SENT`
receiver online socket connect করলে: `DELIVERED`
receiver conversation open/read করলে: `READ`
UI mapping recommendation
`SENT` -> single tick
`DELIVERED` -> double tick
`READ` -> highlighted double tick
Recommended Client State Updates
On `message:new`
messages list append
conversation preview text update
conversation `updated\\\_at` refresh
unread count update
On `message:status`
sent message bubble status update
last message status update if needed
On `message:read`
optional refresh
analytics/debug/logging
On `presence:update`
DM partner presence badge
On `typing`
show temporary typing indicator
Web Implementation Notes
Recommended web flow
login-এর পর JWT local storage বা secure storage-এ রাখো
chat layout mount হলে socket connect করো
conversation open হলে `conversation:join` emit করো
message API response আর realtime `message:new` দুইটাই merge করো
same message duplicate avoid করতে `message.id` দিয়ে check করো
active conversation-এ incoming message এলে read API call করে তারপর `message:read` emit করো
Recommended web structure
```js
function connectSocket(token) {
  const socket = io('http://localhost:7777/ws', {
    auth: { token },
    transports: \\\['websocket'],
    reconnection: true,
  });

  socket.on('connection:ok', onConnectionOk);
  socket.on('message:new', onMessageNew);
  socket.on('message:status', onMessageStatus);
  socket.on('message:read', onMessageRead);
  socket.on('typing', onTyping);
  socket.on('presence:update', onPresenceUpdate);

  return socket;
}
```
Recommended web read flow
```js
async function markConversationRead(conversationId, messageId, createdAt) {
  await fetch(`/api/conversations/${conversationId}/read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      up\\\_to\\\_message\\\_id: messageId,
    }),
  });

  socket.emit('message:read', {
    conversation\\\_id: conversationId,
    at: new Date(createdAt).toISOString(),
  });
}
```
Flutter Implementation Notes
Package recommendation
`socket\\\_io\\\_client`
`flutter\\\_secure\\\_storage` বা equivalent token storage
`connectivity\\\_plus` useful হতে পারে reconnect UX improve করতে
Recommended Flutter service class
```dart
import 'dart:async';
import 'package:socket\\\_io\\\_client/socket\\\_io\\\_client.dart' as IO;

class ChatSocketService {
  ChatSocketService(this.baseUrl, this.jwtToken);

  final String baseUrl;
  final String jwtToken;
  IO.Socket? socket;

  void connect() {
    socket = IO.io(
      '$baseUrl/ws',
      IO.OptionBuilder()
          .setTransports(\\\['websocket'])
          .disableAutoConnect()
          .setAuth({'token': jwtToken})
          .enableReconnection()
          .build(),
    );

    socket!.onConnect((\\\_) {
      print('socket connected');
    });

    socket!.on('connection:ok', (data) {
      print('connection ok: $data');
    });

    socket!.on('message:new', (data) {
      print('new message: $data');
    });

    socket!.on('message:status', (data) {
      print('message status: $data');
    });

    socket!.on('message:read', (data) {
      print('message read: $data');
    });

    socket!.on('typing', (data) {
      print('typing: $data');
    });

    socket!.on('presence:update', (data) {
      print('presence: $data');
    });

    socket!.connect();
  }

  void joinConversation(String conversationId) {
    socket?.emit('conversation:join', {
      'conversation\\\_id': conversationId,
    });
  }

  void emitTyping(String conversationId, bool on) {
    socket?.emit('typing', {
      'conversation\\\_id': conversationId,
      'on': on,
    });
  }

  void emitRead(String conversationId, DateTime at) {
    socket?.emit('message:read', {
      'conversation\\\_id': conversationId,
      'at': at.toIso8601String(),
    });
  }

  void dispose() {
    socket?.dispose();
    socket = null;
  }
}
```
Recommended Flutter screen flow
user chat screen-এ ঢুকলে socket connect আছে কি না check করো
conversation details load হলে `joinConversation(conversationId)` call করো
message list load করো
newest incoming unseen message থাকলে read API call করো
API success হলে `emitRead(conversationId, createdAt)` call করো
text field change-এ throttled `emitTyping(conversationId, true)` করো
send/submit/back press-এ `emitTyping(conversationId, false)` করো
Recommended Flutter state handling
`message:new` -> local messages list update
`message:status` -> own outgoing message tick update
`message:read` -> optional sync/logging
`typing` -> `ValueNotifier`, `Bloc`, `Cubit`, `Riverpod`, বা chosen state manager দিয়ে temporary indicator
`presence:update` -> DM header online/offline refresh
Recommended Flutter read flow
```dart
Future<void> markAsRead({
  required String conversationId,
  required String messageId,
  required DateTime createdAt,
}) async {
  await dio.patch(
    '/conversations/$conversationId/read',
    data: {
      'up\\\_to\\\_message\\\_id': messageId,
    },
  );

  socket.emit('message:read', {
    'conversation\\\_id': conversationId,
    'at': createdAt.toIso8601String(),
  });
}
```
Recommended Flutter lifecycle handling
app background থেকে resume হলে socket still connected কি না check করো
token expired হলে reconnect loop না চালিয়ে logout flow দাও
screen dispose হলে listeners detach করো
global socket রাখলে conversation-specific UI listeners cleanup করতে ভুলো না
Minimal Listener Setup
```js
socket.on('connection:ok', (payload) => {
  console.log('socket ready', payload.user\\\_id);
});

socket.on('conversation:joined', (payload) => {
  console.log('joined', payload.conversation\\\_id);
});

socket.on('message:new', (message) => {
  handleIncomingMessage(message);
});

socket.on('message:status', (payload) => {
  updateMessageStatuses(payload.message\\\_ids, payload.status);
});

socket.on('message:read', (payload) => {
  console.log('conversation read activity', payload);
});

socket.on('typing', (payload) => {
  handleTyping(payload);
});

socket.on('presence:update', (payload) => {
  handlePresence(payload);
});

socket.on('error:conversation', (payload) => {
  console.error(payload.message);
});

socket.on('error:message', (payload) => {
  console.error(payload.message);
});
```
Minimal Emit Setup
```js
socket.emit('conversation:join', {
  conversation\\\_id,
});

socket.emit('typing', {
  conversation\\\_id,
  on: true,
});

socket.emit('typing', {
  conversation\\\_id,
  on: false,
});

socket.emit('message:read', {
  conversation\\\_id,
  at: new Date().toISOString(),
});
```
Error Events
`error:conversation`
bad join payload
non-member trying to join
`error:message`
invalid read payload
failed read status update
Recommended behavior
log error
keep UI stable
if unauthorized-style issue হয়, re-fetch conversation or force logout depending on context
Best Practices
socket connect করার আগে JWT validate/store করো
active conversation ছাড়া `typing` emit কোরো না
conversation open না থাকলে `message:read` emit কোরো না
reconnect-এর পর active room rejoin করো
same message repeatedly read mark avoid করতে last-read cache রাখো
`message:status`-কেই double tick-এর main source ধরো
`message:new` পাওয়া মাত্র optimistic duplicate check করো
Important Backend Notes
Socket namespace fixed: `/ws`
user connect হলে backend pending `SENT` receipts কে `DELIVERED` করতে পারে
`message:read` event থেকে backend relevant sender side-এ `READ` signal পাঠায়
room name backend internally:
user room: `user:USER\\\_ID`
conversation room: `conv:CONVERSATION\\\_ID`
client থেকে এই room name পাঠাতে হবে না, শুধু event payload-ই যথেষ্ট
Suggested Implementation Checklist
Web
connect with JWT
listen all server events
join active conversation
send `typing`
call read API and then emit `message:read`
update ticks from `message:status`
Flutter App
app foreground এ reconnect support
chat screen open হলে join
background/resume-এ token validity check
read event duplicate avoid
local conversation list unread/status sync
Source Reference
gateway: `src/modules/chat/realtime/realtime.gateway.ts`
message status source: `src/common/repository/chat/chat.repository.ts`
sample web implementation: `public/frontend/chat/chat\\\_script.js`
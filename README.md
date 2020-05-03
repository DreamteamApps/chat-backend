# Online at
 ### API - https://dta-simplechat-backend.herokuapp.com/

# Socket events

### (client) join-room
```json
{
	"username" : "Erick"
}
```

### (client) leave-room

### (client) writing-message

### (client) send-message
```json
{
	"message" : "e ai",
	"type" : "text"
}
```

### (server) user-joined
```json
{
	"id" : "e ai",
	"username" : "text",
	"lastMessges": [
		{
			"type": "text",
			"message": "opa",
			"user": {
				"id": 1,
				"username": "Ricardo"
			}
		},
		{
			"type": "text",
			"message": "noiz",
			"user": {
				"id": 2,
				"username": "Daniel"
			}
		}
	]
}
```

### (server) user-leaved
```json
{
	"id": 1,
	"username": "Ricardo"
}
```

### (server) user-writing-message
```json
{
	"id": 1,
	"username": "Ricardo"
}
```

### (server) user-send-message
```json
{
	"type": "text",
	"message": "noiz",
	"user": {
		"id": 2,
		"username": "Daniel"
	}
}
```

# Test client 

cd test_client

npm install

node client.js

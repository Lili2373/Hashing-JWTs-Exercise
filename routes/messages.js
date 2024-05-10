const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Mock data for demonstration
let messages = [
    {
        id: 1,
        body: "Hello, how are you?",
        sent_at: new Date(),
        read_at: null,
        from_user: {
            username: "user1",
            first_name: "John",
            last_name: "Doe",
            phone: "123-456-7890"
        },
        to_user: {
            username: "user2",
            first_name: "Jane",
            last_name: "Doe",
            phone: "987-654-3210"
        }
    }
];

// GET /:id - get detail of message
app.get('/:id', (req, res) => {
    const messageId = parseInt(req.params.id);
    const message = messages.find(msg => msg.id === messageId);
    if (!message) {
        return res.status(404).json({ error: "Message not found" });
    }
    // Check if the logged-in user is either the sender or recipient
    // For demonstration, assuming user is logged in and its username is stored in req.user
    if (req.user.username !== message.from_user.username && req.user.username !== message.to_user.username) {
        return res.status(403).json({ error: "Unauthorized access" });
    }
    res.json({ message });
});

// POST / - post message
app.post('/', (req, res) => {
    const { to_username, body } = req.body;
    // Validate request body
    if (!to_username || !body) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    // For demonstration, assume sender's username is obtained from req.user
    const from_username = req.user.username;
    const sent_at = new Date();
    const id = messages.length + 1;
    const newMessage = {
        id,
        from_username,
        to_username,
        body,
        sent_at
    };
    messages.push(newMessage);
    res.json({ message: newMessage });
});

// POST /:id/read - mark message as read
app.post('/:id/read', (req, res) => {
    const messageId = parseInt(req.params.id);
    const message = messages.find(msg => msg.id === messageId);
    if (!message) {
        return res.status(404).json({ error: "Message not found" });
    }
    // Check if the user is the intended recipient
    // For demonstration, assuming user is logged in and its username is stored in req.user
    if (req.user.username !== message.to_user.username) {
        return res.status(403).json({ error: "Unauthorized access" });
    }
    // Mark the message as read
    message.read_at = new Date();
    res.json({ message });
});



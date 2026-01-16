import * as signalr from "https://cdn.jsdelivr.net/npm/@microsoft/signalr@8.0.0/+esm";

const connection = new signalr.HubConnectionBuilder()
    .withUrl("/records-hub")
    .withAutomaticReconnect()
    .build();

connection.on("RecordAdded", (record) => {
    const list = document.getElementById("eventsList");
    const li = document.createElement("li");
    li.className = "list-group-item list-group-item-success";
    li.textContent = `[${new Date().toLocaleTimeString()}] ${record.name}`;
    list.prepend(li);
});

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected via Modules");
        const btn = document.getElementById("btnSend");
        if (btn) btn.disabled = false;
    } catch (err) {
        console.error("Connection error:", err);
        setTimeout(start, 5000);
    }
}

start();

const form = document.getElementById("createForm");
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("recordInput");
        const recordName = input.value;

        const query = `
            mutation {
                addRecord(name: "${recordName}") {
                    id
                    name
                    createdAt
                }
            }
        `;

        await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });

        input.value = '';
    });
}
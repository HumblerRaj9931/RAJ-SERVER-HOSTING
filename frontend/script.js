const API_URL = "http://localhost:4000/api";

async function createBot(){
  const name = document.getElementById("botName").value;
  const repo = document.getElementById("repoUrl").value;
  const botToken = document.getElementById("botToken").value;

  const res = await fetch(`${API_URL}/create-service`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, repo, botToken })
  });
  const data = await res.json();
  alert("Service Created! Service ID: " + data.id);
}

async function getLogs(){
  const serviceId = document.getElementById("serviceId").value;
  const res = await fetch(`${API_URL}/logs/${serviceId}`);
  const data = await res.json();
  document.getElementById("logsOutput").innerText = JSON.stringify(data, null, 2);
                                                                   }

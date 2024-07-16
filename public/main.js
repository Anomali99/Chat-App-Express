const socket = io();
const clientTotal = document.getElementById("client-total");

const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clients-total", (data) => {
  clientTotal.innerText = `Total clients: ${data}`;
});

function sendMessage() {
  // console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addMessaggeToUI(true, data);
  messageInput.value = "";
}

socket.on("chat-message", (data) => {
  // console.log(data);
  addMessaggeToUI(false, data);
});

function addMessaggeToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `
        <li class="${isOwnMessage ? "message-right" : "message-left"}">
          <p class="message">
            ${data.message}
            <span>${isOwnMessage ? "My" : data.name} |
      ${new Date(data.dateTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} 
      ${new Date(data.dateTime).toLocaleDateString("id-ID")}
            </span>
          </p>
        </li>
  `;

  messageContainer.innerHTML += element;
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `✍🏻 ${nameInput.value} is typing a message`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `✍🏻 ${nameInput.value} is typing a message`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: `✍🏻 ${nameInput.value} is typing a message`,
  });
});

socket.on("feedback", (data) => {
  clearFeedback();
  const element = `
        <li class="message-feedback">
          <p id="feedback" class="feedback">${data.feedback}</p>
        </li>
  `;

  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}

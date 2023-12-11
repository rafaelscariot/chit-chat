const socket = io();

const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const clientsTotal = document.getElementById("clients-total");
const messageInput = document.getElementById("message-input");
const messageContainer = document.getElementById("message-container");

socket.on("clients-total", (data) => {
  clientsTotal.innerText = `Connected people: ${data}`;
});

socket.on("message", (data) => {
  addMessageToUI(false, data);
});

socket.on("feedback", (data) => {
  clearFeedback();

  const element = `
    <li class="message-feedback">
      <p class="feedback" id="feedback">${data.feedback}</p>
    </li>
  `;

  messageContainer.innerHTML += element;
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

messageInput.addEventListener("focus", (e) => {
  clearFeedback();

  socket.emit("feedback", {
    feedback: `💬 ${nameInput.value} is typing a message`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `💬 ${nameInput.value} is typing a message`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("feedback", {
    feedback: "",
  });
});

function sendMessage() {
  if (messageInput.value.trim() === "") return;

  const data = {
    dateTime: new Date(),
    name: nameInput.value,
    message: messageInput.value,
  };

  socket.emit("message", data);

  addMessageToUI(true, data);
}

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();

  const element = `
    <li class="${isOwnMessage ? "message-right" : "message-left"}">
      <p class="message">${data.message} <span>${data.name}, ${moment(
    data.dateTime
  ).fromNow()}</span></p>
    </li>
  `;

  messageContainer.innerHTML += element;

  messageInput.value = "";

  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

function clearFeedback() {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}

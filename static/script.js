var loader = document.getElementById('preloader');

window.addEventListener("load", function() {
    loader.style.display = "none";
});

document.getElementById("user-input").addEventListener("input",function(){
    var defaultMessage = document.querySelectorAll(".default-msg");
    defaultMessage.forEach(function(message){
        message.style.display="none";

    });
});


function sendMessage() {
    var userInput = document.getElementById("user-input").value;
    if (userInput.trim() !== "") {
        addToChat("You : " + userInput, 'user-message');
        document.getElementById("user-input").value = "";

        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        })
            .then(response => response.json())
            .then(data => {
                var botMessage = "Bot : " + data.message;
                addToChatWithTyping(botMessage);
            })
            .catch(error => console.error('Error:', error));
    }
}


function addToChatWithTyping(message) {
    var chatBox = document.getElementById("chat-box");
    var messageElement = document.createElement('p');
    messageElement.className = "bot-message";
    chatBox.appendChild(messageElement);

    var index = 0;
    var typingInterval = setInterval(function () {
        if (index < message.length) {
            if (message[index] === '<br>' && message[index - 1] === '<br>') {
                var marginDiv = document.createElement('div');
                marginDiv.style.marginBottom = '-8px';
                chatBox.appendChild(marginDiv);
                index++;
            } else {
                if (message[index] === '<br>') {
                    messageElement.innerHTML += '<br>';
                } else {

                    messageElement.innerHTML += message[index];
                }
                index++;
                chatBox.scrollTop = chatBox.scrollHeight;

            }
        } else {
            clearInterval(typingInterval);
        }
    }, 10);



}
function addToChat(message, imgSrc) {
    var chatBox = document.getElementById("chat-box");
    var messageElement = document.createElement('p');
    var imgElement = document.createElement('img');
    imgElement.src = imgSrc;
    imgElement.style.width = "50px";
    imgElement.style.height = "50px";
    messageElement.appendChild(imgElement);
    messageElement.textContent += message;
    messageElement.className = "user-message";
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;

}

document.getElementById("user-input").addEventListener("keypress", function (event) {
    if (event.keycode === 13 || event.which === 13) {
        event.preventDefault();
        sendMessage();
    }
});

function clearChat() {
    document.getElementById("chat-box").innerHTML = "";
}

document.addEventListener("keyup", function (event) {
    if (event.keycode === 46 || event.which === 46) {
        event.preventDefault();
        clearChat();
    }
});


function addToChat(message, className) {
    var chatBox = document.getElementById("chat-box");
    // chatBox.innerHTML += "<p>" + message + "</p>";
    var messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.classList.add(className);
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

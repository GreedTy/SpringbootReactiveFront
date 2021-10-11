let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#username").innerHTML = username;

const eventSource = new EventSource("http://localhost:8080/chat/roomNum/" + roomNum);


//const eventSource = new EventSource("http://localhost:8080/sender/kim/receiver/park");

eventSource.onmessage = (e) => {
    const data = JSON.parse(e.data);
    
    if (data.sender === username) {
        initMyMessage(data.message, data.createAt);
    } else {
        initYourMessage(data.message, data.createAt);
    }
}

function getSendMsgBox(msg, time) {
    return '<div class="sent_msg"><p>' + msg + '</p><span class="time_date"> ' + time +' | Today </span></div>';
}

function getReceiveMsgBox(msg, time) {
    return '<div class="received_withd_msg"><p>' + msg + '</p><span class="time_date"> ' + time +' | Today </span></div>';
}

function initMyMessage(message, createAt) {
    let chatBox = document.querySelector("#chat-box");

    let sendBox = document.createElement("div");
    sendBox.className = "outgoing_msg";

    sendBox.innerHTML = getSendMsgBox(message, createAt);
    chatBox.append(sendBox);

    document.documentElement.scrollTop = document.body.scrollHeight;
}

function initYourMessage(message, createAt) {
    let chatBox = document.querySelector("#chat-box");

    let receviedBox = document.createElement("div");
    receviedBox.className = "outgoing_msg";

    receviedBox.innerHTML = getReceiveMsgBox(message, createAt);
    chatBox.append(receviedBox);
}

// 해당 함수는 비동기로 진행되어야하기때문에 async사용
async function addMessage() {

    let msgInput = document.querySelector("#chat-outgoing-msg");

    let chat = {
        sender: username,
        roomNum: roomNum,
        message: msgInput.value
    };

    // 통신을 기다리기위해서 await 사용
    let response = await fetch("http://localhost:8080/chat", {
        method: "post",
        body: JSON.stringify(chat),
        headers: {
            "Content-Type":"application/json; charset=utf-8"
        }
    });

    msgInput.value = "";
}

document.querySelector("#chat-outgoing-button").addEventListener("click", () => {
    addMessage();
});

document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
        addMessage();
    }
});
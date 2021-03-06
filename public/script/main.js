var socket = io();
let nickName
let color

document.querySelector('.addNameBtn').addEventListener('click', (e) => {
    let nameInput = document.querySelector('#addNameWrapper input')
    let nameMsg = document.querySelector('.nameMsg')

    function colorMaker() {
        return `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`
    }

    if(!nameInput.value.length) {
        nameMsg.textContent = 'Add your nickname!'
    } else {
        nickName = nameInput.value
        color = colorMaker()

        let sendToServer = {
            nickName: nickName,
            usrMsg: 'is connected',
            color: color
        }

        document.querySelector('.nickNameTitle').textContent = `You are: ${nickName}`
        socket.emit('chat message', sendToServer)
        socket.emit('participants', nickName)
        document.querySelector('#addNameWrapper').remove()
    }
})

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()

    let usrMsg = document.querySelector('#m').value
    let sendToServer = {
        nickName: nickName,
        usrMsg: usrMsg,
        color: color
    }
    socket.emit('chat message', sendToServer)

    document.querySelector('#m').value = ''
})

document.querySelector('#m').addEventListener('input', (e) => {
    socket.emit('typingListener', `${nickName} is typing....`)
})

socket.on('chat message', (msgObj) => {
    let name = msgObj.nickName
    let msg = msgObj.usrMsg
    let color = msgObj.color
    let stringIntoDOM = typeof msgObj === 'string'
        ? msgObj
        : `<span style="color: ${color}" class="nameTag">${name}</span> -> ${msg}`

    document.querySelector('#messages').insertAdjacentHTML('beforeend', `<li>${stringIntoDOM}</li>`)
})

socket.on('participants', (names) => {
    let participantsList = document.querySelector('.participantsList')
    participantsList.innerHTML = ''
    names.forEach(name => participantsList.insertAdjacentHTML('beforeend', `<li>${name}</li>`))
})

function typeCheck() {
    let participants = {}

    return function(typer) {
        let caughtName = typer.split(' ')[0]
        let typerParagraph = document.querySelector(`.${caughtName}Typer`) || null

        if(caughtName !== nickName && !participants[caughtName]) {
            let p = document.createElement('p')
            let showTypers = document.querySelector('.showTypers')

            p.className = `${caughtName}Typer`
            p.textContent = typer

            showTypers.insertAdjacentElement('afterbegin', p)

            participants[caughtName] = true
        } else if(caughtName !== nickName) {
            typerParagraph.style.display = 'block'
        }

        setTimeout(() => {
            if(typerParagraph) typerParagraph.style.display = 'none'
        }, 500)
    }
}

let typChk = typeCheck()

socket.on('typingListener', (typer) => {typChk(typer)})

// TODO(tothricsaj): end it up!!!!
socket.on('connect', () => {
    console.log(socket.disconnected); // false
});


import axios from 'axios'

export default {
    register(callback) {
        window.addEventListener('message', receiveMessage.bind(this))
        registrationCallback = callback
    },

    unregister() {
        window.removeEventListener('message', receiveMessage.bind(this))
        callbacks.clear()
    },

    updateData(results) {
        let message = Object.assign({}, shell.messageTemplate)
        message.command = 'UpdateData'
        message.type = 0
        message.data = { results: results }

        callShell(message)
    },

    fetch(url) {
        const config = {
            headers: {
                "x-wac-rest-authorization": shell.activeConnection.properties.baseAuthorization,
                "x-wac-rest-SkipCertificateCheck": true
            }
        }

        let api = 'nodes/' + shell.activeConnection.name + '/' + url
        return axios.get(api, config)
    }
}

let shell = new Proxy({}, {
    set: function (target, prop, value) {
        target[prop] = value

        if (prop === 'connections') {
            target.connectionManagerReturned = true
        }

        if (prop === 'gateway') {
            target.gatewayManagerReturned = true
        }

        if (target.connectionManagerReturned && target.gatewayManagerReturned &&
            target.registrationCallbackData) {
            registrationCallback(target.registrationCallbackData)
        }

        return true
    }
})

let registrationCallback = () => { }
let callbacks = new Map()

function receiveMessage(event) {
    if (event.data.signature !== 'version 0.0.0') {
        return
    }

    if (event.data.type === 1) {
        processShellResponse(event.data)
        return
    }

    // queue the queries to get shell context.
    if (event.data.command === 'Ping' || event.data.command === 'Activate') {
        shell.messageTemplate = initMessageTemplate(event.data, event.origin)
        setTimeout(() => {
            forward(
                'connection-manager',
                result => {
                    shell.connections = result.connections
                    shell.activeConnection = result.activeConnection
                })

            forward(
                'gateway-connection',
                result => {
                    shell.gateway = result.gatewayName
                    axios.defaults.baseURL = result.gatewayName + '/api/'
                })
        }, 0)
    }

    // get the registration call data
    if (event.data.command === 'Open' || event.data.command === 'Activate') {
        shell.registrationCallbackData = event.data.data
    }

    // as of now, ignore all the other shell messages.
    var message = Object.assign({}, shell.messageTemplate)
    message.sequence = event.data.sequence
    message.data = { name: 'pong', version: '0.0.1', error: null, state: 0 }
    event.source.postMessage(message, event.origin)
}

function forward(service, callback) {
    let message = Object.assign({}, shell.messageTemplate)
    message.command = 'Forward'
    message.type = 0
    message.data = { type: 2, service: service }

    callShell(message, callback)
}

function callShell(message, callback) {
    message.sequence = Math.floor(Math.random() * 1000000)

    if (callback) {
        callbacks.set(message.sequence, r => callback(r))
    }

    parent.postMessage(message, message.origin)
}

function initMessageTemplate(source, origin) {
    return {
        origin: origin,
        sequence: source.sequence,
        command: source.command,
        srcName: source.destName,
        srcSubName: source.destSubName,
        destName: source.srcName,
        destSubName: source.srcSubName,
        version: source.version,
        signature: source.signature,
        srcDepth: 1,
        type: 1,
        data: {}
    }
}

function processShellResponse(data) {
    if (!data || !data.data || !data.data.result) {
        return;
    }

    if (callbacks.has(data.sequence)) {
        callbacks.get(data.sequence)(data.data.result)
        callbacks.delete(data.sequence)
    }
}

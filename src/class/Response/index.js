class Response {

    constructor(status, code, message, data) {
        this.status = status
        this.code = code
        this.message = message
        this.data = data
    }

    static success(message = '', data = []) {
        return new Response('Success', 200, message, data)
    }

    static error(message = 'Ocurrió un error', data = []) {
        return new Response('Error', 500, message, data)
    }

}

export default Response
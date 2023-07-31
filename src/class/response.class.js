class Response {

    constructor(status, message, data) {
        this.status = status
        this.message = message
        this.data = data
    }

    // ------------------------------------------------------

    static success(message = '', data = []) {
        return new Response('Success', message, data)
    }

    static added(message = 'Agregado', data = []) {
        return new Response('Success', message, data)
    }

    // ------------------------------------------------------

    static error(message = 'Ocurrió un error', data = []) {
        return new Response('Error', 500, message, data)
    }

    static notFound(message = 'No encontrado', data = []) {
        return new Response('Error', message, data)
    }

}

export default Response
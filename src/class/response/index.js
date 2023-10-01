class Response {

    constructor(status, response, message) {
        this.status = status
        this.message = message
        this.payload = response.docs ? response.docs.map(item => {
            return { ...item.toObject(), _id: item._id.toString() }
        }) : []

        delete response.docs

        for (const key in response) {
            this[key] = response[key];
        }
    }

    // ------------------------------------------------------

    static success(response = {}) {
        return new Response('Success', response)
    }

    // ------------------------------------------------------

    static error(message) {
        return new Response('Error', [], message)
    }

}

export default Response
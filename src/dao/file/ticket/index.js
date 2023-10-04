import Manager from '../manager/index.js'
import Ticket from '../../../class/ticket/index.js'

export default class TicketManager extends Manager {

    constructor(path) {
        super(path)
    }

    // -----------------------------

    async createTicket() {

        await this.getData()

        const ticket = new Ticket(this.id)

        this.data.push(ticket)

        await this.saveData()

        this.incrementId()

    }

    getTickets = async () => await this.getData()

    getTicketById = async (id) => await this.getItemById(id)

    updateTicketById = async (ticket) => await this.updateItem(ticket)

    deleteTicket = async (id) => await this.deleteItemById(id)

}
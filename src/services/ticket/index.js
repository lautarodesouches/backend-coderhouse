export default class TicketService {

    constructor(dao) {
        this.dao = dao
    }

    createTicket = async (data) => await this.dao.createTicket(data)

    getTickets = async (limit) => await this.dao.getTickets(limit)

    getTicketById = async (id) => await this.dao.getTicketById(id)

    updateTicketById = async (id, updatedTicket) => await this.dao.updateTicketById(id, updatedTicket)

    deleteTicket = async (id) => await this.dao.deleteTicket(id)

}
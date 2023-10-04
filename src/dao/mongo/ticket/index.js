import { TicketModel } from '../models/index.js'

// -----------------------------------------------------------------------------------------

export default class Ticket {

    createTicket = async (ticketData) => {

        const currentDateTime = new Date()

        const ticket = {
            ...ticketData,
            purchase_datetime: currentDateTime,
        }

        return await TicketModel.create(ticket)

    }

    getTickets = async (limit) => {

        if (!limit) return TicketModel.find()

        const tickets = await TicketModel.find()

        return tickets.slice(0, limit)

    }

    getTicketById = async (id) => await TicketModel.findOne(id)

    updateTicketById = async (id, updatedTicket) => await TicketModel.findByIdAndUpdate(id, updatedTicket)

    deleteTicket = async (id) => await TicketModel.findByIdAndDelete(id)
}
import { ticketService } from '../../services/index.js'

export const createTicket = async (req, res) => {

    try {

        const { amount, purchaser } = req.body

        const ticketData = { amount, purchaser }

        const ticketCreate = await ticketService.createTicket(ticketData)

        res.json({ message: 'success', payload: ticketCreate })

    } catch (error) {

        res.status(500).json({ message: 'Error al crear ticket' })

    }

}

export const getTickets = async (req, res) => {

    try {

        const limit = parseInt(req.query.limit)

        const result = await ticketService.getTickets(limit)

        res.json({ message: 'success', payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al obtener ticket' })

    }

}

export const getTicketById = async (req, res) => {

    try {

        const id = req.params.pid

        const ticket = await ticketService.getTicketById(id)

        res.json({ message: 'Ticket encontrado', payload: ticket })

    } catch (error) {

        res.status(500).json({ message: 'Error al obtener el ticket' })

    }

}

export const updateTicketById = async (req, res) => {

    const ticketId = req.params.id

    const updatedTicket = { ...req.body }

    try {

        const result = await ticketService.updateTicketById(ticketId, updatedTicket)

        res.json({ message: 'Ticket actualizado', payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al actualizar ticket' })

    }
}

export const deleteTicket = async (req, res) => {

    const ticketId = req.params.id

    try {

        const result = await ticketService.deleteTicket(ticketId)

        if (!result) return res.json({ message: 'No se pudo eliminar ticket' })

        res.json({ message: 'Ticket eliminado exitosamente', payload: result })

    } catch (error) {

        res.status(500).json({ message: 'Error al eliminar ticket' })

    }

}
import { Product, Cart, User, Ticket } from '../dao/factory.js'

// -----------------------------------------------------------------------------------------

import ProductRepository from './product/index.js'
import CartRepository from './cart/index.js'
import UserRepository from './user/index.js'
import TicketRepository from './ticket/index.js'

// -----------------------------------------------------------------------------------------

export const productService = new ProductRepository(new Product())

export const cartService = new CartRepository(new Cart())

export const userService = new UserRepository(new User())

export const ticketService = new TicketRepository(new Ticket())
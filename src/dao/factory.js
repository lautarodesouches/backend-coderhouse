import mongoose from "mongoose";
import config from '../config/index.js';

export let Cart;
export let Product;
export let User;
export let Ticket;

switch (config.persistence) {
    case "MONGO":
        mongoose.connect(config.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: config.dbName,
        });

        const { default: ProductMongo } = await import("./mongoManager/product.js");
        const { default: CartMongo } = await import("./mongoManager/cart.js");
        const { default: UserMongo } = await import("./mongoManager/user.js");
        const { default: TicketMongo } = await import("./mongoManager/ticket.js");

        Product = ProductMongo;
        Cart = CartMongo;
        User = UserMongo;
        Ticket = TicketMongo;
        break;

    case "FILE":
        const { default: ProductFile } = await import("./fileManager/product.js");
        const { default: CartFile } = await import("./fileManager/cart.js");
        const { default: UserFile } = await import("./fileManager/user.js");
        const { default: TicketFile } = await import("./fileManager/ticket.js");

        Product = ProductFile;
        Cart = CartFile;
        User = UserFile;
        Ticket = TicketFile;
        break;

    default:
        break;
}

console.log(`Persistencia con ${config.persistence}`);
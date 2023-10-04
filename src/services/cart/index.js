export default class CartService {

    constructor(dao) {
        this.dao = dao
    }

    // -----------------------------------------------------------------------------------------

    createCart = async () => await this.dao.createCart()

    getCarts = async (limit) => {

        const carts = await this.dao.getCarts()

        if (limit) return carts.slice(0, limit)

        return carts

    }

    getCartById = async (id) => await this.dao.getCartById(id)

    addProductCart = async (cid, pid, quantity) => await this.dao.addProductCart(cid, pid, quantity)

    deleteProductCart = async (cid, pid) => await this.dao.deleteProductCart(cid, pid)

    deleteCartById = async (id) => await this.dao.deleteCartById(id)

    finishPurchase = async (cid) => await this.dao.finishPurchase(cid)

}
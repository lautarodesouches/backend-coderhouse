export default class Product {

    constructor(title, description, price, thumnail, code, stock, status, category) {
        this.title = title
        this.description = description
        this.price = price
        this.thumnail = thumnail
        this.code = code
        this.stock = stock
        this.status = status
        this.category = category
    }

    hasAllValuesSet() {
        return (
            this.title !== undefined &&
            this.description !== undefined &&
            this.price !== undefined &&
            this.thumnail !== undefined &&
            this.code !== undefined &&
            this.stock !== undefined &&
            this.status !== undefined &&
            this.category !== undefined
        )
    }

}
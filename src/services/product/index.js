export default class ProductService {
    
    constructor(dao) {
        this.dao = dao
    }

    getProducts = async (limit) => await this.dao.getProducts(limit)

    addProducts = async (data) => await this.dao.addProducts(data)

    getProductById = async (id) => await this.dao.getProductById(id)

    updatedProductById = async (id, updatedProduct) => await this.dao.updatedProductById(id, updatedProduct)

    deleteProduct = async (id) => await this.dao.deleteProduct(id)

}
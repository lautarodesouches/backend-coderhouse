import { promises } from 'fs'

export default class Manager {

    id = 1

    // ----------------------------------------------------

    constructor(path) {
        this.path = path
        this.data = []
    }

    // ----------------------------------------------------

    async getData() {

        try {

            const json = await promises.readFile(this.path, 'utf-8')

            this.data = JSON.parse(json)

            this.id = this.getLastId()

        } catch (error) {
            this.data = []
        }

        return this.data

    }

    async saveData() {
        await promises.writeFile(this.path, JSON.stringify(this.data))
    }


    async addItem(item) {

        await this.getData()

        this.data.push({ id: this.id, ...item })

        await this.saveData()

        this.incrementId()

    }

    async getItemById(id) {

        await this.getData()

        const itemFound = this.data.find(item => item.id === id)

        if (!itemFound) throw new Error(`Item con id ${id} no encontrado`)

        return itemFound

    }

    async updateItem(itemToUpdate) {

        await this.getItemById(itemToUpdate.id)

        this.data = this.data.map(item => {

            if (item.id === itemToUpdate.id) item = { ...itemToUpdate }

            return item

        })

        await this.saveData()

    }

    async deleteItemById(id) {

        await this.getData()

        const itemFound = await this.getItemById(id)

        this.data.splice(this.data.indexOf(itemFound), 1)

        await this.saveData()

    }

    // ----------------------------------------------------

    incrementId() {
        this.id++
    }

    getLastId() {
        return this.data.reduce((maxId, item) => Math.max(maxId, item.id), 1) + 1
    }

}
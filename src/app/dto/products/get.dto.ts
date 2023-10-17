interface GetProductsDTO {
    _id: string
    name: string
    sku: string
    price: number
    images: string
    tags: Array<string>
}

export { GetProductsDTO }
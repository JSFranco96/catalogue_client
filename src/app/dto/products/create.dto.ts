interface CreateProductDTO {
    name: String
    description: String
    sku: String
    tags: Array<string>
    price: Number
    stock: Number
}

export { CreateProductDTO }

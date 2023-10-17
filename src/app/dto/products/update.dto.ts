interface UpdateProductDTO {
    _id: string
    name?: string
    description?: string
    sku?: string
    images?: string
    tags?: Array<string>
    price?: number
    stock?: number
}

export { UpdateProductDTO }

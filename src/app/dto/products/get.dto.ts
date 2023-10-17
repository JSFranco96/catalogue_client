interface GetProductsDTO {
    name: string
    sku: string
    price: number
    images: string,
    tags: Array<string>
}

export { GetProductsDTO }
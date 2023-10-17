import { IImages } from "../../utils/interfaces"

interface UpdateProductDTO {
    name?: String
    description?: String
    sku?: String
    images?: IImages
    tags?: Array<string>
    price?: Number
    stock?: Number
}

export { UpdateProductDTO }

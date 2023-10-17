export interface IResponse {
    status: number
    title: string
    message: string
    object?: any
}

export interface IImages {
    name: string
    url: string
    uploaded: Boolean
}
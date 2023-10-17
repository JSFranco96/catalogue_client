export interface IResponse {
    status: number
    title: string
    message: string
    object?: any
}

export interface IHistory {
    value: number
    date: Date
}
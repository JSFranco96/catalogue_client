import { Injectable } from "@angular/core";
import { Observable } from 'rxjs'
import { BaseService } from "./base.service";
import { CreateProductDTO } from "../dto/products/create.dto";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable()
export class ProductsService {

    #url: string

    constructor(private baseService: BaseService, private httpClient: HttpClient) {
        this.#url = `${environment.api_url}/products`
    }

    create(product: CreateProductDTO): Observable<any> {
        return this.httpClient.post(this.#url, this.#configFormData(product))
    }

    getAll(page: number): Observable<any> {
        return this.httpClient.get(`${this.#url}?page=${page}`)
    }

    #configFormData(product: CreateProductDTO): FormData {
        const formData = new FormData()
        for (const key in product) {
            if (Object.prototype.hasOwnProperty.call(product, key)) {
                let element: any
                if (key === 'image') {
                    element = product[key as keyof CreateProductDTO]
                } else {
                    element = JSON.stringify(product[key as keyof CreateProductDTO]);
                }
                formData.append(key, element)
            }
        }

        return formData
    }
}
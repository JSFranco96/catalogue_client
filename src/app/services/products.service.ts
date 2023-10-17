import { Injectable } from "@angular/core";
import { Observable } from 'rxjs'
import { BaseService } from "./base.service";
import { CreateProductDTO } from "../dto/products/create.dto";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { UpdateProductDTO } from "../dto/products/update.dto";

@Injectable()
export class ProductsService {

    #url: string

    constructor(private baseService: BaseService, private httpClient: HttpClient) {
        this.#url = `${environment.api_url}/products`
    }

    create(product: CreateProductDTO): Observable<any> {
        return this.httpClient.post(this.#url, this.#configFormData(product))
    }

    update(product: UpdateProductDTO): Observable<any> {
        return this.httpClient.patch(`${this.#url}/${product._id}`, this.#configFormData(product))
    }

    getAll(page: number, filter: string = ''): Observable<any> {
        return this.httpClient.get(`${this.#url}?page=${page}&filter=${filter}`)
    }

    getById(id: string): Observable<any> {
        return this.httpClient.get(`${this.#url}/${id}`)
    }

    delete(id: string): Observable<any> {
        return this.httpClient.delete(`${this.#url}/${id}`)
    }

    #configFormData(product: CreateProductDTO | UpdateProductDTO): FormData {
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
import { Injectable } from "@angular/core";
import { CreateProductDTO } from "../dto/products/create.dto";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { map, catchError } from 'rxjs/operators'
import { throwError, Observable } from 'rxjs'

@Injectable()
export class BaseService {

    #headers: HttpHeaders

    constructor(private httpClient: HttpClient) {
        this.#headers = new HttpHeaders({
            'accept': 'application/json'
        })
    }

    post(url: string, body: any): Observable<any> {
        return this.httpClient.post(`${environment.api_url}${url}`, body, { headers: this.#headers }).pipe(
            map((data: any) => {
                debugger;
                return data
            }), catchError(error => {
                debugger;
                return throwError(error)
            })
        )
    }
}
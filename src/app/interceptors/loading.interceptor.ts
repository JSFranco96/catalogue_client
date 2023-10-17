import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core'
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs'

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private loadingService: LoadingService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        this.loadingService.showLoader()

        return next.handle(request).pipe(
            finalize(() => {
                this.loadingService.hideLoader()
            })
        )
    }
}
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable()
export class LoadingService {
    public isLoading$ = new BehaviorSubject<boolean>(false)

    showLoader() {
        this.isLoading$.next(true)
    }

    hideLoader() {
        this.isLoading$.next(false)
    }
}
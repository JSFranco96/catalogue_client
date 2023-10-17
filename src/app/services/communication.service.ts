import { EventEmitter, Injectable } from "@angular/core";


@Injectable()
export class CommunicationService {

    pageSelected: EventEmitter<number> = new EventEmitter<number>()
    numberOfProducts: EventEmitter<number> = new EventEmitter<number>()
    productRegistered: EventEmitter<void> = new EventEmitter<void>()
}
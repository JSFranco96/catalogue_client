import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetProductsDTO } from 'src/app/dto/products/get.dto';
import { ProductsService } from 'src/app/services/products.service';
import { IResponse } from 'src/app/utils/interfaces';
import { MessageService } from 'primeng/api'
import { Subscription } from 'rxjs'
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit, OnDestroy {

  #subs: Array<Subscription> = []

  products: Array<GetProductsDTO> = []

  #currentPage: number = 0

  constructor(
    private productsService: ProductsService,
    private messageService: MessageService,
    private communicationService: CommunicationService) { }

  ngOnInit(): void {
    this.getAll()
    this.#listenPageChange()
    this.#listenProductCreated()
  }

  ngOnDestroy(): void {
    for (const sub of this.#subs) {
      sub.unsubscribe()
    }

    this.#subs = []
  }

  getAll(page: number = 0): void {
    this.#subs.push(
      this.productsService.getAll(page).subscribe(
        (data: IResponse) => {
          if (data) {
            if (data.status !== 200) {
              this.messageService.add({ severity: 'error', summary: data.title, detail: data.message })
            }

            if (data.status === 200 && data.object?.info?.length) {
              this.products = data.object.info
              this.communicationService.numberOfProducts.emit(data.object.total)
            }

          } else {
            this.messageService.add({ severity: 'error', summary: 'Ocurrió un error consultando los productos' })
          }
        }
      )
    )
  }

  #listenPageChange() {
    this.#subs.push(
      this.communicationService.pageSelected.subscribe((page: number) => {
        this.#currentPage = page
        this.getAll(page)
      })
    )
  }

  #listenProductCreated() {
    this.#subs.push(
      this.communicationService.actionOverProduct.subscribe(() => this.getAll(this.#currentPage))
    )
  }
}
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { MessageService, ConfirmationService } from 'primeng/api'
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { IResponse } from 'src/app/utils/interfaces';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit, OnDestroy {

  #subs: Array<Subscription> = []

  @Input() product: any

  #ref: DynamicDialogRef | undefined

  #severity: Array<string> = [
    'success',
    'info',
    'warning',
    'danger'
  ]

  constructor(
    public dialogService: DialogService, 
    public messageService: MessageService,
    private confirmationService: ConfirmationService,
    private productsService: ProductsService,
    private communicationService: CommunicationService) { }

  ngOnInit(): void {
    this.#configureTags()
  }

  ngOnDestroy(): void {
    for (const sub of this.#subs) {
      sub.unsubscribe()
    }

    this.#subs = []
  }

  showDetail() {
    this.#ref = this.dialogService.open(ProductDetailComponent, {
      header: `Editar producto: "${this.product.name}"`,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 5,
      maximizable: true,
      data: this.product
    })
  }

  #configureTags(): void {
    this.product.customTags = this.product.tags.map((tag: string, index: number) => {
      return {
        severity: this.#severity[index],
        value: tag
      }
    })
  }

  deleteProduct() {
    this.confirmationService.confirm({
      message: `Está a punto de eliminar el producto "${this.product.name}". ¿Desea continuar?`,
      header: 'Eliminar producto',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.#subs.push(
          this.productsService.delete(this.product._id).subscribe(
            (data: IResponse) => {
              if (data) {
                this.messageService.add({ severity: data.status === 200 ? 'success' : 'error', summary: data.title, detail: data.message })
                if (data.status == 200) {
                  this.communicationService.actionOverProduct.emit()
                }
              } else {
                this.messageService.add({ severity: 'error', summary: 'Ocurrió un error eliminando el producto' })
              }
            }
          )
        )
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Operación cancelada' })
      }
    })
  }

}

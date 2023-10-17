import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { MessageService } from 'primeng/api'
import { ProductDetailComponent } from '../product-detail/product-detail.component';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {

  @Input() product: any

  #ref: DynamicDialogRef | undefined

  #severity: Array<string> = [
    'success',
    'info',
    'warning',
    'danger'
  ]

  constructor(public dialogService: DialogService, public messageService: MessageService) { }

  ngOnInit(): void {
    this.#configureTags()
  }

  showDetail() {
    this.#ref = this.dialogService.open(ProductDetailComponent, {
      header: 'Editar producto',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 5,
      maximizable: true
    })

    this.#ref.onClose.subscribe((product: any) => {
      if (product) {
        this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: product.name });
      }
    });

    this.#ref.onMaximize.subscribe((value) => {
      this.messageService.add({ severity: 'info', summary: 'Maximized', detail: `maximized: ${value.maximized}` });
    });
  }

  #configureTags(): void {
    this.product.customTags = this.product.tags.map((tag: string, index: number) => {
      return {
        severity: this.#severity[index],
        value: tag
      }
    })
  }

}

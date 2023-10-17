import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { CommunicationService } from 'src/app/services/communication.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  #subs: Array<Subscription> = []
  first: number = 0
  rows: number = 8
  totalRecords: number = 0
  #ref: DynamicDialogRef | undefined
  searchText: string = ''

  constructor(
    public dialogService: DialogService,
    public messageService: MessageService,
    private communicationService: CommunicationService
  ) { }

  ngOnInit() {
    this.#listenTotalChange()
  }

  ngOnDestroy(): void {
    for (const sub of this.#subs) {
      sub.unsubscribe()
    }

    this.#subs = []
  }


  goToCreateProducto() {
    this.#ref = this.dialogService.open(ProductDetailComponent, {
      header: 'Registrar producto',
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

  onPageChange(e: any) {
    this.communicationService.pageSelected.emit(e.page)
  }

  #listenTotalChange() {
    this.#subs.push(
      this.communicationService.numberOfProducts.subscribe((total: number) => this.totalRecords = total)
    )
  }

  searchByFilter() {
    this.communicationService.filter.emit(this.searchText)
  }

  clearFilter() {
    this.searchText = ''
    this.communicationService.filter.emit('')
  }


}

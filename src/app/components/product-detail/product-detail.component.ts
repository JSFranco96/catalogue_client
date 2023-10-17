import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api'
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { ProductsService } from 'src/app/services/products.service';
import { IHistory, IResponse } from 'src/app/utils/interfaces';
import { CommunicationService } from 'src/app/services/communication.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'
import { Subscription, takeUntil } from 'rxjs';
import { GetProductsByIdDTO } from 'src/app/dto/products/getById.dto';
import { CreateProductDTO } from 'src/app/dto/products/create.dto';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit, OnDestroy {

  separatorExp: RegExp = /,| /
  uploadedFiles: any[] = []
  product: FormGroup
  imageRequiredError: boolean = false
  selectedFiles: File[] = []
  #subs: Array<Subscription> = []
  updating: boolean = false
  currentImage: string = ''
  showHistory: boolean = false
  history: Array<IHistory> = []
  stockHistory: Array<IHistory> = []
  priceHistory: Array<IHistory> = []
  historyHeader: string = ''

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private communicationService: CommunicationService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private confirmationService: ConfirmationService) {

    this.product = this.formBuilder.group({
      _id: [''],
      name: ['', [Validators.required, Validators.maxLength(15)]],
      sku: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      tags: [[], [Validators.required]],
      price: [null, [Validators.required]],
      stock: [null, [Validators.required]],
      image: [null, [Validators.required]]
    })

    this.#configData()

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    for (const sub of this.#subs) {
      sub.unsubscribe()
    }

    this.#subs = []
  }

  #configData() {
    if (this.dialogConfig.data) {
      this.updating = true
      // En caso de que se esté actualizando un registro, no validamos la imagen.
      this.product.controls['image'].removeValidators(Validators.required)
      this.#getById(this.dialogConfig.data._id)
    }
  }

  #create() {
    const objectToCreate = this.#configureProductoToCreate()
    this.#subs.push(
      this.productsService.create(objectToCreate).subscribe(
        (data: IResponse) => {
          if (data) {
            this.messageService.add({ severity: data.status === 200 ? 'success' : 'error', summary: data.title, detail: data.message })
            if (data.status === 200) {
              this.#restartForm()
              this.communicationService.actionOverProduct.emit()
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Ocurrió un error guardando el producto' })
          }
        }
      )
    )
  }

  #update() {
    this.#subs.push(
      this.productsService.update(this.product.value).subscribe(
        (data: IResponse) => {
          if (data) {
            this.messageService.add({ severity: data.status === 200 ? 'success' : 'error', summary: data.title, detail: data.message })
            if (data.status === 200) {
              this.#restartForm()
              this.communicationService.actionOverProduct.emit()
              this.closeModal()
            }
          } else {
            this.messageService.add({ severity: 'error', summary: 'Ocurrió un error actualizando el producto' })
          }
        }
      )
    )
  }

  #restartForm() {
    this.product.reset()
    this.product.clearValidators()
    this.selectedFiles = []
    this.currentImage = ''
    this.updating = false
  }


  #getById(id: string) {
    this.#subs.push(
      this.productsService.getById(id).subscribe(
        (data: IResponse) => {
          if (data) {
            if (data.status !== 200) {
              this.messageService.add({ severity: 'error', summary: data.title, detail: data.message })
              return
            }
            this.#configureProduct(data.object)
          } else {
            this.messageService.add({ severity: 'error', summary: 'Ocurrió un error consultando el detalle del producto.' })
          }
        }
      )
    )
  }

  #configureProductoToCreate() {
    const value = { ...this.product.value }
    delete value._id
    return value as CreateProductDTO
  }

  #configureProduct(detail: GetProductsByIdDTO) {

    const currentDetail = this.dialogConfig.data
    this.currentImage = currentDetail.image

    this.product.patchValue({
      _id: currentDetail._id,
      name: currentDetail.name,
      sku: currentDetail.sku,
      description: detail.description,
      tags: currentDetail.tags,
      price: currentDetail.price,
      stock: detail.stock
    })

    this.#configureHistory(detail)
  }

  hasError(formControlName: string, error: string): boolean {
    const control = this.product.controls[formControlName]
    if (control.hasError(error) && control.touched) {
      return true
    }
    return false
  }

  validateForm() {

    if (this.product.controls['image'].hasError('required')) {
      this.imageRequiredError = true
      this.messageService.add({ severity: 'error', summary: 'Debe cargar una imagen para el producto' })
      return
    }

    if (!this.product.valid) {
      this.messageService.add({ severity: 'error', summary: 'Debe completar el formulatrio' })
      return
    }

    if (this.updating) {
      this.#update()
    } else {
      this.#create()
    }

  }

  onSelect(e: any) {
    const image = e.currentFiles[0];
    this.product.patchValue({
      image
    })
    this.imageRequiredError = false
    this.selectedFiles.push(image)
  }

  onClear() {
    this.selectedFiles = []
  }

  onRemove() {
    this.selectedFiles = []
  }

  closeModal() {
    this.dialogRef.close()
  }

  deleteProduct() {
    this.confirmationService.confirm({
      message: `Está a punto de eliminar el producto "${this.product.controls['name'].value}". ¿Desea continuar?`,
      header: 'Eliminar producto',
      icon: 'pi pi-info-circle',
      accept: () => {

        this.#subs.push(
          this.productsService.delete(this.dialogConfig.data._id).subscribe(
            (data: IResponse) => {
              if (data) {
                this.messageService.add({ severity: data.status === 200 ? 'success' : 'error', summary: data.title, detail: data.message })
                if (data.status == 200) {
                  this.#restartForm()
                  this.communicationService.actionOverProduct.emit()
                  this.closeModal()
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

  #configureHistory(detail: GetProductsByIdDTO) {
    if (detail.priceHistory) {
      this.priceHistory = detail.priceHistory.map((price: any) => {
        return {
          value: price.price,
          date: price.date
        } as IHistory
      })
    }

    if (detail.stockHistory) {
      this.stockHistory = detail.stockHistory.map((stock: any) => {
        return {
          value: stock.stock,
          date: stock.date
        } as IHistory
      })
    }
  }

  /**
 * Configura el historial para mostrarlo en el dialog
 * @param type number: 1 = price, 2 = stock
 */
  openHistoryModal(type: number) {
    if (type === 1) {
      this.history = [...this.priceHistory]
      this.historyHeader = 'Historial de precios'
    } else {
      this.history = [...this.stockHistory]
      this.historyHeader = 'Historial de stock'
    }

    this.showHistory = true
  }

}

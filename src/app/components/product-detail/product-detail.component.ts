import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { ProductsService } from 'src/app/services/products.service';
import { CreateProductDTO } from 'src/app/dto/products/create.dto';
import { IResponse } from 'src/app/utils/interfaces';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent implements OnInit {

  separatorExp: RegExp = /,| /

  uploadedFiles: any[] = []

  product: FormGroup

  imageRequiredError: boolean = false

  formData: FormData

  selectedFiles: File[] = []

  constructor(
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private productsService: ProductsService,
    private communicationService: CommunicationService) {

    this.product = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(15)]],
      sku: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
      tags: [[], [Validators.required]],
      price: [null, [Validators.required]],
      stock: [null, [Validators.required]],
      image: [null, [Validators.required]]
    })

    this.formData = new FormData()

  }

  ngOnInit(): void {
  }

  onUpload(event: any) {

    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' })
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

    this.#create()

  }

  #create() {
    this.productsService.create(this.product.value).subscribe(
      (data: IResponse) => {
        if (data) {
          this.messageService.add({ severity: data.status === 200 ? 'success' : 'error', summary: data.title, detail: data.message })
          if (data.status === 200) {
            this.#restartForm()
            this.communicationService.productRegistered.emit()
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Ocurrió un error guardando el producto' })
        }
      }
    )
  }

  #restartForm() {
    this.product.reset()
    this.product.clearValidators()
    this.selectedFiles = []
  }

  onSelect(e: any) {
    const image = e.currentFiles[0];
    this.product.patchValue({
      image
    })
    this.imageRequiredError = false
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { ToolbarModule } from 'primeng/toolbar'
import { ButtonModule } from 'primeng/button'
import { SplitButtonModule } from 'primeng/splitbutton';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { CatalogueComponent } from './components/catalogue/catalogue.component'
import { CardModule } from 'primeng/card'
import { PaginatorModule } from 'primeng/paginator';
import { ProductDetailComponent } from './components/product-detail/product-detail.component'
import { ToastModule } from 'primeng/toast'
import { DialogService } from 'primeng/dynamicdialog'
import { MessageService } from 'primeng/api'
import { ChipsModule } from 'primeng/chips'
import { FileUploadModule } from 'primeng/fileupload'
import { DialogModule } from 'primeng/dialog'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TooltipModule } from 'primeng/tooltip'
import { ProductsService } from './services/products.service';
import { BaseService } from './services/base.service';
import { CommunicationService } from './services/communication.service';
import { LoaderComponent } from './components/loader/loader.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { LoadingInterceptor } from './interceptors/loading.interceptor';
import { LoadingService } from './services/loading.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TagModule } from 'primeng/tag'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductCardComponent,
    CatalogueComponent,
    ProductDetailComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    CardModule,
    PaginatorModule,
    ToastModule,
    ChipsModule,
    FileUploadModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    ProgressSpinnerModule,
    TagModule
  ],
  providers: [
    DialogService,
    MessageService,
    ProductsService,
    BaseService,
    CommunicationService,
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

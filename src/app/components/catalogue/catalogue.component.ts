import { Component } from '@angular/core';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent {

  products = [
    {
      name: 'Lorem, ipsum.',
      sku: 'AASB23424',
      price: 395999
    },
    {
      name: 'Lorem, ipsum.',
      sku: 'AASB23424',
      price: 395999
    },
    {
      name: 'Lorem, ipsum.',
      sku: 'AASB23424',
      price: 395999
    }, {
      name: 'Lorem, ipsum.',
      sku: 'AASB23424',
      price: 395999
    }, {
      name: 'Lorem, ipsum.',
      sku: 'AASB23424',
      price: 395999
    }
  ]


}
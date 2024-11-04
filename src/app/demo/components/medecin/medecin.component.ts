import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Customer, Medecin, Representative } from '../../api/customer';
import { Product } from '../../api/product';
import { CustomerService } from '../../service/customer.service';
import { ProductService } from '../../service/product.service';
import { Table } from 'primeng/table';
import { MedecinService } from './medecin.service';
import { catchError, of, tap } from 'rxjs';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
  selector: 'app-medecin',
  providers: [MessageService, ConfirmationService],
  templateUrl: './medecin.component.html',
  styleUrl: './medecin.component.scss'
})
export class MedecinComponent {
    customers1: Customer[] = [];

    customers2: Customer[] = [];

    customers3: Customer[] = [];

    medecins: Medecin[] = [];

    selectedCustomers1: Customer[] = [];

    selectedCustomer: Customer = {};

    representatives: Representative[] = [];

    statuses: any[] = [];

    products: Product[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(private customerService: CustomerService, private productService: ProductService, private dataServ: MedecinService) { }

    ngOnInit() {
        this.getData();
        this.loading = false;
    }

    getData(): void {
        this.dataServ
          .getData()
          .pipe(
            tap(response => {
              this.medecins = response;
            }),
            catchError(error => {
              console.error('There was an error!', error);
              return of([]); // Return an empty array or handle the error in another way
            })
          )
          .subscribe(); // Subscribe to the observable to trigger the request
      }

    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.customers3) {
            for (let i = 0; i < this.customers3.length; i++) {
                const rowData = this.customers3[i];
                const representativeName = rowData?.representative?.name || '';

                if (i === 0) {
                    this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
                }
                else {
                    const previousRowData = this.customers3[i - 1];
                    const previousRowGroup = previousRowData?.representative?.name;
                    if (representativeName === previousRowGroup) {
                        this.rowGroupMetadata[representativeName].size++;
                    }
                    else {
                        this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
                    }
                }
            }
        }
    }

    expandAll() {
        if (!this.isExpanded) {
            this.products.forEach(product => product && product.name ? this.expandedRows[product.name] = true : '');

        } else {
            this.expandedRows = {};
        }
        this.isExpanded = !this.isExpanded;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
}

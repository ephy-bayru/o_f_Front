import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IProduct, IProductWithPosition } from '../../models/product';
import { ProductService } from '../../services/products.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'position',
    'name',
    'description',
    'price',
    'stock',
    'rating',
    'details',
  ];
  selection = new SelectionModel<IProduct>(true, []);
  products: MatTableDataSource<IProductWithPosition> =
    new MatTableDataSource<IProductWithPosition>([]);
  totalCount: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit(): void {
   // this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts(this.pageSize, this.currentPage).subscribe({
      next: (res) => {
        this.totalCount = res.data.totalCount;
        this.products = new MatTableDataSource<IProductWithPosition>(res.data.products.map((product, index) => {
          return {...product, position: ((this.currentPage - 1) * this.pageSize) + index + 1};
        }));
  
        this.products.sort = this.sort;
  
        this.changeDetectorRefs.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.notificationService.showError('An error occurred while loading the products.');
      }
    });
  }
  

  pageEvent(event: any): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1; // pageIndex is 0-based
    this.loadProducts();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.products.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.products.data.forEach((row) => this.selection.select(row));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.products.filter = filterValue.trim().toLowerCase();

    if (this.products.paginator) {
      this.products.paginator.firstPage();
    }
  }
}

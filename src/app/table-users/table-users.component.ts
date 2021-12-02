import { formatDate } from '@angular/common';
import { ModalUsuarioComponent } from './../../../modals/modal-usuario/modal-usuario.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from './../../../../models/usuarios';
import { ApiService } from './../../../../service/api.service';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDeleteComponent } from 'src/app/components/modals/modal-delete/modal-delete.component';
import { FormControl } from '@angular/forms';
import { error } from 'protractor';
import { ToastService } from 'ng-uikit-pro-standard';

/**
 * @title Table retrieving data through HTTP
 */
@Component({
  selector: 'table-http-example',
  styleUrls: ['table-users.component.css'],
  templateUrl: 'table-users.component.html'
})

export class TableUserComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'user', 'full_name', 'register_date', 'register_hour', 'actions'];

  toppings = new FormControl();

  toppingList: string[] = ['usuario', 'nombre', 'fecha de registro', 'hora de registro'];
  dataSource: MatTableDataSource<Usuarios>;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  pageEvent: PageEvent;

  filter: string = '';
  filtro_usuario: string = '';
  filtro_nombre: string = '';s
  filtro_fecha: Date;
  filtro_hora: string = '';

  filtro_usuario_view: boolean = false;
  filtro_nombre_view: boolean = false;
  filtro_fecha_view: boolean = false;
  filtro_hora_view: boolean = false;

  // Top Bar
  top_bar_title: string = "Usuario";
  top_bar_subtitle: string = "usuarios registrados en la pagina";
  top_bar_icon: string = "people";

  sortedData: Usuarios[];
  array_user: Usuarios[];

  filtros_row: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  message_server: string = '';

  constructor(private api: ApiService, private modalService: NgbModal) { }

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    var usuario_filtro: Usuarios = { 'id': 1, 'user': this.filtro_usuario, 'password': this.filter, 'full_name': this.filtro_nombre, 'register_date': '', 'register_hour': this.filtro_hora, 'avatar': null }
    this.api.ObtenerUsuarios(usuario_filtro).subscribe((result) => {
      this.isLoadingResults = false;
      this.isRateLimitReached = false;

      if (result.length > 0) {
        this.array_user = result;
        this.dataSource = new MatTableDataSource(result);
        this.resultsLength = result.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.array_user = [];
        this.dataSource = new MatTableDataSource([]);
        this.resultsLength = 0;
        this.isRateLimitReached = true;
        this.message_server = "no hay usuarios registrados";
      }
    },
      (error) => {
        this.isLoadingResults = false;
        this.isRateLimitReached = true;
        this.message_server = error.error.message;
        // console.log(error)
      });
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  registerOrUpdate(event: boolean) {
    this.loadData();
  }

  actualizarUsuario(row: Usuarios) {
    this.api.ObtenerRolesByUser(row.id).subscribe((result)=>{
      var modal = this.modalService.open(ModalUsuarioComponent);
      modal.componentInstance.modalHeader = "Usuario";
      modal.componentInstance.modalmessage = "Debe al menos modificar uno de los campos";
      modal.componentInstance.modal_action = "Editar";
      modal.componentInstance.form_user.setValue({
        id: row.id,
        user: row.user,
        password: row.password,
        full_name: row.full_name,
        register_date: row.register_date,
        register_hour: row.register_hour,
        avatar: row.avatar,
        rol_usuario: result,
        confirm: row.password
      });
      modal.componentInstance.roles2 = result;

      // Emitir desde el modal contenido de este al cerrarlo
      modal.result.then((result) => {
        if (result) {
          this.loadData();
        }
      });
    });

  }

  eliminarUser(id: number) {
    var modal = this.modalService.open(ModalDeleteComponent);
    modal.componentInstance.modalHeader = "Usuario";
    modal.componentInstance.id = id;
    modal.result.then((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  filtrarTodo() {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  // filtrarByUser() {
  //   this.dataSource.filterPredicate = (data: Usuarios, filter: string) => data.user.toLocaleLowerCase().indexOf(filter) != -1;
  //   this.dataSource.filter = this.filtro_usuario.toLocaleLowerCase().trim();
  // }

  // filtrarByName() {
  //   this.dataSource.filterPredicate = (data: Usuarios, filter: string) => data.full_name.toLocaleLowerCase().indexOf(filter) != -1;
  //   this.dataSource.filter = this.filtro_nombre.trim().toLocaleLowerCase();
  // }

  // filtrarByDate() {
  //   this.dataSource.filterPredicate = (data: Usuarios, filter: string) => data.register_date.indexOf(filter) != -1;
  //   var fecha = formatDate(this.filtro_fecha, 'dd - MM - yyyy', 'en-US');
  //   this.dataSource.filter = fecha.trim();
  // }

  // filtrarByHour() {
  //   this.dataSource.filterPredicate = (data: Usuarios, filter: string) => data.register_hour.toLowerCase().indexOf(filter) != -1;
  //   this.dataSource.filter = this.filtro_hora.trim().toLowerCase();
  // }

  onChangeSelectFilter() {
    this.filtros_row = this.toppings.value.indexOf('usuario') != -1 || this.toppings.value.indexOf('nombre') != -1 || this.toppings.value.indexOf('fecha de registro') != -1 || this.toppings.value.indexOf('hora de registro') != -1;
    this.filtro_usuario_view = this.toppings.value.indexOf('usuario') != -1;
    this.filtro_nombre_view = this.toppings.value.indexOf('nombre') != -1;
    this.filtro_fecha_view = this.toppings.value.indexOf('fecha de registro') != -1;
    this.filtro_hora_view = this.toppings.value.indexOf('hora de registro') != -1;
  }

  sortData(sort: Sort) {
    const data = this.array_user.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return compare(a.id, b.id, isAsc);
        case 'user': return compare(a.user, b.user, isAsc);
        case 'full_name': return compare(a.full_name, b.full_name, isAsc);
        case 'register_date': return compare(a.register_date, b.register_date, isAsc);
        case 'register_hour': return compare(a.register_hour, b.register_hour, isAsc);
        default: return 0;
      }
    });
  }

  isSearch(): boolean {
    return this.filtro_usuario != '' || this.filtro_nombre != '' || this.filtro_hora != '';
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}


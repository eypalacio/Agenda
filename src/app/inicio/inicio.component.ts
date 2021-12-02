import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Sistema } from '../models/sistema';
import { ApiService } from '../services/api.service';

const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(':enter',
      [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
    query(':leave',
      animate('200ms', style({ opacity: 0 })),
      { optional: true }
    )
  ])
]);

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  animations: [listAnimation]

})
export class InicioComponent implements OnInit {

dataSource = new MatTableDataSource<any>()
list:Sistema[]  = []

  constructor(private api:ApiService) { }

  ngOnInit(): void {
    this.api.getSistema().subscribe((result)=>{
      console.log('', result);
      this.dataSource= new MatTableDataSource(result);
      this.list = result;
    }
    )


  }

  displayedColumns: string[] = ['id', 'nomb_sistema', 'alias_sistema'];
  clickedRows = new Set<Sistema>();

}

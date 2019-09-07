import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { HeroeModel } from '../../models/heroe.model';
import { HeroesService } from '../../services/heroes.service';
import { depto, ciudad } from './data';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {

  ciudades = ciudad;
  deptos = depto;
  filterCiudades = ciudad;
  heroe: HeroeModel = new HeroeModel();

  constructor(private heroesService: HeroesService,
    private route: ActivatedRoute) { }

  depto = new FormControl('', Validators.required);
  ciudad = new FormControl('', Validators.required);
  ngOnInit() {

    this.depto.valueChanges.subscribe(val => {
      this.filterCiudades = ciudad.filter((f) => f.depto == val.codigo);
    });

    this.depto.setValue(depto.filter((f) => f.descripcion == this.heroe.depto), { onlySelf: true });
    console.log(depto);

    this.ciudad.setValue(ciudad.filter((f) => f.descripcion == this.heroe.ciudad), { onlySelf: true });
    console.log(ciudad);

    const id = this.route.snapshot.paramMap.get('id');

    if (id !== 'nuevo') {

      this.heroesService.getHeroe(id)
        .subscribe((resp: HeroeModel) => {
          this.heroe = resp;
          this.heroe.id = id;
        });

    }

  }

  guardar(form: NgForm) {

    if (form.invalid) {
      console.log('Formulario no válido');
      return;
    }

    if (new Date('2001-01-01').getTime() > new Date(this.heroe.fechaCumple.toString()).getTime()) {
      alert('La fecha de cumpleaños debe ser mayor a 01/01/2001');
      return;
    }


    this.heroe.depto = this.depto.value.descripcion;
    this.heroe.ciudad = this.ciudad.value.descripcion;

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      type: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();


    let peticion: Observable<any>;

    if (this.heroe.id) {
      peticion = this.heroesService.actualizarHeroe(this.heroe);
    } else {
      peticion = this.heroesService.crearHeroe(this.heroe);
    }

    peticion.subscribe(resp => {

      Swal.fire({
        title: this.heroe.nombre,
        text: 'Se actualizó correctamente',
        type: 'success'
      });

    });





  }





}

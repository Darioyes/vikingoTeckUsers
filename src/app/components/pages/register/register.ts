import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { environment } from '@enviroments/environment.development';
import { IRegisterRequest, IRegisterResponse } from '@interfaces/IRegisterRequest';
import { AlertService } from '@services/alert/alertService/alert-service';
import { UserRegisterService } from '@services/auth/register/user-register-service';
import { CitiesService } from '@services/cities/cities/cities-service';
import { CustomAlert } from '@shared/Alerts/custom-alert/custom-alert';
import { SpinerPages } from '@shared/spiner-pages/spiner-pages';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    CustomAlert,
    SpinerPages
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit, OnDestroy {

  @ViewChild('fileInput1') fileInput1!: ElementRef<HTMLInputElement>;
 
  #registerService = inject(UserRegisterService);
  #citiesService = inject(CitiesService);
  #unsubscribeRegister!: Subscription;
  #unsubscribeCities!: Subscription;
  #router = inject(Router);
  alertService = inject(AlertService);

  public city = signal<any>([]);
  public existsImage = signal<string>('');
  public previewImage: string | ArrayBuffer | null = null;
  public image: File | null = null;
  public viewPassword = signal(false)
  public buttons = signal(true);

  public urlImg = environment.domainimage;

  public formbuilder = inject(FormBuilder);
  public registerForm: any = new FormGroup({});
 
 
 
  ngOnInit(): void {
    this.cities();
    this.formUser();
  }

  ngOnDestroy(): void {
    if (this.#unsubscribeRegister) {
      this.#unsubscribeRegister.unsubscribe();
    }
    if (this.#unsubscribeCities) {
      this.#unsubscribeCities.unsubscribe();
    }

  }

  //esta funcion es para abrir el input file
  public triggerFileInput(): void {
    //this.fileInput1.nativeElement.click();
    this.fileInput1.nativeElement.click();
  }

  //esta funcion es para manejar el archivo seleccionado
  public onFileSelected(event: Event): void {
    //const file = event.target.files[0]; //esta es cuando se usa el input file directamente
    // la constante input es el elemento input del archivo
    const input = event.target as HTMLInputElement;
    // validar si hay archivos seleccionados
    if (input.files && input.files.length > 0) {
      // la constante file es el primer archivo seleccionado
      const file = input.files[0];
      // validar si el archivo es una imagen
      if (file && file.type.startsWith('image/')) {
        // la constante reader es un objeto FileReader
        // que se utiliza para leer el contenido del archivo
        const reader = new FileReader();
        // reader.onload es un evento que se activa cuando el archivo se ha leído correctamente
        // y se asigna el resultado a la propiedad previewImage
        reader.onload = () => {
              this.previewImage = reader.result;
              this.image = file;
              // Marca el control como "touched"
              this.registerForm.get('image')?.markAsTouched();
        };

        reader.readAsDataURL(file);
      } else {
        this.alertService.showAlert('info','Solo se permite archivos de tipo imagen.');
      }
    }
  }

  public formUser(){
    this.registerForm = this.formbuilder.group({
      // users_id: [''],
      name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(45)])],
      lastname: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(45)])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(255)])],
      gender: ['', Validators.compose([Validators.required])],
      birthday: ['', Validators.compose([Validators.required])],
      phone1: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10),Validators.pattern('^[0-9]+$')])],
      phone2: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(10),Validators.pattern('^[0-9]+$')])],
      address: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(255)])],
      cities_id: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(255), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).*$')])],
      password_confirmation: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(255),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).*$')])],
    });
  }

  get name(){ return this.registerForm.get('name'); }
  get lastname(){ return this.registerForm.get('lastname'); }
  get email(){ return this.registerForm.get('email'); }
  get gender(){ return this.registerForm.get('gender'); }
  get birthday(){ return this.registerForm.get('birthday'); }
  get phone1(){ return this.registerForm.get('phone1'); }
  get phone2(){ return this.registerForm.get('phone2'); }
  get address(){ return this.registerForm.get('address'); }
  get cities_id(){ return this.registerForm.get('cities_id'); }
  get password(){ return this.registerForm.get('password'); }
  get password_confirmation(){ return this.registerForm.get('password_confirmation'); }

  public cities(){
    this.#unsubscribeCities = this.#citiesService.getCities().subscribe({
      next: (response:any) => {
        this.city.set(response.data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  public passwordView():void{
    this.viewPassword.set(!this.viewPassword());
  }

  private resetImages(): void {
    this.previewImage = '../../../../assets/img/default-image.png';

    this.image = null;

  }

  public cancel(){
    this.registerForm.reset();
    this.resetImages();
    this.#router.navigate(['home/iniciar-sesion']);
  }

  public registerUserForm(): void {
    if (this.registerForm.valid) {
        this.buttons.set(false);
        const data: FormData = new FormData();
        Object.keys(this.registerForm.value).forEach(key => {
          data.append(key, this.registerForm.get(key)?.value);
        });
        if (this.image) {
          data.append('image', this.image);
        }
        this.#unsubscribeRegister = this.#registerService.register(data).subscribe({
          next: (response:IRegisterResponse) => {
            this.resetImages();
            this.alertService.showAlert('success', response.message + '<br>Se ha enviado un correo de confirmación</br>', 'home/iniciar-sesion');
            this.registerForm.reset();
          },
          error: (error:IRegisterResponse) => {
            console.log(error.errorVikingo);
            if(error.errorVikingo?.errors){
              //el .flat() es para aplanar el array de errores y el object.values es para obtener los valores del objeto de errores
              const errorMessages = Object.values(error.errorVikingo.errors).flat();
              this.alertService.showAlert('error', errorMessages.join(' '));
              this.buttons.set(true);
            }else if(error.errorVikingo){
              this.alertService.showAlert('error', error?.errorVikingo?.message );
              this.buttons.set(true);
            }
          },
          complete: () => {
            this.buttons.set(true);
          }

        });
    }else{
      this.alertService.showAlert('error', 'Por favor, complete todos los campos requeridos.');
    }
  }

}

import { ApplicationRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HeaderSevice } from '@services/header/header-sevice';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ILogin, ILoginResponse } from '@interfaces/ILoginResponse';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '@services/auth/login/auth-service';
import { Router, RouterModule } from '@angular/router';
import { LoggeInService } from '@services/auth/loggeIn/logge-in-service';
import { AlertService } from '@services/alert/alertService/alert-service';
import { CustomAlert } from '@shared/Alerts/custom-alert/custom-alert';
import { ShoopingCartService } from '@services/shoopingCart/ShoopingCart/shooping-cart-service';
import { IShopingCartData, IShopingCartResponse } from '@interfaces/IShopingCart';
import { SpinerPages } from '@shared/spiner-pages/spiner-pages';


@Component({
  selector: 'app-login',
  imports: [
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
    CustomAlert,
    SpinerPages
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {

  #headerService = inject(HeaderSevice)
  #unsubscribeLogin!: Subscription;
  #unsubscribeLogout!: Subscription;
  #cookieService = inject<CookieService>(CookieService);
  #authService = inject<AuthService>(AuthService);
  #shoopingCartService = inject(ShoopingCartService);
  #router = inject(Router);
  #loggeInService = inject(LoggeInService);
  appRef = inject(ApplicationRef);

  public alertService = inject(AlertService);
  public loginForm: any = new FormGroup({});
  public formbuilder = inject(FormBuilder);
  
  public headerWhite = signal<boolean>(false);
  public padLock = signal<boolean>(true);
  public loadingButton = signal<boolean>(false);
  //router = inject(RouterModule);
  public dataShoppingCart = signal<IShopingCartData[]>([]);
  ngOnInit(): void {
    this.setWhiteHeader();
    this.formLogin();
  }

  ngOnDestroy(): void {
    if(this.#unsubscribeLogin){
      this.#unsubscribeLogin.unsubscribe();
    }

    if(this.#unsubscribeLogout){
      this.#unsubscribeLogout.unsubscribe();
    }

  }

  public formLogin(): void {
    this.loginForm = this.formbuilder.group({
      email: ['',Validators.compose([Validators.required, Validators.minLength(5), Validators.email])],
      password: ['',Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(100)])],
    });
  }

  get email(){return this.loginForm.get('email')}
  get password(){return this.loginForm.get('password')}

  public getWhiteHeader(): void {
      this.#headerService.getWhiteHeader().subscribe((value) => {
      this.headerWhite.set(value);
    });
  }

  public loginUser(): void {
    //validamos que no hay token en las cookies
    if (!this.#cookieService.check('token')) {
      //validamos que el formulario es valido
      if (this.loginForm.valid) {
        const loginData: ILogin = {
          email: this.loginForm.get('email')?.value || '',
          password: this.loginForm.get('password')?.value || '',
        };
        //llamamos al servicio de login
        this.#unsubscribeLogin = this.#authService.login(loginData).subscribe({
          next: (response:ILoginResponse) => {
            //calcular la fecha de expiración en 5 días
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 5);
            this.#cookieService.set('token', response.token!, expirationDate, '/', undefined, true, 'Strict');
            // Guardamos el id en las cookies
            this.#cookieService.set('id', response.data!.id.toString(), expirationDate, '/', undefined, true, 'Strict');
            // Guardamos el nombre y el response en las cookies
            this.#cookieService.set('name', response.data!.name!, expirationDate, '/', undefined, true, 'Strict');
            // Guardamos el apellido y el response en las cookies
            this.#cookieService.set('lastname', response.data!.lastname!, expirationDate, '/', undefined, true, 'Strict');
            this.#cookieService.set('success', response.response!, expirationDate, '/', undefined, true, 'Strict');
            this.#cookieService.set('avatar', response.data!.image!, expirationDate, '/', undefined, true, 'Strict');
            this.#cookieService.set('email', response.data!.email!, expirationDate, '/', undefined, true, 'Strict');
            this.loadingButton.set(false);
            this.#loggeInService.upDateLoginStatus(true);
            this.#router.navigate(['/home']);
            this.getShopingCart();
          },
          error: (error:ILoginResponse) => {
            console.error('Error en el login:', error);
            this.loadingButton.set(false);
            if(error.errorVikingo?.errors){
              //el .flat() es para aplanar el array de errores y el object.values es para obtener los valores del objeto de errores
              const errorMessages = Object.values(error.errorVikingo.errors).flat();
              this.alertService.showAlert('error', errorMessages.join(' '));
            }else if(error.errorVikingo){
            this.alertService.showAlert('error', error?.errorVikingo?.message );
            }
            this.loginForm.reset();
          }
        });
      }
    }else{
      this.alertService.showAlert('info', 'Ya has iniciado sesión');
      this.loadingButton.set(false);
      //limpiar el formulario
    }
  }

  public getShopingCart(): void {
    const userId = Number(this.#cookieService.get('id'));
    //validamos si hay en el local storage esta la información del carrito de compras con informacion dentro del value
    this.dataShoppingCart.set(JSON.parse(localStorage.getItem('cart') || '[]'));
    console.log('Carrito de compras cargado desde localStorage:', this.dataShoppingCart());
    if (this.dataShoppingCart() === null || this.dataShoppingCart().length > 0) {
      //obtenemos el amount y el id_product de las señal dataShoppingCart
      const cartItems = this.dataShoppingCart().map(item => ({
        product_id: item.product_id,
        amount: item.amount
      }));
      //sincronizamos el carrito de compras con la API
      cartItems.forEach(item => {
        const request = {
          _method: 'POST',
          product_id: item.product_id,
          user_id: userId,
          amount: item.amount
        };
        this.#shoopingCartService.addToCart(request).subscribe({
          next: (response:IShopingCartResponse) => {
            this.#shoopingCartService.setRedPointActive(true);
            this.#cookieService.set('cart_updated', 'true');
          },
          error: (err:IShopingCartResponse) => { 
            console.error('Error al sincronizar:', err);
          }
        });
      });
      //limpiamos el carrito de compras del local storage
      localStorage.removeItem('cart');
    }else{
      //si no hay información en el local storage, obtenemos el carrito de compras desde la API
      this.#shoopingCartService.getCartItemsByUser(userId).subscribe({
        next: (response:IShopingCartResponse) => {
          this.dataShoppingCart.set(response.data || []);
          if(this.dataShoppingCart().length > 0){
            this.#shoopingCartService.setRedPointActive(true);
            this.#cookieService.set('cart_updated', 'true');
          }
        },
        error: (err:IShopingCartResponse) => {
          console.error('Error al obtener el carrito de compras:', err);
        }
      });
    }
  }
  
  public setWhiteHeader(): void {
    this.#headerService.setWhiteHeader(true);
  }

  public setPadLock(): void {
    this.padLock.set(!this.padLock());
  }

  navitateToRegister(): void {
    this.#router.navigate(['/home/registrarse']);
    this.#headerService.setWhiteHeader(true);
  }

}

import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";


export const AuthRoutes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginPageComponent,
        title: 'Iniciar sesión',
      },
      {
        path: 'register',
        component: RegisterPageComponent,
        title: 'Cuenta Nueva',
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];


export default AuthRoutes;

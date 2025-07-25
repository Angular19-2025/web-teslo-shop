import { Routes } from '@angular/router';
import { NoAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: ()=> import('./auth/auth.route'),
    // TO DO => Guards
    canMatch: [
      NoAuthenticatedGuard,
      // ()=>{ console.log('auth guard => TEST'); return false }
    ]
  },
  {
    path:'admin',
    loadChildren: ()=> import('./admin-dashboard/admin-dashboard.routes')
  },
  {
    path :'',
    loadChildren: ()=> import('./store-front/store-front.routes')
  }
];

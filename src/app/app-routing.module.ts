import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './layouts/login/login.component';
import { MainComponent } from './layouts/main/main.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { ServerErrorComponent } from './components/server-error/server-error.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./modules/auth/auth.module').then((m) => m.AuthModule),
      },
      { path: '', redirectTo: 'auth', pathMatch: 'full' },
    ],
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'products',
        loadChildren: () =>
          import('./modules/products/products.module').then(
            (m) => m.ProductsModule
          ),
        canActivate: [RoleGuard],
        data: { role: 'admin' },
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./modules/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
        canActivate: [RoleGuard],
        data: { role: 'user' },
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' },
    ],
  },
  { path: 'server-error', component: ServerErrorComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

// role.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const requiredRole = route.data['role'];
    const hasRequiredRole = this.authService.hasRole(requiredRole);
    if (hasRequiredRole) {
      return true;
    } else {
      return this.router.parseUrl('/403');
    }
  }
}

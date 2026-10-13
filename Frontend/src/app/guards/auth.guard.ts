import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      // Vérifier le rôle si spécifié dans la route
      const expectedRoles = route.data['roles'] as Array<string>;
      
      if (expectedRoles) {
        const userRole = this.authService.getUserRole();
        if (userRole && expectedRoles.includes(userRole)) {
          return true;
        } else {
          // Rediriger vers la page appropriée selon le rôle
          this.redirectToRolePage();
          return false;
        }
      }
      
      return true;
    }

    // Rediriger vers login si non authentifié
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  private redirectToRolePage(): void {
    const role = this.authService.getUserRole();
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'DOCTOR':
        this.router.navigate(['/doctor']);
        break;
      case 'SECRETARY':
        this.router.navigate(['/secretary']);
        break;
      case 'PATIENT':
        this.router.navigate(['/patient']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}

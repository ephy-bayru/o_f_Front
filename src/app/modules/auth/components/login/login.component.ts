import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { IAuth } from '../../models/user';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/core/services/notification.service';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;
  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: [
      '',
      [Validators.required, Validators.pattern(/^[a-zA-Z0-9@]{8,30}$/)],
    ],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const authData = this.loginForm.value as IAuth;
      this.authService.login(authData).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe({
        next: (res: any) => {
          this.router.navigate(['/products']);
          this.notificationService.showSuccess(res.message);
        },
        error: (err) => {
          this.notificationService.showError(err.error.message);
        },
      });
    }
  }
  
}

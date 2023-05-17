import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      panelClass: ['error-snackbar']
    });
  }

  showInfo(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      panelClass: ['info-snackbar']
    });
  }

  showWarning(message: string, duration: number = 5000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      panelClass: ['warning-snackbar']
    });
  }

}

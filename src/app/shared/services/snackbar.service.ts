import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private duration: number | undefined;

  constructor(private _snack: MatSnackBar) {
    this.duration = 3000;
  }

  public openSuccess(message: string) {
    this._snack.open(message, '', {
      duration: this.duration,
      panelClass: ['primary-color-snackbar'],
      horizontalPosition: 'end',
    });
  }

  public openError(message: string) {
    this._snack.open(message, '', {
      duration: this.duration,
      panelClass: ['danger-color-snackbar'],
      horizontalPosition: 'end',
    });
  }
}

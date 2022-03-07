import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertModalService {

  constructor() { }

  public success(message: string, title: string, time?: number): void {
    this.showAlert(title, message, 'success', time);
  }
  public info(message: string, title: string, time?: number): void {
    this.showAlert(title, message, 'info', time);
  }
  public danger(message: string, title: string, time?: number): void {
    this.showAlert(title, message, 'error', time);
  }


  private showAlert(title: string, message: string, icon: SweetAlertIcon, time?: number): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: (time === undefined) ? 3000: time,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire(title, message, icon);
  }
}

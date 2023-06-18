import { Component, OnDestroy, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub:Subscription | undefined
  
  constructor(public authService: AuthService) {}
  ngOnDestroy(){
    this.authStatusSub?.unsubscribe();
  }
  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatuslistener().subscribe(authStatus =>{
      this.isLoading = false;
    })
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true
    this.authService.login(form.value.email, form.value.password);
  }
}

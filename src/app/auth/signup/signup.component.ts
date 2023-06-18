import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
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

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true
    this.authService.createUser(form.value.email, form.value.password)
  }
}

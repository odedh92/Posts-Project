import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  private authListenerSubs!: Subscription;
  constructor(private authService: AuthService) {}

  ngOnDestroy() {}
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authListenerSubs = this.authService
      .getAuthStatuslistener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }
  onLogOut(){
    this.authService.logout();
  }
}

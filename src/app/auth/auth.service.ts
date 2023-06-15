import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthnticated = false;
  public token: string | null | undefined;
  private tokenTimer: NodeJS.Timer | null | undefined;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router) {}

  getToekn() {
    return this.token ?? '';
  }
  getIsAuth() {
    return this.isAuthnticated;
  }
  getAuthStatuslistener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }
  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration)
          this.isAuthnticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation){
      return 
    }
    const now = new Date();
    const expirationDate = authInformation?.expirationDate;
    if (expirationDate instanceof Date && expirationDate.getTime() > now.getTime()) {
      const expiresIn = expirationDate.getTime() - now.getTime();
      this.token = authInformation?.token;
      this.isAuthnticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }
  logout() {
    this.token = null;
    this.isAuthnticated = false;
    this.authStatusListener.next(false);
    this.clearAuthData();
    this.router.navigate(['/']);
  }
  private setAuthTimer(duration:number){
    (this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000));
  }
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }
}

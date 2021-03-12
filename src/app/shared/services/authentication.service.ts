import { UserForRegistrationDto } from './../../_interfaces/user/userForRegistrationDto.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { UserForAuthenticationDto } from 'src/app/_interfaces/user/userForAuthenticationDto.model';
import { AuthResponseDto } from 'src/app/_interfaces/response/registrationResponseDto.model';
import { Observable, Subject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ForgotPasswordDto } from 'src/app/_interfaces/user/forgotPassword';
import { ResetPasswordDto } from 'src/app/_interfaces/user/resetPasswordDto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _http: HttpClient, private _envUrl: EnvironmentUrlService, private _jwtHelper: JwtHelperService) { }

  private _authChangeSub = new Subject<boolean>()
  public authChanged = this._authChangeSub.asObservable();

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");

    return token && !this._jwtHelper.isTokenExpired(token);
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this._authChangeSub.next(isAuthenticated);
  }

  public registerUser = (route: string, body: UserForRegistrationDto) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body);
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
  public loginUser = (route: string, body: UserForAuthenticationDto) : Observable<any>=> {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body);
  }

  public logout = () => {
    localStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);
  }
  public isUserAdmin = (): boolean => {
    const token = localStorage.getItem("token");
    const decodedToken = this._jwtHelper.decodeToken(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
    return role === 'Administrator';
  }
  public forgotPassword = (route: string, body: ForgotPasswordDto) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body);
  }
  public resetPassword = (route: string, body: ResetPasswordDto) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body);
  }
}

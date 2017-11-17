import { TokenManagerService } from './token-manager.service';
import { UserService } from './user.service';
import { LoginService } from './login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from './user';
import { LoginComponent } from './login/login.component';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response } from '@angular/http';

// const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  animal: string;
  name: string;
  login: string;
  Logado: boolean;
  Usuario: User;
  users: User[];
  private loginUrl = 'http://siatra.localhost/api/login';
  private usersUrl = 'http://siatra.localhost/api/users';

  options = {
    direction: 'row',
    mainAxis: 'space-around',
    crossAxis: 'center'
  };

  direction = 'row';
  someValue = 20;
  mainAxis = 'space-around';
  crossAxis = 'center';

  constructor(private tokenManager: TokenManagerService,
              private loginService: LoginService,
              private userService: UserService,
              public dialog: MatDialog) {
    if (!this.verificaLogin()) {
      // this.openLoginDialog();
      this.Logado = false;
    }
  }

  verificaLogin() {
    if (localStorage.getItem('Logado')) {
      this.Usuario = JSON.parse(localStorage.getItem('currentUser'));
      this.Logado = true;
      return true;
    }
    return false;
  }


  chamalogin() {
    this.loginService.Login('atxaloisio@hotmail.com', 'mestre').subscribe(data => {
      console.log(data);
      this.Usuario = data.usuario;
      console.log(this.Usuario.name);
      console.log(data.token);
      this.getUsuarios(data.token);
    },
      error => alert(error),
    );
  }
  // chamalogin() {
  //   this.realizaLogin().subscribe(data => {
  //     console.log(data);
  //     this.Usuario = data.usuario;
  //     console.log(this.Usuario.name);
  //     console.log(data.token);
  //     // this.getUsuarios(data.token);
  //   },
  //     error => alert(error),
  //   );
  // }

  // realizaLogin() {
  //   const headers = new Headers({
  //     'Content-Type': 'application/json',
  //     Accept: 'application/json'
  //   });

  //   const postData = {
  //     email: 'atxaloisio@hotmail.com',
  //     password: 'mestre'
  //   };

  //   return this.http.post(this.loginUrl, JSON.stringify(postData), {
  //     headers: headers
  //   })
  //     .map((res: Response) => res.json())
  //     .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  // }

  getUsuarios(accessToken: string) {
    this.userService.getUsers(accessToken).subscribe(users => {
      this.users = users;
      for (let index = 0; index < this.users.length; index++) {
        const item: User = this.users[index];
        console.log(item.name);
      }
    });
  }

  // getUsuarios(accessToken: string) {
  //   this.getUsers(accessToken).subscribe(users => {
  //     this.users = users;
  //     console.log(users);
  //   });
  // }

  // getUsers(accessToken: string): Observable<User[]> {
  //   const headers = new Headers({
  //     Accept: 'application/json',
  //     Authorization: 'Bearer ' + accessToken
  //   });

  //   return this.http
  //     .get(this.usersUrl, {
  //       headers: headers
  //     })
  //     .map((res: Response) => res.json())
  //     .catch((error: any) =>
  //       Observable.throw(error.json().error || 'Server error')
  //     );
  // }

  // openDialog(): void {
  //   let dialogRef = this.dialog.open(DialogOverviewComponent, {
  //     width: '250px',
  //     disableClose: true,
  //     data: { name: this.name, animal: this.animal }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     this.animal = result;
  //   });
  // }

  openLoginDialog(): void {
    const dialogLoginRef = this.dialog.open(LoginComponent, {
      width: '500px',
      height: '320px',
      disableClose: true,
      data: { email: '', password: ''}
    });

    dialogLoginRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if ((result.Usuario != null) || (result.Usuario !== undefined)) {
        this.Usuario = result.Usuario;
        this.Logado = result.logado;
        this.tokenManager.store(result.token);
        localStorage.setItem('currentUser', JSON.stringify(this.Usuario));
        localStorage.setItem('Logado', JSON.stringify({Logado: this.Logado}));
      }
    });
  }

  logOut(): void {
    this.Logado = false;
    this.tokenManager.delete();
    localStorage.removeItem('Logado');
    localStorage.removeItem('currentUser');
  }

  layoutAlign() {
    return `${this.options.mainAxis} ${this.options.crossAxis}`;
  }

  layoutAlign2() {
    return `${this.mainAxis} ${this.crossAxis}`;
  }

  toggleDirection() {
    const next = (DIRECTIONS.indexOf(this.direction) + 1) % DIRECTIONS.length;
    this.direction = DIRECTIONS[next];
  }

  lerToken() {
    alert(this.tokenManager.retrieve());
  }

  // emailFormControl = new FormControl('', [
  //   Validators.required,
  //   Validators.pattern(EMAIL_REGEX)]);
}

import { Produto } from './produto';
import { Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import { Http, Headers, Response } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ProdutoService {
  private produtoUrl = 'http://siatra.localhost/api/produtos';

  constructor(private _http: Http) {}

  /** Metodo que retorna um observable com dados da listagem de produtos
   *  parametro: acessToken: string
  */
  getProdutos(accessToken: string) {
    const headers = new Headers({
      Accept: 'application/json',
      Authorization: 'Bearer ' + accessToken
    });

    return this._http
      .get(this.produtoUrl, { headers: headers })
      .map((res: Response) => res.json())
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }
}

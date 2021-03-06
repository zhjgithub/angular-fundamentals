import { Injectable } from '@angular/core';
import { GitSearch } from './git-search';
import { GitUser } from './git-user';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GitSearchService {
  cachedSearchValues: Array<{ [query: string]: GitSearch }> = [];
  cachedUserValues: Array<{ [query: string]: GitUser }> = [];

  constructor(private http: HttpClient) {}

  gitSearch(query: string): Promise<HttpResponse<GitSearch>> {
    const promise = new Promise<HttpResponse<GitSearch>>((resolve, reject) => {
      this.http
        .get('https://api.github.com/search/repositories?q=' + query, {
          observe: 'response'
        })
        .toPromise()
        .then(
          response => {
            resolve(response as HttpResponse<GitSearch>);
          },
          error => reject(error)
        );
    });
    return promise;
  }

  gitSearchPagination(pageUrl: string) {
    const promise = new Promise<HttpResponse<GitSearch>>((resolve, reject) => {
      this.http
        .get(pageUrl, {
          observe: 'response'
        })
        .toPromise()
        .then(
          response => {
            resolve(response as HttpResponse<GitSearch>);
          },
          error => reject(error)
        );
    });
    return promise;
  }

  gitUser = (query: string): Promise<GitUser> => {
    const promise = new Promise<GitUser>((resolve, reject) => {
      if (this.cachedUserValues[query]) {
        resolve(this.cachedUserValues[query]);
      } else {
        this.http
          .get('https://api.github.com/search/users?q=' + query)
          .toPromise()
          .then(
            response => resolve(response as GitUser),
            error => reject(error)
          );
      }
    });
    return promise;
  };
}

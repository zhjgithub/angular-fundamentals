import { Injectable } from '@angular/core';
import { GitSearch } from './git-search';
import { GitUser } from './git-user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GitSearchService {
  cachedSearchValues: Array<{ [query: string]: GitSearch }> = [];
  cachedUserValues: Array<{ [query: string]: GitUser }> = [];

  constructor(private http: HttpClient) {}

  gitSearch = (query: string): Promise<GitSearch> => {
    const promise = new Promise<GitSearch>((resolve, reject) => {
      if (this.cachedSearchValues[query]) {
        resolve(this.cachedSearchValues[query]);
      } else {
        this.http
          .get('https://api.github.com/search/repositories?q=' + query)
          .toPromise()
          .then(
            response => {
              resolve(response as GitSearch);
              this.cachedSearchValues[query] = response;
            },
            error => reject(error)
          );
      }
    });
    return promise;
  };

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

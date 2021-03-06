import { Component, OnInit } from '@angular/core';
import { GitSearch } from '../git-search';
import { GitSearchService } from '../git-search.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-git-search',
  templateUrl: './git-search.component.html',
  styleUrls: ['./git-search.component.css']
})
export class GitSearchComponent implements OnInit {
  searchResults: GitSearch;
  searchQuery: string;
  title: string;
  displayQuery: string;
  prevPage: string;
  nextPage: string;
  constructor(
    private GitSearchService: GitSearchService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.searchQuery = params.get('query');
      this.displayQuery = params.get('query');
      this.gitSearch();
    });

    this.route.data.subscribe(result => (this.title = result.title));
  }

  gitSearch() {
    this.GitSearchService.gitSearch(this.searchQuery).then(
      response => {
        this.searchResults = { ...response.body };
        const linkHeader = response.headers.get('Link');
        if (linkHeader) {
          const matchPrev = linkHeader.match(
            /<(http[s]?:\/\/.+)>;?\s*rel="prev"/i
          );
          this.prevPage = matchPrev ? matchPrev[1] : null;
          const matchNext = linkHeader.match(
            /<(http[s]?:\/\/.+)>;?\s*rel="next"/i
          );
          this.nextPage = matchNext ? matchNext[1] : null;
        } else {
          this.prevPage = null;
          this.nextPage = null;
        }
      },
      error => {
        alert('Error: ' + error.statusText);
      }
    );
  }

  gitQueryPage(pageUrl: string) {
    this.GitSearchService.gitSearchPagination(pageUrl).then(
      response => {
        this.searchResults = { ...response.body };
        const linkHeader = response.headers.get('Link');
        const matchPrev = linkHeader.match(
          /<(http[s]?:\/\/.+)>;?\s*rel="prev"/i
        );
        this.prevPage = matchPrev ? matchPrev[1] : null;
        const matchNext = linkHeader.match(
          /<(http[s]?:\/\/.+)>;?\s*rel="next"/i
        );
        this.nextPage = matchNext ? matchNext[1] : null;
      },
      error => {
        alert('Error: ' + error.statusText);
      }
    );
  }

  sendQuery() {
    if (this.displayQuery === this.searchQuery) {
      this.gitSearch();
    } else {
    this.searchResults = null;
    this.router.navigate(['/search/' + this.searchQuery]);
  }
}
}

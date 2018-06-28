import { Component, OnInit } from '@angular/core';
import { GitSearchService } from './git-search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GitHub Browser';

  constructor(private GitSearchService: GitSearchService) {}

  ngOnInit() {
    this.GitSearchService.gitSearch('angular').then(
      response => alert('Total Libraries Found: ' + response.total_count),
      error => alert('Error: ' + error.statusText)
    );
    this.GitSearchService.gitUser('angular').then(
      response => alert('Total Users Found: ' + response.total_count),
      error => alert('Error: ' + error.statusText)
    );
  }
}

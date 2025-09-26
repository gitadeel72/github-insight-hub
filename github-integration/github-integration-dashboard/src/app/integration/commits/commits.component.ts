import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubApiService } from '../github-api.service';
import { ColDef, GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-commits',
  templateUrl: './commits.component.html',
  standalone: false,
  styleUrls: ['./commits.component.scss']
})
export class CommitsComponent implements OnInit {
  repoId!: string;
  commits: any[] = [];

rowData: any[] = [];
  loading = true;

  colDefs: ColDef[] = [
    { field: 'sha', headerName: 'SHA', width: 280, cellRenderer: this.linkRenderer },
    { field: 'message', headerName: 'Message', flex: 1 },
    { field: 'author.name', headerName: 'Author', width: 150 },
    { field: 'author.email', headerName: 'Email', width: 220 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'repoFullName', headerName: 'Repository', flex: 1 }
  ];

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    domLayout: 'autoHeight',
    defaultColDef: { sortable: true, filter: true, resizable: true }
  };

  constructor(private api: GithubApiService, private route: ActivatedRoute,) {}
  // }
  ngOnInit(): void {
        this.repoId = this.route.snapshot.paramMap.get('id')!;

    this.fetchCommits();
  }

  fetchCommits(): void {
    this.loading = true;
    this.api.commits(this.repoId ||"").subscribe({
      next: (res: any) => {
        this.rowData = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching commits', err);
        this.loading = false;
      }
    });
  }

    linkRenderer(params: any) {
    // Create clickable link to GitHub commit
    if (params.value) {
      return `<a href="https://github.com/${params.data.repoFullName}/commit/${params.value}" 
                 target="_blank" rel="noopener noreferrer">
                 ${params.value.substring(0, 10)}...
              </a>`;
    }
    return '';
  }
}

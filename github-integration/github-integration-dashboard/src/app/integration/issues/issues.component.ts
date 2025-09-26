import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridOptions } from 'ag-grid-community';
import { GithubApiService } from '../github-api.service';

@Component({
  selector: 'app-issues',
  standalone:false,
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {
  repoId!: string;
  rowData: any[] = [];
  loading = true;

  colDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'state', headerName: 'State', width: 120 },
    { field: 'user.login', headerName: 'Created By', width: 150 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    { field: 'html_url', headerName: 'Link', cellRenderer: this.linkRenderer }
  ];

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    domLayout: 'autoHeight',
    defaultColDef: { sortable: true, filter: true, resizable: true }
  };

  constructor(private route: ActivatedRoute, private api: GithubApiService) {}

  ngOnInit(): void {
    this.repoId = this.route.snapshot.paramMap.get('id')!;
    this.fetchIssues();
  }

  fetchIssues(): void {
    this.loading = true;
    this.api.issues(this.repoId).subscribe({
      next: (res: any) => {
        this.rowData = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching issues', err);
        this.loading = false;
      }
    });
  }

  // 🔗 Link renderer for clickable issue URLs
  linkRenderer(params: any) {
    return params.value
      ? `<a href="${params.value}" target="_blank" rel="noopener noreferrer">View</a>`
      : '';
  }
}

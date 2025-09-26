import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ColDef, GridOptions } from 'ag-grid-community';
import { GithubApiService } from '../github-api.service';

@Component({
  selector: 'app-pulls',
  standalone: false,
  templateUrl: './pulls.component.html',
  styleUrl: './pulls.component.scss'
})
export class PullsComponent implements OnInit {
  repoId!: string;
  rowData: any[] = [];
  loading = true;

  colDefs: ColDef[] = [
    { field: 'number', headerName: 'PR #', width: 120 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'user.login', headerName: 'Author', width: 150 },
    { field: 'state', headerName: 'State', width: 120 },
    { field: 'created_at', headerName: 'Created At', width: 200 },
    { field: 'updated_at', headerName: 'Updated At', width: 200 },
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
    this.fetchPulls();
  }

  fetchPulls(): void {
    this.loading = true;
    this.api.pulls(this.repoId).subscribe({
      next: (res: any) => {
        this.rowData = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching pull requests', err);
        this.loading = false;
      }
    });
  }

  linkRenderer(params: any) {
    return params.value
      ? `<a href="${params.value}" target="_blank" rel="noopener noreferrer">View PR</a>`
      : '';
  }
}

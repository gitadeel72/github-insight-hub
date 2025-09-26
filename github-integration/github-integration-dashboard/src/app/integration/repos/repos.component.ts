import { Component, OnInit } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { GithubApiService } from '../github-api.service';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  standalone: false,
  styleUrls: ['./repos.component.scss']
})
export class ReposComponent implements OnInit {
  rowData: any[] = [];
  loading = true;

  colDefs: ColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'full_name', headerName: 'Full Name', flex: 1 },
    { field: 'language', headerName: 'Language', width: 150 },
    { field: 'stargazers_count', headerName: 'Stars', width: 120 }
  ];

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    domLayout: 'autoHeight',
    defaultColDef: { sortable: true, filter: true, resizable: true },
    onRowClicked: (event) => this.onRepoSelected(event.data)
  };

  constructor(private api: GithubApiService, public router: Router) {}

  ngOnInit(): void {
    this.api.repos().subscribe({
      next: (res: any) => {
        this.rowData = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching repos', err);
        this.loading = false;
      }
    });
  }

  onRepoSelected(repo: any) {
    
    // Navigate to repo detail view
    this.router.navigate(['/integration/repos', repo._id]);
  }
}

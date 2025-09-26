import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IntegrationService } from './integration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubApiService } from './github-api.service';
import { GridApi, GridOptions } from 'ag-grid-community';
import { HttpParams } from '@angular/common/http';
import { ColDef,GridReadyEvent } from 'ag-grid-community';



interface CollectionResponse {
  collections: string[];
}

interface DataResponse {
  page: number;
  limit: number;
  total: number;
  fields: string[];
  data: any[];
}

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  standalone: false,
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {
  Math = Math; 
  collections: string[] = [];
  selectedCollection: string | null = null;
  searchTerm: string = '';
  page = 1;
  pageSize = 25;
  rowData: any[] = [];
  columnDefs: ColDef[] = [];
  totalRows = 0;
  private gridApi: GridApi | null = null;

  constructor(public integration: IntegrationService, private sb: MatSnackBar, private route: ActivatedRoute,
    private api: GithubApiService,
    private router: Router,) { }
      loading = false;
    navLinks = [
  { path: 'orgs', label: 'Organizations' },
  { path: 'repos', label: 'Repositories' },
];

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

  ngOnInit(): void {    
    this.integration.loadStatus();
     this.route.queryParams.subscribe((params) => {
      const code = params['code'];

      if (code) {
        // ✅ use service instead of direct HttpClient
        this.integration.callback(code).subscribe({
          next: (res: any) => {

            if (res?.userId) {
              localStorage.setItem('x-user-id', res.userId);
            }
            if (res?.userName) {
              localStorage.setItem('userName', res.userName);
            }
            this.integration.loadStatus();
            this.router.navigate(['/integration']);
          },
          error: (err) => {
          },
        });
      } else {
      }
    });
    if (this.integration.statusSig()) {
      this.loadCollections()
    }
  }

  getRepos(){
    this.loading = true
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

  connect() { this.integration.connect(); }

  remove() {
    const userId = this.integration.statusSig()?.user?.id ?? '';
    this.integration.remove(userId).subscribe(() => {
      this.integration.loadStatus();
      localStorage.removeItem('x-user-id');
      localStorage.removeItem('userName');
      this.sb.open('Integration removed', 'OK', { duration: 2000 });
    });
  }

  resync() {
    const userId = this.integration.statusSig()?.user?.id ?? '';
    this.integration.resync(userId).subscribe(() => {
      this.sb.open('Re-sync requested', 'OK', { duration: 2000 });
    });
  }

  loadCollections(): void {
    this.integration.loadCollections().subscribe((res:any)=>{      
            this.collections = res.collections;
    });
  }

  onCollectionChange(): void {
    this.page = 1;
    this.loadData();
  }

  loadData(): void {
    if (!this.selectedCollection) return;
    let params = new HttpParams()
      .set('page', this.page.toString())
      .set('limit', this.pageSize.toString());
    if (this.searchTerm) params = params.set('search', this.searchTerm);

    this.api.loadData(this.selectedCollection,params).subscribe({
      next: (res: any) => {
        this.rowData = res.data;
        this.totalRows = res.pagination.total;
        if (this.selectedCollection === 'commits') {
          this.columnDefs = this.getCommitColumnDefs();
        } else if (this.selectedCollection === 'pulls') {
          this.columnDefs = this.getPullsColumnDefs();
        } else if (this.selectedCollection === 'issues') {
          this.columnDefs = this.getIssuesColumnDefs();
        } else {
          const excludeFields = ['raw', '__v', '_id'];

          this.columnDefs = res.fields
            .filter((field: string) => !excludeFields.includes(field))
            .map((field: string) => ({
              headerName: field,
              field,
              sortable: true,
              filter: true,
            }));
        }
      },
      error: (err) => {
        console.error('Error fetching repos', err);
        this.loading = false;
      }
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    if (this.selectedCollection) {
      this.loadData();
    }
  }

  onSearch(): void {
    this.page = 1;
    this.loadData();
  }

  onPaginationChange(newPage: number): void {
    this.page = newPage;
    this.loadData();
  }
  private getIssuesColumnDefs(): ColDef[] {
  return [
    {
      headerName: 'Number',
      field: 'number',
      width: 100
    },
    {
      headerName: 'Title',
      valueGetter: p => p.data.title || p.data.raw?.title,
      flex: 3,
      wrapText: true,
      autoHeight: true
    },
    {
      headerName: 'Author',
      valueGetter: p => p.data.user?.login || p.data.raw?.user?.login,
      flex: 1
    },
    {
      headerName: 'State',
      field: 'state',
      width: 120
    },
    {
      headerName: 'Labels',
      valueGetter: p => (p.data.raw?.labels || [])
        .map((l: any) => l.name)
        .join(', '),
      flex: 2,
      wrapText: true,
      autoHeight: true
    },
    {
      headerName: 'Comments',
      valueGetter: p => p.data.raw?.comments ?? 0,
      width: 120
    },
    {
      headerName: 'Created At',
      valueGetter: p => p.data.created_at || p.data.raw?.created_at,
      flex: 1
    },
    {
      headerName: 'Updated At',
      valueGetter: p => p.data.updated_at || p.data.raw?.updated_at,
      flex: 1
    },
    {
      headerName: 'Repo',
      field: 'repoFullName',
      flex: 1
    },
    {
      headerName: 'Issue Link',
      valueGetter: p => p.data.raw?.html_url,
      cellRenderer: (params:any) =>
        params.value
          ? `<a href="${params.value}" target="_blank">View</a>`
          : '',
      width: 120
    }
  ];
}

  private getPullsColumnDefs(): ColDef[] {
    return [
      {
        headerName: 'Number',
        field: 'number',
        width: 100
      },
      {
        headerName: 'Title',
        valueGetter: p => p.data.title || p.data.raw?.title,
        flex: 3,
        wrapText: true,
        autoHeight: true
      },
      {
        headerName: 'Author',
        valueGetter: p => p.data.user?.login || p.data.raw?.user?.login,
        flex: 1
      },
      {
        headerName: 'State',
        field: 'state',
        width: 120
      },
      {
        headerName: 'Created At',
        valueGetter: p => p.data.created_at || p.data.raw?.created_at,
        flex: 1
      },
      {
        headerName: 'Updated At',
        valueGetter: p => p.data.updated_at || p.data.raw?.updated_at,
        flex: 1
      },
      {
        headerName: 'Repo',
        field: 'repoFullName',
        flex: 1
      },
      {
        headerName: 'PR Link',
        valueGetter: p => p.data.raw?.html_url,
        cellRenderer: (params: any) =>
          params.value
            ? `<a href="${params.value}" target="_blank">View</a>`
            : '',
        width: 120
      }
    ];
  }

  private getCommitColumnDefs(): ColDef[] {
    return [
      {
        headerName: 'Message',
        valueGetter: p => p.data.message || p.data.raw?.commit?.message,
        flex: 3,
        wrapText: true,
        autoHeight: true
      },
      {
        headerName: 'SHA',
        field: 'sha',
        flex: 1,
        cellRenderer: (params: any) =>
          params.value ? params.value.substring(0, 8) + '…' : ''
      },
      {
        headerName: 'Author',
        valueGetter: p => p.data.author?.name || p.data.raw?.author?.login,
        flex: 1
      },
      {
        headerName: 'Repo',
        field: 'repoFullName',
        flex: 1
      },
      {
        headerName: 'Date',
        valueGetter: p => p.data.date || p.data.author?.date,
        flex: 1
      }
    ];
  }

}

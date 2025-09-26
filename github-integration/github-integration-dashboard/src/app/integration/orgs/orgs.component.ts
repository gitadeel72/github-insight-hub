import { Component, OnInit } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { IntegrationService } from '../integration.service';
import { GithubApiService } from '../github-api.service';

@Component({
  selector: 'app-orgs',
  standalone: false,
  templateUrl: './orgs.component.html',
  styleUrls: ['./orgs.component.scss']
})
export class OrgsComponent implements OnInit {
  rowData: any[] = [];
  loading = true;

  // AG Grid Column Definitions
  colDefs: ColDef[] = [
    { field: 'login', headerName: 'Login', sortable: true, filter: true, resizable: true },
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'url', headerName: 'URL', cellRenderer: this.linkRenderer },
    { field: 'repos_url', headerName: 'Repos URL', cellRenderer: this.linkRenderer },
    { field: 'description', headerName: 'Description', flex: 1 }
  ];

  gridOptions: GridOptions = {
    pagination: true,
    paginationPageSize: 10,
    domLayout: 'autoHeight',
    defaultColDef: { sortable: true, filter: true, resizable: true }
  };

  constructor(private integration: IntegrationService, private api: GithubApiService) {}

  ngOnInit(): void {
    this.fetchOrganizations();
  }

  fetchOrganizations(): void {
    this.loading = true;
    this.api.orgs().subscribe((res:any) => {
      
    this.rowData = res.data || [];   // ✅ only the data array
     });
  }

  // Custom cell renderer for clickable links
  linkRenderer(params: any) {
    return params.value
      ? `<a href="${params.value}" target="_blank" rel="noopener noreferrer">${params.value}</a>`
      : '';
  }
}

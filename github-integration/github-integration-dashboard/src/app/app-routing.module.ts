import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'integration',
    loadChildren: () =>
      import('./integration/integration.module').then(m => m.IntegrationModule)
  },
  { path: '', redirectTo: 'integration', pathMatch: 'full' },
  { path: '**', redirectTo: 'integration' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

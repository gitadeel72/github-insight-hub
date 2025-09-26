import { Component, computed } from '@angular/core';
import { IntegrationService } from '../integration.service';

@Component({
  selector: 'app-connect-panel',
  templateUrl: './connect-panel.component.html',
  standalone: false,
  styleUrls: ['./connect-panel.component.scss']
})
export class ConnectPanelComponent {
  status = computed(() => this.integration.statusSig());
  constructor(private integration: IntegrationService) {}
  connect() { this.integration.connect(); }
}

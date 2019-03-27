import {Component, Injectable, Input, OnInit, ViewChild} from '@angular/core';
import {BaseDataService} from '../../shared/services/base-data.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {DialogComponent} from '../wily-dialog/dialog.component';
import {EndpointStatus} from '../../shared/enums/endpoint-status.enum';

@Injectable()
export class HelpDataService extends BaseDataService {

  protected overrideUrl: string;

  constructor(protected http: HttpClient) {
    super(http);
  }

  overrideBaseUrl(overrideUrl: string): void {
    this.overrideUrl = overrideUrl;
  }

  getBaseUrl(): string {
    return this.overrideUrl ? this.overrideUrl : '';
  }

  getHelp(productKey: string, helpKey: string): Observable<Help> {
    return this.handleGet(`/api/public/products/${productKey}/help/${helpKey}`);
  }

}

@Component({
  selector: 'wily-help-widget',
  templateUrl: 'help-widget.component.html'
})
export class HelpWidgetComponent implements OnInit {

  @Input()
  productKey: string;

  @Input()
  helpKey: string;

  @Input()
  baseServiceUrl: string;

  @Input()
  appManagementUrl: string;

  @Input()
  canEdit = false;

  @Input()
  fontSize = '14px';

  @Input()
  displayMode = 'default';

  @ViewChild('dialog')
  dialog: DialogComponent;

  help: Help;

  status: EndpointStatus;
  EndpointStatus = EndpointStatus;

  constructor(
    private helpDataService: HelpDataService
  ) {}

  ngOnInit() {
    this.helpDataService.overrideBaseUrl(this.baseServiceUrl);
  }

  showHelp(): void {
    this.status = EndpointStatus.LOADING;
    this.help = new Help();
    this.help.name = 'Loading...';
    this.help.canEdit = this.canEdit;
    this.help.helpSystemUrl = `${this.baseServiceUrl}/products/${this.productKey}/help/elements/${this.helpKey}`;
    this.dialog.open();

    this.helpDataService.getHelp(this.productKey, this.helpKey).subscribe(
      result => {
        this.status = EndpointStatus.SUCCESS;
        this.help.name = result.name + ' Help';
        this.help.description = result.description;
        this.help.body = result.body;
      }, error => {
        this.status = EndpointStatus.ERROR;
        this.help.name = 'Help Topic Unavailable';
      }
    );
  }

  editHelpSystem() {
    window.open(this.help.helpSystemUrl, '_blank');
  }

}

export class Help {
  helpKey: string;
  productKey: string;
  name: string;
  description: string;
  body: string;
  canEdit: boolean;
  helpSystemUrl: string;
}

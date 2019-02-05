import {Component, Injectable, Input, OnInit, ViewChild} from '@angular/core';
import {BaseDataService} from '../../shared/services/base.data.service';
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

  getHelp(productKey: string, elementKey: string): Observable<HelpText> {
    return this.handleGet(`/api/public/products/${productKey}/elements/${elementKey}`);
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
  elementKey: string;

  @Input()
  serviceUrl: string;

  @Input()
  helpSystemUrl: string;

  @Input()
  canEdit = false;

  @Input()
  fontSize = '14px';

  @ViewChild('dialog')
  dialog: DialogComponent;

  help: HelpText;

  status: EndpointStatus;
  EndpointStatus = EndpointStatus;

  constructor(
    private helpDataService: HelpDataService
  ) {}

  ngOnInit() {
    this.helpDataService.overrideBaseUrl(this.serviceUrl);
  }

  showHelp(): void {
    this.status = EndpointStatus.LOADING;
    this.help = new HelpText();
    this.help.name = 'Loading...';
    this.help.canEdit = this.canEdit;
    this.help.helpSystemUrl = this.helpSystemUrl + '/products/' + this.productKey + '/help/elements/' + this.elementKey;
    this.dialog.open();

    this.helpDataService.getHelp(this.productKey, this.elementKey).subscribe(
      result => {
        this.status = EndpointStatus.SUCCESS;
        this.help.name = result.name + ' Help';
        this.help.description = result.description;
        this.help.helpText = result.helpText;
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

export class HelpText {
  name: string;
  description: string;
  helpText: string;
  canEdit: boolean;
  helpSystemUrl: string;
}

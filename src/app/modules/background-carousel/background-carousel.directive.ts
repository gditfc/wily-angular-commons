import {Directive, ElementRef, Input, OnDestroy} from '@angular/core';
import {BehaviorSubject} from 'rxjs/index';

@Directive({
  selector: '[bgCarouselImage]'
})
export class BackgroundCarouselDirective implements OnDestroy {

  private _options = new BehaviorSubject<CarouselOptions>(new CarouselOptions([], 2 , 10, false));
  private _interval: any;

  @Input('bgCarouselImage')
  set options(value: any) {
    this._options.next(value);
  }

  get options() {
    return this._options.getValue();
  }

  constructor(el: ElementRef) {
    this._options.subscribe(
      options => {
        this.initOptions();

        if (this.options.resetInterval) {
          clearInterval(this._interval);
          el.nativeElement.style.backgroundImage = null;
          this._interval = null;
        }

        if (this.options.images.length > 0 && !this._interval) {
          let imagePointer = 0;
          el.nativeElement.style.backgroundSize = 'cover';
          el.nativeElement.style.backgroundPosition = 'center center';
          el.nativeElement.style.backgroundRepeat = 'no-repeat';
          el.nativeElement.style.transition = `all ${this.options.transitionTime}s ease`;
          el.nativeElement.style.backgroundImage = `url(${this.options.images[imagePointer++]})`;

          if (!this._interval) {
            this._interval = setInterval(() => {
              el.nativeElement.style.backgroundImage = `url(${this.options.images[imagePointer++ % this.options.images.length]})`;
            }, this.options.viewTime * 1000);
          }
        }
      }
    );
  }

  private initOptions(): void {
    if (!this.options.images) {
      this.options.images = [];
    }

    if (!this.options.transitionTime) {
      this.options.transitionTime = 2;
    }

    if (!this.options.viewTime) {
      this.options.viewTime = 10;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this._interval);
  }
}

export class CarouselOptions {
  images: string[];
  transitionTime: number;
  viewTime: number;
  resetInterval: boolean;

  constructor(images: string[], transitionTime: number, viewTime: number, resetInterval: boolean) {
    this.images = images;
    this.transitionTime = transitionTime;
    this.viewTime = viewTime;
    this.resetInterval = resetInterval;
  }
}

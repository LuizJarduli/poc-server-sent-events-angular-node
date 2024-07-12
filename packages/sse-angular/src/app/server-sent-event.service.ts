import { Injectable, NgZone } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServerSentEventService {
  private eventSource!: EventSource;

  constructor(private zone: NgZone) {}

  getEventSource(url: string, options: EventSourceInit): EventSource {
    return new EventSource(url, options);
  }

  connectToServerSentEvents(
    url: string,
    options: EventSourceInit
  ): Observable<string> {
    this.eventSource = this.getEventSource(url, options);

    return new Observable((subscriber: Subscriber<string>) => {
      this.eventSource.onerror = (error) => {
        this.zone.run(() => subscriber.error(error));
      };

      this.eventSource.onmessage = (message) => {
        this.zone.run(() => subscriber.next(JSON.stringify(message.data)));
      };
    });
  }

  close(): void {
    if (!this.eventSource) {
      return;
    }

    this.eventSource.close();
  }
}

import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubscriptionLike } from 'rxjs';
import { ServerSentEventService } from './server-sent-event.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
  private readonly eventSourceSubscription: SubscriptionLike;

  public eventMessages: string[] = [];

  constructor(private eventSourceService: ServerSentEventService) {
    const url = 'http://localhost:3000/events';
    const options = {};

    this.eventSourceSubscription = this.eventSourceService
      .connectToServerSentEvents(url, options)
      .subscribe({
        next: (data) => {
          this.eventMessages.push(data);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ngOnDestroy() {
    this.eventSourceSubscription.unsubscribe();
    this.eventSourceService.close();
  }
}

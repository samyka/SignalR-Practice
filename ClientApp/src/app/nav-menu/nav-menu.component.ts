import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal/modal.service';
import { NotificationCounter, NotificationMessage } from '../Notification/notification';
import { NotificationService } from '../Notification/notification.service';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  notification: NotificationCounter;
  messages: Array<NotificationMessage>;
  errorMessage = '';

  private connection: HubConnection;

  constructor(
    private notificationService: NotificationService,
    private modalService: ModalService
    ) { }
  isExpanded = false;

  ngOnInit() {
    this.getNotificationCount();
    this.getNotificationMessage();
    this.connection = new HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.baseUrl + 'notify')
      .build();

      this.connection.start().then(function () {
      console.log('Notification: SignalR Connected successfully!');
    }).catch(function (err) {
      return console.error(err.toString());
    });

    this.connection.on("NotificationsHub", () => {
      this.getNotificationCount();
    });
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  getNotificationCount() {
    this.notificationService.getNotificationCount().subscribe(
      notification => {
        this.notification = notification;
      },
      error => this.errorMessage = <any>error
    );
  }

  getNotificationMessage() {
    this.notificationService.getNotificationMessage().subscribe(
      message => {
        this.messages = message;
      },
      error => this.errorMessage = <any>error
    );
  }

  deleteNotifications(): void {
    if (confirm(`Are you sure want to delete all notifications?`)) {
      this.notificationService.deleteNotifications()
        .subscribe(
          () => {
            this.closeModal();
          },
          (error: any) => this.errorMessage = <any>error
        );
    }
  }
  openModal() {
    this.getNotificationMessage();
    this.modalService.open('custom-modal');
  }

  closeModal() {
    this.modalService.close('custom-modal');
  }
}

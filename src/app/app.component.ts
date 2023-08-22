import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Tooltip } from 'bootstrap';
import { SettingsComponent } from './pages/settings/settings.component';

type Tab = {
  title: string;
  icon: string;
  routerLink: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'volex-app';

  activeTab: Tab = {
    title: 'Agents',
    icon: 'bi-columns-gap',
    routerLink: 'tst',
  };

  tabs: Tab[] = [
    this.activeTab,
    { title: 'Blueprints', icon: 'bi-stack', routerLink: 'tst' },
    { title: 'Requests', icon: 'bi-broadcast-pin', routerLink: 'tst' },
    {
      title: 'Settings',
      icon: 'bi-house-gear',
      routerLink: SettingsComponent.PATH,
    },
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initTooltips();
  }

  private initTooltips(): void {
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });
  }

  changeTab(tab: Tab) {
    this.activeTab = tab;
    console.log('test');
  }
}

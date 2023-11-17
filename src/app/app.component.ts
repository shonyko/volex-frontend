import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Tooltip } from 'bootstrap';
import { SettingsComponent } from './pages/settings/settings.component';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AgentsComponent } from './pages/agents/agents.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { BlueprintsComponent } from './pages/blueprints/blueprints.component';

type Tab = {
  title: string;
  icon: string;
  routerLink: string;
};

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
})
export class AppComponent implements OnInit, AfterViewInit {
  activeTab: Tab = {
    title: 'Agents',
    icon: 'bi-columns-gap',
    routerLink: AgentsComponent.PATH,
  };

  tabs: Tab[] = [
    this.activeTab,
    {
      title: 'Blueprints',
      icon: 'bi-stack',
      routerLink: BlueprintsComponent.PATH,
    },
    {
      title: 'Requests',
      icon: 'bi-broadcast-pin',
      routerLink: RequestsComponent.PATH,
    },
    {
      title: 'Settings',
      icon: 'bi-house-gear',
      routerLink: SettingsComponent.PATH,
    },
  ];

  ngOnInit(): void {
    this.initTheme();
  }

  ngAfterViewInit(): void {
    this.initTooltips();
  }

  private initTheme() {
    const theme = localStorage.getItem('theme') ?? 'dark';
    const html = document.querySelector('html') as HTMLHtmlElement;
    html.setAttribute('data-bs-theme', theme);
  }

  private initTooltips(): void {
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl);
    });
  }
}

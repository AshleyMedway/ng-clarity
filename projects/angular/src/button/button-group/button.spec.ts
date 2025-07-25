/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import {
  RouterLinkButtonGroupDemoRouteOneComponent,
  RouterLinkButtonGroupDemoRouteThreeComponent,
  RouterLinkButtonGroupDemoRouteTwoComponent,
} from '../../../../demo/src/app/button-group/angular/router-link/router-link-button-group';
import { ClrLoadingState } from '../../utils/loading/loading';
import { ClrLoadingModule } from '../../utils/loading/loading.module';
import { ButtonInGroupService } from '../providers/button-in-group.service';
import { ClrButton } from './button';
import { ClrButtonGroupModule } from './button-group.module';

@Component({
  template: `
    <clr-button #button1 type="button" name="button1" id="button1" (click)="toggleClick()">Button 1</clr-button>
    <clr-button #button2 [clrInMenu]="button2InMenu" class="btn btn-primary">Button 2</clr-button>
    <clr-button #button3 disabled class="test">Button 3</clr-button>
  `,
})
class TestButtonComponent {
  @ViewChild('button1') button1: ClrButton;
  @ViewChild('button2') button2: ClrButton;
  @ViewChild('button3') button3: ClrButton;

  flag = false;
  button2InMenu = true;

  toggleClick(): void {
    this.flag = !this.flag;
  }
}

@Component({
  template: `
    <clr-button #button1 [clrLoading]="load">Test Button 1</clr-button>
    <clr-button disabled class="btn btn-primary" #button2>Test Button 2</clr-button>
    <clr-button class="test" type="button" name="button3" id="button3" #button3>Test Button 3</clr-button>
    <div id="portal">
      <ng-template [ngTemplateOutlet]="button1.templateRef"></ng-template>
      <ng-template [ngTemplateOutlet]="button2.templateRef"></ng-template>
      <ng-template [ngTemplateOutlet]="button3.templateRef"></ng-template>
    </div>
  `,
})
export class ButtonViewTestComponent {
  @ViewChild('button1') button1: ClrButton;
  @ViewChild('button2') button2: ClrButton;
  @ViewChild('button3') button3: ClrButton;

  load = true;
}

@Component({
  template: `
    <clr-button-group>
      <clr-button id="button-one" routerLink="route-one" routerLinkActive="btn-primary">1</clr-button>
      <clr-button id="button-two" routerLink="route-two" routerLinkActive="btn-primary">2</clr-button>
      <clr-button id="button-two" routerLink="route-three" routerLinkActive="btn-primary">3</clr-button>
    </clr-button-group>
  `,
})
class TestButtonWithRouterLinkActiveComponent {}

export default function (): void {
  describe('Buttons', () => {
    let fixture: ComponentFixture<any>;
    let debugEl: DebugElement;
    let componentInstance: any;
    let buttons: HTMLButtonElement[];

    const routes: Routes = [
      {
        path: 'route-one',
        component: RouterLinkButtonGroupDemoRouteOneComponent,
      },
      {
        path: 'route-two',
        component: RouterLinkButtonGroupDemoRouteTwoComponent,
      },
      {
        path: 'route-three',
        component: RouterLinkButtonGroupDemoRouteThreeComponent,
      },
    ];

    describe('Typescript API', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrButtonGroupModule],
          declarations: [TestButtonComponent],
          providers: [ButtonInGroupService],
        });

        fixture = TestBed.createComponent(TestButtonComponent);
        fixture.detectChanges();
        debugEl = fixture.debugElement;
        componentInstance = debugEl.componentInstance;
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('adds a .btn class to the button when a class is not provided', () => {
        expect(componentInstance.button1.classNames).toBe('btn');
      });

      it('supports a class input', () => {
        expect(componentInstance.button2.classNames).toBe('btn btn-primary');
      });

      it('makes sure that the btn class is present. if absent, appends it at the end', () => {
        expect(componentInstance.button3.classNames).toBe('test btn');
      });

      it('supports a type input', () => {
        expect(componentInstance.button1.type).toBe('button');
        expect(componentInstance.button2.type).toBeNull();
        expect(componentInstance.button3.type).toBeNull();
      });

      it('supports a name input', () => {
        expect(componentInstance.button1.name).toBe('button1');
        expect(componentInstance.button2.name).toBeNull();
        expect(componentInstance.button3.name).toBeNull();
      });

      it('supports a id input', () => {
        expect(componentInstance.button1.id).toBe('button1');
        expect(componentInstance.button2.id).toBeTruthy();
        expect(componentInstance.button3.id).toBeTruthy();
      });

      it('supports a disabled input which is set to an empty string when the user passes a value', () => {
        expect(componentInstance.button1.disabled).toBeNull();
        expect(componentInstance.button2.disabled).toBeNull();
        expect(componentInstance.button3.disabled).toBe('');
      });

      it('emits a click event', () => {
        expect(componentInstance.flag).toBe(false);

        componentInstance.button1.emitClick();

        expect(componentInstance.flag).toBe(true);

        componentInstance.button1.emitClick();

        expect(componentInstance.flag).toBe(false);
      });

      it('implements LoadingListener', () => {
        expect(componentInstance.button1.loadingStateChange).toBeDefined();
      });

      it('sets loading to true on start loading', () => {
        expect(componentInstance.button1.loading).toBeUndefined();

        componentInstance.button1.loadingStateChange(ClrLoadingState.LOADING);

        expect(componentInstance.button1.loading).toBe(true);
      });

      it('sets loading to false on done loading', () => {
        expect(componentInstance.button1.loading).toBeUndefined();

        componentInstance.button1.loadingStateChange(ClrLoadingState.DEFAULT);

        expect(componentInstance.button1.loading).toBe(false);
      });

      it('has access to the button in group service if the parent declares it', () => {
        expect(componentInstance.button1.buttonInGroupService).not.toBeNull();
        expect(componentInstance.button2.buttonInGroupService).not.toBeNull();
        expect(componentInstance.button3.buttonInGroupService).not.toBeNull();
      });

      it('sets inMenu to false by default', () => {
        expect(componentInstance.button1.inMenu).toBe(false);
        expect(componentInstance.button3.inMenu).toBe(false);
      });

      it('supports a clrInMenu Input', () => {
        expect(componentInstance.button2.inMenu).toBe(true);

        componentInstance.button2InMenu = false;

        expect(componentInstance.button1.inMenu).toBe(false);
      });

      it('populates the template ref', () => {
        expect(componentInstance.button1.templateRef).not.toBeNull();
        expect(componentInstance.button2.templateRef).not.toBeNull();
        expect(componentInstance.button3.templateRef).not.toBeNull();
      });

      it('updates the button in group service when the inMenu input changes', () => {
        const buttonInGroupService: ButtonInGroupService =
          debugEl.injector.get<ButtonInGroupService>(ButtonInGroupService);
        spyOn(buttonInGroupService, 'updateButtonGroup');

        componentInstance.button1.inMenu = true;
        expect(buttonInGroupService.updateButtonGroup).toHaveBeenCalled();

        componentInstance.button1.inMenu = false;
        expect(buttonInGroupService.updateButtonGroup).toHaveBeenCalled();
      });
    });

    describe('View Test', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrButtonGroupModule, ClrLoadingModule],
          declarations: [ButtonViewTestComponent],
          providers: [ButtonInGroupService],
        });

        fixture = TestBed.createComponent(ButtonViewTestComponent);
        fixture.detectChanges();
        debugEl = fixture.debugElement;
        componentInstance = debugEl.componentInstance;
        buttons = debugEl.nativeElement.querySelectorAll('button');
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('projects the content correctly', () => {
        expect(buttons[0].textContent).toMatch('Test Button 1');
        expect(buttons[1].textContent).toMatch('Test Button 2');
        expect(buttons[2].textContent).toMatch('Test Button 3');
      });

      it('sets the disabled flag correctly', () => {
        expect(buttons[0].disabled).toBe(false);
        expect(buttons[1].disabled).toBe(true);
        expect(buttons[2].disabled).toBe(false);
      });

      it('sets the name correctly', () => {
        expect(buttons[0].name).toBe('');
        expect(buttons[1].name).toBe('');
        expect(buttons[2].name).toBe('button3');
      });

      it('sets the id correctly', () => {
        expect(buttons[0].id).toBeTruthy();
        expect(buttons[1].id).toBeTruthy();
        expect(buttons[2].id).toBe('button3');
      });

      it('sets the type correctly', () => {
        expect(buttons[0].type).toBe('submit'); // default
        expect(buttons[1].type).toBe('submit'); // default
        expect(buttons[2].type).toBe('button');
      });

      it('shows the spinner when clrLoading is set to true', () => {
        expect(buttons[0].querySelector('span.spinner')).toBeTruthy();
        expect(buttons[1].querySelector('span.spinner')).toBe(null);
        expect(buttons[2].querySelector('span.spinner')).toBe(null);

        componentInstance.load = false;
        fixture.detectChanges();

        const newButtons: HTMLButtonElement[] = debugEl.nativeElement.querySelectorAll('button');
        expect(newButtons[0].querySelector('span.spinner')).toBe(null);
      });
    });

    describe('with routerLinkActive', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrButtonGroupModule, RouterTestingModule.withRoutes(routes)],
          declarations: [TestButtonWithRouterLinkActiveComponent],
        });

        fixture = TestBed.createComponent(TestButtonWithRouterLinkActiveComponent);
        fixture.detectChanges();
        debugEl = fixture.debugElement;
        componentInstance = debugEl.componentInstance;
        buttons = debugEl.nativeElement.querySelectorAll('button');
      });

      it('does not set the routerLinkActive classes when no button is active', async () => {
        expect(buttons[0].classList.contains('btn-primary')).toBeFalse();
        expect(buttons[1].classList.contains('btn-primary')).toBeFalse();
        expect(buttons[2].classList.contains('btn-primary')).toBeFalse();
      });

      it('sets the routerLinkActive classes only on the active button', async () => {
        buttons[0].click();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(buttons[0].classList.contains('btn-primary')).toBeTrue();
        expect(buttons[1].classList.contains('btn-primary')).toBeFalse();
        expect(buttons[2].classList.contains('btn-primary')).toBeFalse();
      });
    });
  });
}

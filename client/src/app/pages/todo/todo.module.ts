import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

import { TodoComponent } from './todo.component';
import { TodoRoutingModule } from './todo.routing.module';

@NgModule({
  declarations: [
    TodoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TodoRoutingModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    RippleModule
  ]
})
export class TodoModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

import { LabelComponent } from './label.component';
import { LabelRoutingModule } from './label.routing.module';

@NgModule({
  declarations: [
    LabelComponent
  ],
  imports: [
    CommonModule,
    LabelRoutingModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    RippleModule
  ]
})
export class LabelModule { }

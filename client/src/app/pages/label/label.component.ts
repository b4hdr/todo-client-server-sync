import { Component, OnInit } from '@angular/core';
import { Label } from './label.model';
import { LabelService } from './label.service';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.scss']
})
export class LabelComponent implements OnInit {
  newLabel: Label = {};
  labels: Array<Label> = [];
  isSyncing: boolean = false;

  constructor(private labelService: LabelService) { }

  ngOnInit() {
    this.getLabels();
  }

  getLabels() {
    this.labelService.get()
      .subscribe(labels => {
        console.log(labels);
        this.labels = labels;
      });
  }

  add() {
    this.labelService.add([this.newLabel])
      .subscribe((addedLabels) => {
        if (addedLabels.length > 0) {
          this.getLabels();
          this.clearNewLabel();
          console.log('Successfully added');
        }
      });
  }

  delete(label: Label) {
    this.labelService.delete(label)
      .subscribe(data => {
        console.log(data);
        this.getLabels();
      });
  }

  clearNewLabel() {
    this.newLabel = {};
  }

  sync() {
    this.isSyncing = true;

    this.labelService.sync()
      .subscribe({
        next: result => {
          this.isSyncing = false;
          console.log(result);
          this.getLabels();
        }, error: error => {
          this.isSyncing = false;
          console.log(error);
        }
      });
  }
}

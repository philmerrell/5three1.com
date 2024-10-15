import { Component, Input, OnInit } from '@angular/core';
import { IonIcon, IonItem, IonLabel, IonList, IonRouterOutlet, PopoverController } from '@ionic/angular/standalone';
import { Lift } from '../../../shared/services/cycle.service';

@Component({
  selector: 'app-options-popover',
  templateUrl: './options-popover.component.html',
  styleUrls: ['./options-popover.component.scss'],
  standalone: true,
  imports: [
    IonList,
    IonItem,
    IonIcon,
    IonLabel
  ]
})
export class OptionsPopoverComponent implements OnInit {
  @Input() routerOutlet: IonRouterOutlet;
  @Input() lift: Lift;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  edit() {
    this.popoverController.dismiss('edit');
  }

  delete() {
    this.popoverController.dismiss('delete');
  }

  duplicate() {
    this.popoverController.dismiss('duplicate');
  }

  

}

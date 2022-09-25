import {Component, OnDestroy, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import IClip from "../../models/clip";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ClipService} from "../../services/clip.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();
  clipId = new FormControl('');
  title = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ]);
  editForm = new FormGroup({
    title: this.title,
    id: this.clipId
  })
  showAlert = false;
  inSubmission = false;
  alertMsg = 'Please wait! Updating clip';
  alertColor = 'blue';

  constructor(private modal: ModalService,
    private clipService: ClipService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.activeClip){
      return
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.clipId.setValue(this.activeClip.docID as string);
    this.title.setValue(this.activeClip.title);
  }
  ngOnInit(): void {
    this.modal.register('editClip');
  }
  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  async submit() {
    if(!this.activeClip){
      return
    }
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMsg = 'Please wait! Updating clip';
    this.alertColor = 'blue';
    try {
      await this.clipService.updateClip(this.clipId.value as string, this.title.value as string)
    }catch (e){
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try again later';
      return;
    }
    if (this.title.value != null) {
      this.activeClip.title = this.title.value;
    }
    this.update.emit(this.activeClip)
    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
  }
}

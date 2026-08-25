import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Obreiro, CreateObreiroDto } from '../../core/models/obreiro.model';

@Component({
  selector: 'app-obreiro-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './obreiro-modal.component.html'
})
export class ObreiroModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() obreiro: Obreiro | null = null;
  @Input() loading = false;
  @Output() save = new EventEmitter<CreateObreiroDto>();
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      nome: [this.obreiro?.nome || '', [Validators.required]],
      apelido: [this.obreiro?.apelido || ''],
      telefone: [this.obreiro?.telefone || ''],
      email: [this.obreiro?.email || '', [Validators.email]],
      data_nascimento: [this.obreiro?.data_nascimento || ''],
      foto: [this.obreiro?.foto || ''],
      diacono: [this.obreiro?.diacono ?? false],
      pulpito: [this.obreiro?.pulpito ?? false],
      lider: [this.obreiro?.lider ?? false],
      ativo: [this.obreiro?.ativo ?? true]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }

  onCancel() {
    this.close.emit();
  }
}

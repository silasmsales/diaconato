import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Mes, CreateMesDto, MESES_NOMES } from '../../core/models/mes.model';

@Component({
  selector: 'app-mes-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mes-modal.component.html'
})
export class MesModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() mes: Mes | null = null;
  @Input() loading = false;
  @Output() save = new EventEmitter<CreateMesDto>();
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  form!: FormGroup;

  mesesList = Object.entries(MESES_NOMES).map(([val, name]) => ({
    value: Number(val),
    name
  }));

  ngOnInit() {
    this.initForm();
  }

  ngOnChanges() {
    this.initForm();
  }

  private initForm() {
    const now = new Date();
    this.form = this.fb.group({
      ano_referencia: [this.mes?.ano_referencia || now.getFullYear(), [Validators.required, Validators.min(1000)]],
      mes_referencia: [this.mes?.mes_referencia || (now.getMonth() + 1), [Validators.required, Validators.min(1), Validators.max(12)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.value;
      this.save.emit({
        ano_referencia: Number(raw.ano_referencia),
        mes_referencia: Number(raw.mes_referencia)
      });
    }
  }

  onCancel() {
    this.close.emit();
  }
}
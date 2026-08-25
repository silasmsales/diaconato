import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Evento } from '../../core/models/evento.model';
import { Obreiro } from '../../core/models/obreiro.model';
import { Mes, formatMesReferencia } from '../../core/models/mes.model';
import { Bloqueio } from '../../core/models/bloqueio.model';
import { CreateEscalaDto } from '../../core/models/escala.model';

@Component({
  selector: 'app-escala-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './escala-modal.component.html'
})
export class EscalaModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() meses: Mes[] = [];
  @Input() eventos: Evento[] = [];
  @Input() obreiros: Obreiro[] = [];
  @Input() bloqueios: Bloqueio[] = [];
  @Input() defaultMesId: number | null = null;
  @Input() defaultEventoId: number | null = null;
  @Input() loading = false;

  @Output() save = new EventEmitter<CreateEscalaDto>();
  @Output() close = new EventEmitter<void>();

  formatMesReferencia = formatMesReferencia;

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
      id_mes: [this.defaultMesId || (this.meses[0]?.id_mes ?? null), [Validators.required]],
      id_evento: [this.defaultEventoId || (this.eventos[0]?.id_evento ?? null), [Validators.required]],
      id_obreiro: [null, [Validators.required]]
    });
  }

  availableObreiros() {
    return this.obreiros.filter(o => o.ativo);
  }

  conflictWarning(): string | null {
    const obreiroId = Number(this.form?.get('id_obreiro')?.value);
    const eventoId = Number(this.form?.get('id_evento')?.value);
    if (!obreiroId || !eventoId) return null;

    const evento = this.eventos.find(e => e.id_evento === eventoId);
    if (!evento) return null;

    const block = this.bloqueios.find(b => b.id_obreiro === obreiroId && b.data === evento.data && (b.turno === evento.turno || b.turno === 4));
    if (block) {
      return `Este obreiro possui bloqueio cadastrado para a data ${evento.data} no turno correspondente${block.motivo ? ' (' + block.motivo + ')' : ''}.`;
    }

    return null;
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.value;
      this.save.emit({
        id_mes: Number(raw.id_mes),
        id_evento: Number(raw.id_evento),
        id_obreiro: Number(raw.id_obreiro)
      });
    }
  }

  onCancel() {
    this.close.emit();
  }
}
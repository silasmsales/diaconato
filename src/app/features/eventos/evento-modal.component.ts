import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Evento, CreateEventoDto } from '../../core/models/evento.model';
import { Mes, formatMesReferencia } from '../../core/models/mes.model';
import { TipoEventoService } from '../../core/services/tipo-evento.service';
import { MesService } from '../../core/services/mes.service';
import { TurnoEnum, TURNO_LABELS } from '../../core/models/turno.enum';

@Component({
  selector: 'app-evento-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evento-modal.component.html'
})
export class EventoModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() evento: Evento | null = null;
  @Input() defaultMesId: number | null = null;
  @Input() loading = false;
  @Output() save = new EventEmitter<CreateEventoDto>();
  @Output() close = new EventEmitter<void>();

  tipoEventoService = inject(TipoEventoService);
  mesService = inject(MesService);

  formatMesReferencia = formatMesReferencia;
  TurnoEnum = TurnoEnum;
  TURNO_LABELS = TURNO_LABELS;

  private fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit() {
    this.tipoEventoService.fetchAll();
    this.mesService.fetchAll();
    this.initForm();
  }

  ngOnChanges() {
    this.initForm();
  }

  private initForm() {
    const defaultDate = this.evento?.data || new Date().toISOString().split('T')[0];
    const initialMesId = this.evento?.id_mes || this.defaultMesId || this.findMatchingMesId(defaultDate);

    this.form = this.fb.group({
      id_mes: [initialMesId, [Validators.required]],
      descricao: [this.evento?.descricao || '', [Validators.required]],
      data: [defaultDate, [Validators.required]],
      turno: [this.evento?.turno || TurnoEnum.NOITE, [Validators.required]],
      n_primeiro_horario: [this.evento?.n_primeiro_horario ?? 2, [Validators.min(0)]],
      exclusivo_diacono_primeiro: [this.evento?.exclusivo_diacono_primeiro ?? false],
      pulpito_primeiro: [this.evento?.pulpito_primeiro ?? true],
      n_segundo_horario: [this.evento?.n_segundo_horario ?? 0, [Validators.min(0)]],
      exclusivo_diacono_segundo: [this.evento?.exclusivo_diacono_segundo ?? false],
      pulpito_segundo: [this.evento?.pulpito_segundo ?? true],
      n_terceiro_horario: [this.evento?.n_terceiro_horario ?? 0, [Validators.min(0)]],
      exclusivo_diacono_terceiro: [this.evento?.exclusivo_diacono_terceiro ?? false],
      pulpito_terceiro: [this.evento?.pulpito_terceiro ?? true]
    });
  }

  findMatchingMesId(dateStr: string): number | null {
    if (!dateStr) return this.mesService.meses()[0]?.id_mes ?? null;
    const [year, month] = dateStr.split('-').map(Number);
    const found = this.mesService.meses().find(m => m.ano_referencia === year && m.mes_referencia === month);
    return found?.id_mes || this.mesService.meses()[0]?.id_mes || null;
  }

  onDateChange(event: any) {
    const dateStr = event.target.value;
    if (dateStr && !this.form.get('id_mes')?.value) {
      const matchId = this.findMatchingMesId(dateStr);
      if (matchId) {
        this.form.patchValue({ id_mes: matchId });
      }
    }
  }

  applyTemplate(event: any) {
    const templateId = Number(event.target.value);
    if (!templateId) return;

    const template = this.tipoEventoService.tiposEvento().find(t => t.id_tipo_evento === templateId);
    if (!template) return;

    this.form.patchValue({
      descricao: template.descricao_padrao,
      turno: template.turno_padrao,
      n_primeiro_horario: template.n_primeiro_horario_padrao,
      exclusivo_diacono_primeiro: template.exclusivo_diacono_primeiro_padrao,
      pulpito_primeiro: template.pulpito_primeiro ?? true,
      n_segundo_horario: template.n_segundo_horario_padrao,
      exclusivo_diacono_segundo: template.exclusivo_diacono_segundo_padrao,
      pulpito_segundo: template.pulpito_segundo ?? true,
      n_terceiro_horario: template.n_terceiro_horario_padrao,
      exclusivo_diacono_terceiro: template.exclusivo_diacono_terceiro_padrao,
      pulpito_terceiro: template.pulpito_terceiro ?? true
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.value;
      this.save.emit({
        ...raw,
        id_mes: Number(raw.id_mes),
        turno: Number(raw.turno),
        n_primeiro_horario: Number(raw.n_primeiro_horario || 0),
        n_segundo_horario: Number(raw.n_segundo_horario || 0),
        n_terceiro_horario: Number(raw.n_terceiro_horario || 0)
      });
    }
  }

  onCancel() {
    this.close.emit();
  }
}
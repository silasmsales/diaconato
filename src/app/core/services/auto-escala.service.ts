import { Injectable } from '@angular/core';
import { Evento } from '../models/evento.model';
import { Obreiro } from '../models/obreiro.model';
import { Bloqueio } from '../models/bloqueio.model';
import { CreateEscalaDto, Escala } from '../models/escala.model';

export interface VagaDemanda {
  horario: number; // 1, 2 ou 3
  precisaDiacono: boolean;
  precisaPulpito: boolean;
}

export interface GeneratedEventSchedule {
  evento: Evento;
  escalados: {
    obreiro: Obreiro;
    vaga: VagaDemanda;
  }[];
  faltasVagas: VagaDemanda[];
}

export interface AutoEscalaResult {
  id_mes: number;
  dtos: CreateEscalaDto[];
  eventSchedules: GeneratedEventSchedule[];
  totalVagasNecessarias: number;
  totalVagasPreenchidas: number;
  taxaPreenchimento: number; // 0 a 100%
  obreiroStats: {
    obreiro: Obreiro;
    totalEscalas: number;
    datas: string[];
  }[];
  avisos: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AutoEscalaService {

  generateMonthlySchedule(
    idMesInput: number,
    eventos: Evento[],
    obreiros: Obreiro[],
    bloqueios: Bloqueio[],
    existingEscalas: Escala[] = [],
    replaceExisting: boolean = true
  ): AutoEscalaResult {
    const idMes = Number(idMesInput);
    const avisos: string[] = [];

    // 1. Filtrar obreiros elegíveis (Ativos e não líderes) e embaralhar aleatoriamente
    const elegiveis = (obreiros || []).filter(o => o.ativo && !o.lider);
    for (let i = elegiveis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [elegiveis[i], elegiveis[j]] = [elegiveis[j], elegiveis[i]];
    }

    // Estatísticas iniciais de obreiros (mesmo se não houver eventos)
    const defaultObreiroStats = elegiveis.map(ob => ({
      obreiro: ob,
      totalEscalas: 0,
      datas: []
    }));

    if (elegiveis.length === 0) {
      return {
        id_mes: idMes,
        dtos: [],
        eventSchedules: [],
        totalVagasNecessarias: 0,
        totalVagasPreenchidas: 0,
        taxaPreenchimento: 0,
        obreiroStats: [],
        avisos: ['Nenhum obreiro ativo e elegível (não líder) disponível no sistema para escalação. Cadastre obreiros ativos primeiro.']
      };
    }

    // 2. Filtrar e ordenar eventos do mês
    const eventosDoMes = (eventos || [])
      .filter(e => Number(e.id_mes) === idMes)
      .sort((a, b) => {
        const cmp = (a.data || '').localeCompare(b.data || '');
        if (cmp !== 0) return cmp;
        return (Number(a.turno) || 1) - (Number(b.turno) || 1);
      });

    if (eventosDoMes.length === 0) {
      return {
        id_mes: idMes,
        dtos: [],
        eventSchedules: [],
        totalVagasNecessarias: 0,
        totalVagasPreenchidas: 0,
        taxaPreenchimento: 0,
        obreiroStats: defaultObreiroStats,
        avisos: ['Nenhum culto/evento cadastrado para este mês de referência. Use a função "Gerar Cultos do Mês" para criar os cultos automaticamente.']
      };
    }

    // Checar se há diáconos disponíveis
    const totalDiaconos = elegiveis.filter(o => o.diacono).length;
    if (totalDiaconos === 0) {
      avisos.push('Aviso: Não há nenhum diácono cadastrado ou ativo. Vagas que exigem consagração ao diaconato ficarão abertas.');
    }

    // Checar se há obreiros de púlpito disponíveis
    const totalPulpito = elegiveis.filter(o => o.pulpito).length;
    if (totalPulpito === 0) {
      avisos.push('Aviso: Não há nenhum obreiro habilitado a púlpito cadastrado ou ativo. Vagas de púlpito ficarão abertas.');
    }

    // 3. Mapa de contadores de escalas por obreiro para equilíbrio e balanceamento
    const escalaCountMap = new Map<number, number>();
    const datasEscaladasMap = new Map<number, Set<string>>(); // id_obreiro -> Set of "YYYY-MM-DD"
    const diaTurnoEscaladoMap = new Map<string, Set<number>>(); // "YYYY-MM-DD_turno" -> Set of id_obreiro

    elegiveis.forEach(o => {
      const id = Number(o.id_obreiro);
      escalaCountMap.set(id, 0);
      datasEscaladasMap.set(id, new Set<string>());
    });

    // Se NÃO for substituir existentes, carregar as escalas já existentes
    if (!replaceExisting && existingEscalas) {
      existingEscalas
        .filter(esc => Number(esc.id_mes) === idMes)
        .forEach(esc => {
          const obId = Number(esc.id_obreiro);
          const ev = eventos.find(e => Number(e.id_evento) === Number(esc.id_evento));
          if (ev) {
            escalaCountMap.set(obId, (escalaCountMap.get(obId) || 0) + 1);
            if (!datasEscaladasMap.has(obId)) datasEscaladasMap.set(obId, new Set());
            datasEscaladasMap.get(obId)!.add(ev.data);
            const diaTurnoKey = `${ev.data}_${ev.turno}`;
            if (!diaTurnoEscaladoMap.has(diaTurnoKey)) diaTurnoEscaladoMap.set(diaTurnoKey, new Set());
            diaTurnoEscaladoMap.get(diaTurnoKey)!.add(obId);
          }
        });
    }

    // 4. Mapa de Bloqueios para busca O(1)
    const bloqueiosSet = new Set<string>();
    (bloqueios || []).forEach(b => {
      const obId = Number(b.id_obreiro);
      bloqueiosSet.add(`${obId}_${b.data}_${b.turno}`);
      if (Number(b.turno) === 4) {
        bloqueiosSet.add(`${obId}_${b.data}_1`);
        bloqueiosSet.add(`${obId}_${b.data}_2`);
        bloqueiosSet.add(`${obId}_${b.data}_3`);
      }
    });

    let totalVagasNecessarias = 0;
    let totalVagasPreenchidas = 0;
    const generatedDtos: CreateEscalaDto[] = [];
    const eventSchedules: GeneratedEventSchedule[] = [];

    // 5. Processamento evento por evento
    for (const evento of eventosDoMes) {
      const diaTurnoKey = `${evento.data}_${evento.turno}`;
      if (!diaTurnoEscaladoMap.has(diaTurnoKey)) {
        diaTurnoEscaladoMap.set(diaTurnoKey, new Set<number>());
      }
      const obreirosJaEscaladosNesteDiaETurno = diaTurnoEscaladoMap.get(diaTurnoKey)!;
      const obreirosEscaladosNesteEvento = new Set<number>();

      // Construir lista de vagas exigidas pelo evento
      const vagas: VagaDemanda[] = [];

      // 1º Horário
      const n1 = Number(evento.n_primeiro_horario) || 0;
      for (let i = 0; i < n1; i++) {
        vagas.push({
          horario: 1,
          precisaDiacono: !!evento.exclusivo_diacono_primeiro,
          precisaPulpito: i === 0 && !!evento.pulpito_primeiro
        });
      }

      // 2º Horário
      const n2 = Number(evento.n_segundo_horario) || 0;
      for (let i = 0; i < n2; i++) {
        vagas.push({
          horario: 2,
          precisaDiacono: !!evento.exclusivo_diacono_segundo,
          precisaPulpito: i === 0 && !!evento.pulpito_segundo
        });
      }

      // 3º Horário
      const n3 = Number(evento.n_terceiro_horario) || 0;
      for (let i = 0; i < n3; i++) {
        vagas.push({
          horario: 3,
          precisaDiacono: !!evento.exclusivo_diacono_terceiro,
          precisaPulpito: i === 0 && !!evento.pulpito_terceiro
        });
      }

      totalVagasNecessarias += vagas.length;

      // Ordenar vagas por prioridade de maior restrição
      vagas.sort((a, b) => {
        const weightA = (a.precisaDiacono ? 2 : 0) + (a.precisaPulpito ? 1 : 0);
        const weightB = (b.precisaDiacono ? 2 : 0) + (b.precisaPulpito ? 1 : 0);
        return weightB - weightA;
      });

      const eventSchedule: GeneratedEventSchedule = {
        evento,
        escalados: [],
        faltasVagas: []
      };

      // Preencher cada vaga
      for (const vaga of vagas) {
        const candidatos = elegiveis.filter(ob => {
          const obId = Number(ob.id_obreiro);

          // 1. Não pode estar escalado no mesmo evento
          if (obreirosEscaladosNesteEvento.has(obId)) return false;

          // 2. Não pode estar escalado no mesmo dia e turno
          if (obreirosJaEscaladosNesteDiaETurno.has(obId)) return false;

          // 3. Checar bloqueio na data e turno
          const isBlocked = bloqueiosSet.has(`${obId}_${evento.data}_${evento.turno}`);
          if (isBlocked) return false;

          // 4. Checar restrições da vaga
          if (vaga.precisaDiacono && !ob.diacono) return false;
          if (vaga.precisaPulpito && !ob.pulpito) return false;

          return true;
        });

        if (candidatos.length > 0) {
          // Embaralhar aleatoriamente os candidatos antes da ordenação (Fisher-Yates)
          // Isso garante que obreiros com mesmo número de escalas tenham chances iguais (desempate aleatório)
          for (let i = candidatos.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidatos[i], candidatos[j]] = [candidatos[j], candidatos[i]];
          }

          // Ordenar por menor número de escalas acumuladas (fairness) e preservação de especialistas
          candidatos.sort((a, b) => {
            const countA = escalaCountMap.get(Number(a.id_obreiro)) || 0;
            const countB = escalaCountMap.get(Number(b.id_obreiro)) || 0;
            if (countA !== countB) return countA - countB;

            // Se a vaga for geral (não precisa de diácono nem púlpito), economizar os especialistas para vagas restritas
            if (!vaga.precisaDiacono && !vaga.precisaPulpito) {
              const specializedA = (a.diacono ? 1 : 0) + (a.pulpito ? 1 : 0);
              const specializedB = (b.diacono ? 1 : 0) + (b.pulpito ? 1 : 0);
              if (specializedA !== specializedB) return specializedA - specializedB;
            }

            // Desempate: mantém a ordem aleatória do embaralhamento prévio
            return 0;
          });

          const escolhido = candidatos[0];
          const obId = Number(escolhido.id_obreiro);

          // Registrar alocação
          obreirosEscaladosNesteEvento.add(obId);
          obreirosJaEscaladosNesteDiaETurno.add(obId);
          if (!datasEscaladasMap.has(obId)) datasEscaladasMap.set(obId, new Set());
          datasEscaladasMap.get(obId)!.add(evento.data);
          escalaCountMap.set(obId, (escalaCountMap.get(obId) || 0) + 1);

          totalVagasPreenchidas++;
          eventSchedule.escalados.push({
            obreiro: escolhido,
            vaga
          });

          generatedDtos.push({
            id_evento: Number(evento.id_evento),
            id_obreiro: obId,
            id_mes: idMes
          });
        } else {
          eventSchedule.faltasVagas.push(vaga);
          let motivoFalta = 'Geral';
          if (vaga.precisaDiacono && vaga.precisaPulpito) motivoFalta = 'Diácono com Púlpito';
          else if (vaga.precisaDiacono) motivoFalta = 'Diácono';
          else if (vaga.precisaPulpito) motivoFalta = 'Obreiro de Púlpito';

          avisos.push(
            `${evento.data} (${evento.descricao || 'Culto'} - Horário ${vaga.horario}): Não foi possível preencher vaga de ${motivoFalta} por falta de obreiros elegíveis disponíveis.`
          );
        }
      }

      eventSchedules.push(eventSchedule);
    }

    // 6. Montar estatísticas de distribuição por obreiro
    const obreiroStats = elegiveis.map(ob => {
      const obId = Number(ob.id_obreiro);
      const total = escalaCountMap.get(obId) || 0;
      const datas = Array.from(datasEscaladasMap.get(obId) || []);
      return {
        obreiro: ob,
        totalEscalas: total,
        datas: datas.sort()
      };
    }).sort((a, b) => b.totalEscalas - a.totalEscalas);

    const taxaPreenchimento = totalVagasNecessarias > 0 
      ? Math.round((totalVagasPreenchidas / totalVagasNecessarias) * 100)
      : 100;

    return {
      id_mes: idMes,
      dtos: generatedDtos,
      eventSchedules,
      totalVagasNecessarias,
      totalVagasPreenchidas,
      taxaPreenchimento,
      obreiroStats,
      avisos
    };
  }
}
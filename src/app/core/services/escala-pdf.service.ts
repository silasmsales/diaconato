import { Injectable } from '@angular/core';
import { Mes, formatMesReferencia } from '../models/mes.model';
import { Evento } from '../models/evento.model';
import { Escala } from '../models/escala.model';
import { Obreiro } from '../models/obreiro.model';
import { TURNO_LABELS } from '../models/turno.enum';
import { DIAS_SEMANA_LABELS } from '../models/tipo-evento.model';

@Injectable({
  providedIn: 'root'
})
export class EscalaPdfService {

  private getDiaSemanaFromData(dataStr: string): string {
    if (!dataStr) return '';
    const parts = dataStr.split('-');
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const dayOfWeek = date.getDay() + 1; // 1: Domingo, 7: Sábado
    return DIAS_SEMANA_LABELS[dayOfWeek] || '';
  }

  private formatDateBR(dataStr: string): string {
    if (!dataStr) return '';
    const parts = dataStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dataStr;
  }

  private agruparEventosPorSemana(eventos: Evento[]): { titulo: string; eventos: Evento[] }[] {
    if (!eventos || eventos.length === 0) return [];
    
    // Agrupar por semanas (iniciando no Domingo)
    const map = new Map<string, { startFmt: string; endFmt: string; startKey: string; eventos: Evento[] }>();

    for (const ev of eventos) {
      if (!ev.data) continue;
      const parts = ev.data.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      
      const dayOfWeek = d.getDay(); // 0: Dom ... 6: Sab
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - dayOfWeek);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startKey = startOfWeek.toISOString().split('T')[0];
      const startFmt = `${String(startOfWeek.getDate()).padStart(2, '0')}/${String(startOfWeek.getMonth() + 1).padStart(2, '0')}`;
      const endFmt = `${String(endOfWeek.getDate()).padStart(2, '0')}/${String(endOfWeek.getMonth() + 1).padStart(2, '0')}`;

      if (!map.has(startKey)) {
        map.set(startKey, {
          startFmt,
          endFmt,
          startKey,
          eventos: []
        });
      }
      map.get(startKey)!.eventos.push(ev);
    }

    const semanas = Array.from(map.values()).sort((a, b) => a.startKey.localeCompare(b.startKey));
    
    return semanas.map((s, idx) => ({
      titulo: `SEMANA ${idx + 1} (${s.startFmt} a ${s.endFmt})`,
      eventos: s.eventos.sort((a, b) => {
        const d = (a.data || '').localeCompare(b.data || '');
        if (d !== 0) return d;
        return (a.turno || 0) - (b.turno || 0);
      })
    }));
  }

  private openPrintWindow(title: string, htmlContent: string) {
    const printWindow = window.open('', '_blank', 'width=1000,height=800');
    if (!printWindow) {
      alert('Por favor, permita pop-ups para gerar o PDF da escala.');
      return;
    }

    const logoUrl = `${document.baseURI}logo_adtag.jpg`;

    const fullDoc = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #000000;
            background: #ffffff;
            font-size: 11.5px;
            line-height: 1.35;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .header-container {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 14px;
            border-bottom: 2.5px solid #000000;
            padding-bottom: 10px;
            margin-bottom: 14px;
          }

          .header-logo {
            width: 58px;
            height: 58px;
            object-fit: cover;
            border-radius: 8px;
            border: 1.5px solid #000000;
            flex-shrink: 0;
          }

          .header-content {
            text-align: left;
            flex: 1;
          }

          .header-content h1 {
            font-size: 15px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #000000;
          }

          .header-content h2 {
            font-size: 13px;
            font-weight: 800;
            color: #1e1b4b;
            margin-top: 1px;
          }

          .header-content h3 {
            font-size: 12px;
            font-weight: 700;
            color: #1e293b;
            margin-top: 1px;
          }

          .header-content .meta {
            font-size: 10.5px;
            font-weight: 600;
            color: #334155;
            margin-top: 2px;
          }

          /* Divisor de Semana */
          .semana-header {
            background: #0f172a;
            color: #ffffff;
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            padding: 5px 10px;
            border-radius: 5px;
            margin-top: 14px;
            margin-bottom: 8px;
            page-break-after: avoid;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .semana-header span.count {
            background: #ffffff;
            color: #0f172a;
            font-size: 10px;
            font-weight: 800;
            padding: 1px 6px;
            border-radius: 3px;
          }

          /* Tabela / Cards por Eventos */
          .event-card {
            border: 1.5px solid #1e293b;
            border-radius: 6px;
            margin-bottom: 8px;
            page-break-inside: avoid;
            background: #ffffff;
            overflow: hidden;
          }

          .event-header {
            background: #f1f5f9;
            border-bottom: 1.5px solid #1e293b;
            padding: 6px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .event-title {
            font-size: 12px;
            font-weight: 800;
            color: #000000;
          }

          .event-meta {
            font-size: 11px;
            font-weight: 700;
            color: #000000;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .event-badge {
            display: inline-block;
            padding: 2px 7px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            background: #000000;
            color: #ffffff;
          }

          .event-body {
            padding: 8px 10px;
          }

          .obreiros-list {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
          }

          .obreiro-tag {
            background: #ffffff;
            border: 1.5px solid #0f172a;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            color: #000000;
          }

          .empty-msg {
            font-size: 11px;
            color: #64748b;
            font-style: italic;
          }

          /* Tabela por Obreiros */
          table.report-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 6px;
          }

          table.report-table th, table.report-table td {
            border: 1.5px solid #334155;
            padding: 5.5px 8px;
            text-align: left;
            font-size: 11px;
          }

          table.report-table th {
            background: #0f172a;
            font-weight: 900;
            color: #ffffff;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.5px;
          }

          table.report-table tr:nth-child(even) {
            background: #f8fafc;
          }

          .obreiro-name {
            font-weight: 800;
            color: #000000;
          }

          .scale-pill {
            display: inline-block;
            background: #ffffff;
            border: 1.5px solid #0f172a;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 700;
            margin: 1.5px;
            color: #000000;
            white-space: nowrap;
          }

          .total-badge {
            display: inline-block;
            font-weight: 900;
            font-size: 11px;
            text-align: center;
            width: 22px;
            padding: 1px 0;
            background: #0f172a;
            color: #ffffff;
            border-radius: 3px;
          }

          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(fullDoc);
    printWindow.document.close();
  }

  gerarPdfPorEventos(mes: Mes, eventos: Evento[], escalas: Escala[]) {
    const mesLabel = formatMesReferencia(mes);
    const logoUrl = `${document.baseURI}logo_adtag.jpg`;

    const eventosDoMes = (eventos || [])
      .filter(e => Number(e.id_mes) === Number(mes.id_mes))
      .sort((a, b) => {
        const cmp = (a.data || '').localeCompare(b.data || '');
        if (cmp !== 0) return cmp;
        return (Number(a.turno) || 1) - (Number(b.turno) || 1);
      });

    const gruposSemanas = this.agruparEventosPorSemana(eventosDoMes);
    let semanasHtml = '';

    for (const semana of gruposSemanas) {
      let eventCardsHtml = '';

      for (const ev of semana.eventos) {
        const escaladosDoEvento = (escalas || [])
          .filter(esc => Number(esc.id_evento) === Number(ev.id_evento));

        const nomesObreiros = escaladosDoEvento
          .map(esc => esc.obreiros?.nome)
          .filter(nome => !!nome) as string[];

        let obreirosHtml = '';
        if (nomesObreiros.length > 0) {
          obreirosHtml = `
            <div class="obreiros-list">
              ${nomesObreiros.map(nome => `<div class="obreiro-tag">${nome}</div>`).join('')}
            </div>
          `;
        } else {
          obreirosHtml = `<span class="empty-msg">Nenhum obreiro escalado</span>`;
        }

        const diaSemana = this.getDiaSemanaFromData(ev.data);
        const dataFormatada = this.formatDateBR(ev.data);
        const turnoLabel = TURNO_LABELS[ev.turno] || 'Geral';

        eventCardsHtml += `
          <div class="event-card">
            <div class="event-header">
              <div>
                <span class="event-title">${dataFormatada} (${diaSemana}) — ${ev.descricao || 'Culto'}</span>
              </div>
              <div class="event-meta">
                <span class="event-badge">${turnoLabel}</span>
                <span>${nomesObreiros.length} escalado(s)</span>
              </div>
            </div>
            <div class="event-body">
              ${obreirosHtml}
            </div>
          </div>
        `;
      }

      semanasHtml += `
        <div class="semana-section">
          <div class="semana-header">
            <span>${semana.titulo}</span>
            <span class="count">${semana.eventos.length} culto(s)</span>
          </div>
          ${eventCardsHtml}
        </div>
      `;
    }

    const html = `
      <div class="header-container">
        <img src="${logoUrl}" alt="ADTAG Logo" class="header-logo" />
        <div class="header-content">
          <h1>ADTAG — Assembleia de Deus de Taguatinga</h1>
          <h2>Diaconato</h2>
          <h3>Escala de Cultos & Eventos — ${mesLabel}</h3>
          <div class="meta">Total de cultos no mês: ${eventosDoMes.length}</div>
        </div>
      </div>
      <div>
        ${semanasHtml || '<p class="empty-msg" style="text-align:center; padding: 20px;">Nenhum evento cadastrado para este mês.</p>'}
      </div>
    `;

    this.openPrintWindow(`ADTAG_Escala_${mesLabel.replace('/', '_')}_Por_Cultos`, html);
  }

  gerarPdfPorObreiros(mes: Mes, eventos: Evento[], escalas: Escala[], obreiros: Obreiro[]) {
    const mesLabel = formatMesReferencia(mes);
    const idMes = Number(mes.id_mes);
    const logoUrl = `${document.baseURI}logo_adtag.jpg`;

    // Obreiros ativos ou que estejam escalados
    const escalasDoMes = (escalas || []).filter(esc => Number(esc.id_mes) === idMes);
    
    // Obter lista única de todos os obreiros ordenados pelo nome
    const obreirosMap = new Map<number, { obreiro: Obreiro; escalas: { data: string; turno: number; evento: string }[] }>();

    (obreiros || [])
      .filter(o => o.ativo)
      .forEach(o => {
        obreirosMap.set(Number(o.id_obreiro), {
          obreiro: o,
          escalas: []
        });
      });

    // Associar escalas aos obreiros
    for (const esc of escalasDoMes) {
      const obId = Number(esc.id_obreiro);
      const ev = eventos.find(e => Number(e.id_evento) === Number(esc.id_evento));
      if (ev) {
        if (!obreirosMap.has(obId)) {
          if (esc.obreiros) {
            obreirosMap.set(obId, { obreiro: esc.obreiros, escalas: [] });
          }
        }
        if (obreirosMap.has(obId)) {
          obreirosMap.get(obId)!.escalas.push({
            data: ev.data,
            turno: ev.turno,
            evento: ev.descricao || 'Culto'
          });
        }
      }
    }

    const rows = Array.from(obreirosMap.values())
      .sort((a, b) => (a.obreiro.nome || '').localeCompare(b.obreiro.nome || ''))
      .map((item, index) => {
        // Ordenar as datas do obreiro
        item.escalas.sort((a, b) => a.data.localeCompare(b.data));

        const escalasHtml = item.escalas.length > 0
          ? item.escalas.map(e => {
              const diaSemana = this.getDiaSemanaFromData(e.data);
              const dataFmt = e.data.split('-').slice(1).reverse().join('/'); // dd/MM
              const turnoAbrev = e.turno === 1 ? 'M' : e.turno === 2 ? 'T' : 'N';
              return `<span class="scale-pill"><strong>${dataFmt}</strong> (${diaSemana.slice(0, 3)} - ${turnoAbrev}) ${e.evento}</span>`;
            }).join(' ')
          : '<span class="empty-msg">Nenhuma escala</span>';

        return `
          <tr>
            <td style="text-align: center; width: 30px; font-weight: 800; color: #000000;">${index + 1}</td>
            <td class="obreiro-name" style="width: 200px;">${item.obreiro.nome}</td>
            <td style="width: 120px; font-weight: 600; color: #000000;">${item.obreiro.telefone || '-'}</td>
            <td>${escalasHtml}</td>
          </tr>
        `;
      }).join('');

    const html = `
      <div class="header-container">
        <img src="${logoUrl}" alt="ADTAG Logo" class="header-logo" />
        <div class="header-content">
          <h1>ADTAG — Assembleia de Deus de Taguatinga</h1>
          <h2>Diaconato</h2>
          <h3>Escala de Obreiros — ${mesLabel}</h3>
          <div class="meta">Mês de Referência: ${mesLabel}</div>
        </div>
      </div>
      <table class="report-table">
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th style="width: 200px;">Nome do Obreiro</th>
            <th style="width: 120px;">Telefone</th>
            <th>Dias e Cultos Escalados</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;

    this.openPrintWindow(`ADTAG_Escala_${mesLabel.replace('/', '_')}_Por_Obreiros`, html);
  }
}

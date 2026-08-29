import{$n as yI,B as LD,C as FI,E as Gs,Et as Ug,Fn as sI,Gn as w_,L as Kf,M as J,O as H,Ot as V,Q as Of,St as Tg,U as MD,Y as OC,Zt as bg,at as Pf,en as bt$1,er as y_,ft as S,h as Dm,ht as Sl,jt as Vh,kn as po,kt as VD,l as Bg,lt as RD,n as $g,nr as zD,o as AI,q as Nl,qt as _g,rr as zf,rt as PI,sn as fD,tt as PC,ut as Rg,wt as UI,x as FD,xt as Tb}from"./chunk-DcId_B8o.js";import{a as tn,n as K,r as pa,t as m}from"./main-POA642I6.js";import{t as f}from"./chunk-yZA8dFnA.js";import{t as f$1}from"./chunk-DzMHVgfb.js";import{t as q}from"./chunk-CHOhVwdM.js";import{t as h}from"./chunk-YtlrzVV5.js";import{i as p,n as h$1,r as l}from"./chunk-DIO8w6AN.js";import{t as o}from"./chunk-uz4g6ehC.js";import{t as w}from"./chunk-Diy2ERPT.js";import{r as t,t as b}from"./chunk-DYullDaB.js";import{_ as ln,d as Vt$1,f as Xe$1,n as Gn,r as Hn,s as Pn,t as Bn}from"./chunk-BcNSYFu0.js";var se=class a{getDiaSemanaFromData(t){if(!t)return``;let e=t.split(`-`);return o[new Date(Number(e[0]),Number(e[1])-1,Number(e[2])).getDay()+1]||``}formatDateBR(t){if(!t)return``;let e=t.split(`-`);return e.length===3?`${e[2]}/${e[1]}/${e[0]}`:t}agruparEventosPorSemana(t){if(!t||t.length===0)return[];let e=new Map;for(let r of t){if(!r.data)continue;let d=r.data.split(`-`),b=new Date(Number(d[0]),Number(d[1])-1,Number(d[2])),f=b.getDay(),h=new Date(b);h.setDate(b.getDate()-f);let E=new Date(h);E.setDate(h.getDate()+6);let m=h.toISOString().split(`T`)[0],S=`${String(h.getDate()).padStart(2,`0`)}/${String(h.getMonth()+1).padStart(2,`0`)}`,p=`${String(E.getDate()).padStart(2,`0`)}/${String(E.getMonth()+1).padStart(2,`0`)}`;e.has(m)||e.set(m,{startFmt:S,endFmt:p,startKey:m,eventos:[]}),e.get(m).eventos.push(r)}return Array.from(e.values()).sort((r,d)=>r.startKey.localeCompare(d.startKey)).map((r,d)=>({titulo:`SEMANA ${d+1} (${r.startFmt} a ${r.endFmt})`,eventos:r.eventos.sort((b,f)=>{let h=(b.data||``).localeCompare(f.data||``);return h!==0?h:(b.turno||0)-(f.turno||0)})}))}openPrintWindow(t,e){let n=window.open(``,`_blank`,`width=1000,height=800`);if(!n){alert(`Por favor, permita pop-ups para gerar o PDF da escala.`);return}`${document.baseURI}`;let d=`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>${t}</title>
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
        ${e}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        <\/script>
      </body>
      </html>
    `;n.document.open(),n.document.write(d),n.document.close()}gerarPdfPorEventos(t$1,e,n){let r=l(t$1),d=`${document.baseURI}logo_adtag.jpg`,b=(e||[]).filter(m=>Number(m.id_mes)===Number(t$1.id_mes)).sort((m,S)=>{let p=(m.data||``).localeCompare(S.data||``);return p!==0?p:(Number(m.turno)||1)-(Number(S.turno)||1)}),f=this.agruparEventosPorSemana(b),h=``;for(let m of f){let S=``;for(let p of m.eventos){let I=(n||[]).filter(j=>Number(j.id_evento)===Number(p.id_evento)).map(j=>j.obreiros?.nome).filter(j=>!!j),O=``;I.length>0?O=`
            <div class="obreiros-list">
              ${I.map(j=>`<div class="obreiro-tag">${j}</div>`).join(``)}
            </div>
          `:O=`<span class="empty-msg">Nenhum obreiro escalado</span>`;let Q=this.getDiaSemanaFromData(p.data),de=this.formatDateBR(p.data),ce=t[p.turno]||`Geral`;S+=`
          <div class="event-card">
            <div class="event-header">
              <div>
                <span class="event-title">${de} (${Q}) \u2014 ${p.descricao||`Culto`}</span>
              </div>
              <div class="event-meta">
                <span class="event-badge">${ce}</span>
                <span>${I.length} escalado(s)</span>
              </div>
            </div>
            <div class="event-body">
              ${O}
            </div>
          </div>
        `}h+=`
        <div class="semana-section">
          <div class="semana-header">
            <span>${m.titulo}</span>
            <span class="count">${m.eventos.length} culto(s)</span>
          </div>
          ${S}
        </div>
      `}let E=`
      <div class="header-container">
        <img src="${d}" alt="ADTAG Logo" class="header-logo" />
        <div class="header-content">
          <h1>ADTAG \u2014 Assembleia de Deus de Taguatinga</h1>
          <h2>Diaconato</h2>
          <h3>Escala de Cultos & Eventos \u2014 ${r}</h3>
          <div class="meta">Total de cultos no m\xEAs: ${b.length}</div>
        </div>
      </div>
      <div>
        ${h||`<p class="empty-msg" style="text-align:center; padding: 20px;">Nenhum evento cadastrado para este mês.</p>`}
      </div>
    `;this.openPrintWindow(`ADTAG_Escala_${r.replace(`/`,`_`)}_Por_Cultos`,E)}gerarPdfPorObreiros(t,e,n,r){let d=l(t),b=Number(t.id_mes),f=`${document.baseURI}logo_adtag.jpg`,h=(n||[]).filter(p=>Number(p.id_mes)===b),E=new Map;(r||[]).filter(p=>p.ativo).forEach(p=>{E.set(Number(p.id_obreiro),{obreiro:p,escalas:[]})});for(let p of h){let F=Number(p.id_obreiro),I=e.find(O=>Number(O.id_evento)===Number(p.id_evento));I&&(E.has(F)||p.obreiros&&E.set(F,{obreiro:p.obreiros,escalas:[]}),E.has(F)&&E.get(F).escalas.push({data:I.data,turno:I.turno,evento:I.descricao||`Culto`}))}let S=`
      <div class="header-container">
        <img src="${f}" alt="ADTAG Logo" class="header-logo" />
        <div class="header-content">
          <h1>ADTAG \u2014 Assembleia de Deus de Taguatinga</h1>
          <h2>Diaconato</h2>
          <h3>Escala de Obreiros \u2014 ${d}</h3>
          <div class="meta">M\xEAs de Refer\xEAncia: ${d}</div>
        </div>
      </div>
      <table class="report-table">
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Nome do Obreiro</th>
            <th>Telefone</th>
            <th style="text-align: center; width: 45px;">Total</th>
            <th>Dias e Cultos Escalados</th>
          </tr>
        </thead>
        <tbody>
          ${Array.from(E.values()).sort((p,F)=>(p.obreiro.nome||``).localeCompare(F.obreiro.nome||``)).map((p,F)=>{p.escalas.sort((O,Q)=>O.data.localeCompare(Q.data));let I=p.escalas.length>0?p.escalas.map(O=>{let Q=this.getDiaSemanaFromData(O.data),de=O.data.split(`-`).slice(1).reverse().join(`/`),ce=O.turno===1?`M`:O.turno===2?`T`:`N`;return`<span class="scale-pill"><strong>${de}</strong> (${Q.slice(0,3)} - ${ce}) ${O.evento}</span>`}).join(` `):`<span class="empty-msg">Nenhuma escala</span>`;return`
          <tr>
            <td style="text-align: center; width: 30px; font-weight: 800; color: #000000;">${F+1}</td>
            <td class="obreiro-name" style="width: 190px;">${p.obreiro.nome}</td>
            <td style="width: 110px; font-weight: 600; color: #000000;">${p.obreiro.telefone||`-`}</td>
            <td style="text-align: center; width: 45px;">
              <span class="total-badge">${p.escalas.length}</span>
            </td>
            <td>${I}</td>
          </tr>
        `}).join(``)}
        </tbody>
      </table>
    `;this.openPrintWindow(`ADTAG_Escala_${d.replace(`/`,`_`)}_Por_Obreiros`,S)}static ɵfac=function(e){return new(e||a)};static ɵprov=H({token:a,factory:a.ɵfac,providedIn:`root`})};var Pe=(a,t)=>t.id_mes;var Ae=(a,t)=>t.id_evento;var je=(a,t)=>t.id_obreiro;function Be(a,t){if(a&1&&(Gs(0,`option`,12),yI(1),Sl()),a&2){let e=t.$implicit,n=zD(2);bg(`value`,e.id_mes),Tb(),$g(n.formatMesReferencia(e))}}function qe(a,t){if(a&1&&(Gs(0,`option`,12),yI(1),PI(2,`date`),Sl()),a&2){let e=t.$implicit,n=zD(2);bg(`value`,e.id_evento),Tb(),Ug(` `,FI(2,4,e.data,`dd/MM`),` • `,e.descricao||`Culto`,` (`,n.getTurnoLabel(e.turno),`) `)}}function Re(a,t){if(a&1&&(Gs(0,`div`,13)(1,`div`,25)(2,`span`,26),yI(3),Sl(),Gs(4,`span`,27),yI(5,`•`),Sl(),Gs(6,`span`,28),yI(7),PI(8,`date`),Sl(),Gs(9,`span`,27),yI(10,`•`),Sl(),Gs(11,`span`,29),yI(12),Sl()(),Gs(13,`span`,30),yI(14),Sl()()),a&2){let e=zD(2);Tb(3),$g(e.currentEvento()?.descricao||`Culto`),Tb(4),$g(FI(8,4,e.currentEvento()?.data,`dd/MM/yyyy`)),Tb(5),$g(e.getTurnoLabel(e.currentEvento()?.turno)),Tb(2),Nl(` 👥 `,e.escaladosNesteEvento().size,` já escalados `)}}function ze(a,t){a&1&&(Gs(0,`div`,19),yI(1,` Nenhum obreiro encontrado com este filtro. `),Sl())}function Ge(a,t){a&1&&(Gs(0,`span`,37),yI(1,`• Líder`),Sl())}function He(a,t){a&1&&(Gs(0,`span`,38),yI(1,`• Púlpito`),Sl())}function Ue(a,t){a&1&&(Gs(0,`span`,40),yI(1,` 👥 Já Escalado `),Sl())}function Qe(a,t){if(a&1&&(Gs(0,`span`,41)(1,`span`),yI(2,`⚠️ Bloqueado`),Sl()()),a&2){let e=zD().$implicit;bg(`title`,e.motivoBloqueio)}}function Je(a,t){a&1&&(Gs(0,`span`,42),yI(1,` ✓ Disponível `),Sl())}function We(a,t){if(a&1){let e=VD();Gs(0,`div`,31),Tg(`click`,function(){let r=Of(e).$implicit;return Pf(zD(2).selecionarObreiro(r.id_obreiro,r.isJaEscalado))}),Gs(1,`div`,32)(2,`div`,33),yI(3),Sl(),Gs(4,`div`,34)(5,`h4`,35),yI(6),Sl(),Gs(7,`div`,36)(8,`span`),yI(9),Sl(),MD(10,Ge,2,0,`span`,37),MD(11,He,2,0,`span`,38),Sl()()(),Gs(12,`div`,39),MD(13,Ue,2,0,`span`,40)(14,Qe,3,1,`span`,41)(15,Je,2,0,`span`,42),Sl()()}if(a&2){let e=t.$implicit,n=zD(2);sI(n.selectedObreiroId()===e.id_obreiro?`bg-indigo-500/15 border-indigo-500/50 shadow`:`bg-slate-950/60 border-slate-800/80 hover:border-slate-700`),Rg(`opacity-50`,e.isJaEscalado)(`cursor-not-allowed`,e.isJaEscalado)(`cursor-pointer`,!e.isJaEscalado),Tb(3),Nl(` `,n.getInitials(e.nome),` `),Tb(3),$g(e.nome),Tb(3),$g(e.diacono?`Diácono`:`Obreiro`),Tb(),RD(e.lider?10:-1),Tb(),RD(e.pulpito?11:-1),Tb(2),RD(e.isJaEscalado?13:e.isBloqueado?14:15)}}function Ke(a,t){a&1&&_g(0,`span`,24)}function Ye(a,t){if(a&1){let e=VD();Gs(0,`div`,0)(1,`div`,1),Tg(`click`,function(r){return r.stopPropagation()}),Gs(2,`div`,2)(3,`div`,3)(4,`div`,4),yI(5,` ➕ `),Sl(),Gs(6,`div`)(7,`h3`,5),yI(8,`Escalar Obreiro`),Sl(),Gs(9,`p`,6),yI(10,`Selecione quem irá servir na escala deste culto`),Sl()()(),Gs(11,`button`,7),Tg(`click`,function(){Of(e);return Pf(zD().onCancel())}),yI(12,` ✕ `),Sl()(),Gs(13,`div`,8)(14,`div`,9)(15,`div`)(16,`label`,10),yI(17,`Mês de Referência`),Sl(),Gs(18,`select`,11),Tg(`ngModelChange`,function(r){Of(e);return Pf(zD().onMesSelect(r))}),LD(19,Be,2,2,`option`,12,Pe),Sl(),y_(),Sl(),Gs(21,`div`)(22,`label`,10),yI(23,`Culto / Evento`),Sl(),Gs(24,`select`,11),Tg(`ngModelChange`,function(r){Of(e);return Pf(zD().onEventoSelect(r))}),LD(25,qe,3,7,`option`,12,Ae),Sl(),y_(),Sl()(),MD(27,Re,15,7,`div`,13),Sl(),Gs(28,`div`,14),zf(),Gs(29,`svg`,15),_g(30,`path`,16),Sl(),Kf(),Gs(31,`input`,17),Tg(`ngModelChange`,function(r){Of(e);return Pf(zD().searchQuery.set(r))}),Sl(),y_(),Sl(),Gs(32,`div`,18),MD(33,ze,2,0,`div`,19),LD(34,We,16,14,`div`,20,je),Sl(),Gs(36,`div`,21)(37,`button`,22),Tg(`click`,function(){Of(e);return Pf(zD().onCancel())}),yI(38,` Cancelar `),Sl(),Gs(39,`button`,23),Tg(`click`,function(){Of(e);return Pf(zD().onSubmit())}),MD(40,Ke,1,0,`span`,24),Gs(41,`span`),yI(42,`Adicionar à Escala`),Sl()()()()()}if(a&2){let e=zD();Tb(18),bg(`ngModel`,e.selectedMesId()),w_(),Tb(),FD(e.mesesData()),Tb(5),bg(`ngModel`,e.selectedEventoId()),w_(),Tb(),FD(e.filteredEventos()),Tb(2),RD(e.currentEvento()?27:-1),Tb(4),bg(`ngModel`,e.searchQuery()),w_(),Tb(2),RD(e.candidatosObreiros().length===0?33:-1),Tb(),FD(e.candidatosObreiros()),Tb(5),bg(`disabled`,!e.selectedObreiroId()||e.loading),Tb(),RD(e.loading?40:-1)}}var le=class a{isOpen=!1;meses=[];eventos=[];obreiros=[];bloqueios=[];escalas=[];defaultMesId=null;defaultEventoId=null;loading=!1;save=new bt$1;close=new bt$1;formatMesReferencia=l;TURNO_LABELS=t;TURNO_COLORS=b;escalasData=po([]);obreirosData=po([]);bloqueiosData=po([]);eventosData=po([]);mesesData=po([]);selectedMesId=po(null);selectedEventoId=po(null);selectedObreiroId=po(null);searchQuery=po(``);ngOnChanges(t){if(t.escalas&&this.escalasData.set(this.escalas||[]),t.obreiros&&this.obreirosData.set(this.obreiros||[]),t.bloqueios&&this.bloqueiosData.set(this.bloqueios||[]),t.eventos&&this.eventosData.set(this.eventos||[]),t.meses&&this.mesesData.set(this.meses||[]),t.isOpen&&this.isOpen){this.escalasData.set(this.escalas||[]),this.obreirosData.set(this.obreiros||[]),this.bloqueiosData.set(this.bloqueios||[]),this.eventosData.set(this.eventos||[]),this.mesesData.set(this.meses||[]);let e=this.defaultMesId||this.meses[0]?.id_mes||null;this.selectedMesId.set(e);let n=this.defaultEventoId||this.eventos.find(r=>!e||r.id_mes===e)?.id_evento||this.eventos[0]?.id_evento||null;this.selectedEventoId.set(n),this.selectedObreiroId.set(null),this.searchQuery.set(``)}else(t.defaultEventoId||t.defaultMesId)&&(this.defaultMesId&&this.selectedMesId.set(this.defaultMesId),this.defaultEventoId&&this.selectedEventoId.set(this.defaultEventoId))}filteredEventos=UI(()=>{let t=this.selectedMesId(),e=this.eventosData();return t?e.filter(n=>n.id_mes===t).sort((n,r)=>{let d=(n.data||``).localeCompare(r.data||``);return d!==0?d:(n.turno||0)-(r.turno||0)}):e});currentEvento=UI(()=>{let t=this.selectedEventoId();return t&&this.eventosData().find(e=>e.id_evento===t)||null});escaladosNesteEvento=UI(()=>{let t=this.selectedEventoId();return t?new Set(this.escalasData().filter(e=>e.id_evento===t).map(e=>e.id_obreiro).filter(e=>typeof e==`number`)):new Set});candidatosObreiros=UI(()=>{let t=this.currentEvento(),e=this.searchQuery().toLowerCase().trim(),n=t?.data,r=t?.turno,d=this.escaladosNesteEvento(),b=this.bloqueiosData();return this.obreirosData().filter(f=>typeof f.id_obreiro==`number`&&!!f.ativo).map(f=>{let h=d.has(f.id_obreiro),E=!1,m=``;if(n){let S=b.find(p=>p.id_obreiro===f.id_obreiro&&p.data===n&&(p.turno===r||p.turno===4||p.turno===0));S&&(E=!0,m=S.motivo||`Indisponibilidade informada`)}return J(V({},f),{isJaEscalado:h,isBloqueado:E,motivoBloqueio:m})}).filter(f=>e?f.nome.toLowerCase().includes(e)||f.apelido&&f.apelido.toLowerCase().includes(e):!0).sort((f,h)=>f.isJaEscalado!==h.isJaEscalado?f.isJaEscalado?1:-1:f.isBloqueado!==h.isBloqueado?f.isBloqueado?1:-1:f.nome.localeCompare(h.nome))});getInitials(t){if(!t)return`OB`;let e=t.trim().split(/\s+/);return e.length>=2?(e[0][0]+e[e.length-1][0]).toUpperCase():t.slice(0,2).toUpperCase()}getTurnoLabel(t$2){return t$2&&t[t$2]||`Culto`}onMesSelect(t){let e=Number(t);this.selectedMesId.set(e);let n=this.eventos.filter(r=>r.id_mes===e);n.length>0?this.selectedEventoId.set(n[0].id_evento||null):this.selectedEventoId.set(null),this.selectedObreiroId.set(null)}onEventoSelect(t){this.selectedEventoId.set(Number(t)),this.selectedObreiroId.set(null)}selecionarObreiro(t,e){e||this.selectedObreiroId.set(t)}onSubmit(){let t=this.selectedMesId(),e=this.selectedEventoId(),n=this.selectedObreiroId();t&&e&&n&&this.save.emit({id_mes:t,id_evento:e,id_obreiro:n})}onCancel(){this.close.emit()}static ɵfac=function(e){return new(e||a)};static ɵcmp=fD({type:a,selectors:[[`app-escala-modal`]],inputs:{isOpen:`isOpen`,meses:`meses`,eventos:`eventos`,obreiros:`obreiros`,bloqueios:`bloqueios`,escalas:`escalas`,defaultMesId:`defaultMesId`,defaultEventoId:`defaultEventoId`,loading:`loading`},outputs:{save:`save`,close:`close`},features:[Vh],decls:1,vars:1,consts:[[1,`fixed`,`inset-0`,`z-50`,`overflow-y-auto`,`bg-black/80`,`backdrop-blur-sm`,`flex`,`items-end`,`sm:items-center`,`justify-center`,`p-0`,`sm:p-4`,`animate-fade-in`],[1,`glass-panel`,`w-full`,`sm:max-w-lg`,`rounded-t-3xl`,`sm:rounded-3xl`,`border`,`border-slate-700/80`,`bg-slate-900/95`,`shadow-2xl`,`p-5`,`sm:p-6`,`space-y-4`,`max-h-[88vh]`,`flex`,`flex-col`,3,`click`],[1,`flex`,`items-start`,`justify-between`,`gap-3`,`border-b`,`border-slate-800`,`pb-3.5`],[1,`flex`,`items-center`,`gap-3`],[1,`w-10`,`h-10`,`rounded-xl`,`bg-indigo-500/10`,`border`,`border-indigo-500/20`,`text-indigo-400`,`flex`,`items-center`,`justify-center`,`text-lg`,`font-bold`,`shrink-0`],[1,`text-base`,`font-bold`,`text-white`],[1,`text-xs`,`text-slate-400`,`mt-0.5`],[`type`,`button`,1,`p-1.5`,`rounded-lg`,`text-slate-400`,`hover:text-white`,`hover:bg-slate-800`,`transition-colors`,3,`click`],[1,`bg-slate-950/80`,`border`,`border-slate-800`,`rounded-2xl`,`p-3.5`,`space-y-2.5`],[1,`grid`,`grid-cols-1`,`sm:grid-cols-2`,`gap-2`],[1,`block`,`text-[10px]`,`uppercase`,`font-bold`,`text-slate-400`,`mb-1`],[1,`w-full`,`px-3`,`py-1.5`,`bg-slate-900`,`border`,`border-slate-700/70`,`rounded-xl`,`text-xs`,`text-slate-100`,`focus:outline-none`,`focus:border-indigo-500`,`transition-all`,3,`ngModelChange`,`ngModel`],[3,`value`],[1,`flex`,`items-center`,`justify-between`,`text-xs`,`text-slate-400`,`pt-2`,`border-t`,`border-slate-800/80`,`flex-wrap`,`gap-2`],[1,`relative`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`text-slate-400`,`absolute`,`left-3.5`,`top-1/2`,`-translate-y-1/2`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z`],[`type`,`text`,`placeholder`,`Buscar obreiro para escalar...`,1,`w-full`,`pl-10`,`pr-4`,`py-2`,`bg-slate-950/80`,`border`,`border-slate-700/60`,`rounded-xl`,`text-xs`,`sm:text-sm`,`text-slate-100`,`placeholder-slate-500`,`focus:outline-none`,`focus:border-indigo-500`,`transition-all`,3,`ngModelChange`,`ngModel`],[1,`flex-1`,`overflow-y-auto`,`space-y-2`,`max-h-60`,`sm:max-h-64`,`pr-1`],[1,`py-8`,`text-center`,`text-xs`,`text-slate-500`],[1,`p-3`,`rounded-xl`,`border`,`flex`,`items-center`,`justify-between`,`gap-3`,`transition-all`,3,`opacity-50`,`cursor-not-allowed`,`cursor-pointer`,`class`],[1,`pt-3`,`border-t`,`border-slate-800`,`flex`,`items-center`,`justify-end`,`gap-2`],[`type`,`button`,1,`px-4`,`py-2`,`rounded-xl`,`text-xs`,`font-semibold`,`text-slate-400`,`hover:text-white`,`bg-slate-800`,`hover:bg-slate-700`,`transition-colors`,3,`click`],[`type`,`button`,1,`px-5`,`py-2`,`rounded-xl`,`text-xs`,`font-bold`,`text-white`,`bg-indigo-600`,`hover:bg-indigo-500`,`disabled:opacity-50`,`disabled:cursor-not-allowed`,`shadow-md`,`shadow-indigo-600/30`,`transition-all`,`flex`,`items-center`,`gap-2`,3,`click`,`disabled`],[1,`w-3.5`,`h-3.5`,`border-2`,`border-white/20`,`border-t-white`,`rounded-full`,`animate-spin`],[1,`flex`,`items-center`,`gap-2`],[1,`font-bold`,`text-slate-200`],[1,`text-slate-600`],[1,`text-indigo-400`,`font-semibold`],[1,`text-slate-300`],[1,`text-[11px]`,`font-semibold`,`text-slate-400`,`bg-slate-900`,`px-2`,`py-0.5`,`rounded`,`border`,`border-slate-800`],[1,`p-3`,`rounded-xl`,`border`,`flex`,`items-center`,`justify-between`,`gap-3`,`transition-all`,3,`click`],[1,`flex`,`items-center`,`gap-2.5`,`min-w-0`],[1,`w-8`,`h-8`,`rounded-lg`,`bg-slate-800`,`border`,`border-slate-700`,`flex`,`items-center`,`justify-center`,`font-bold`,`text-xs`,`text-indigo-400`,`shrink-0`],[1,`min-w-0`],[1,`text-xs`,`sm:text-sm`,`font-bold`,`text-white`,`truncate`],[1,`flex`,`items-center`,`gap-1.5`,`text-[10px]`,`text-slate-400`,`mt-0.5`,`flex-wrap`],[1,`text-amber-400`,`font-semibold`],[1,`text-purple-400`,`font-semibold`],[1,`shrink-0`],[1,`text-[9px]`,`font-bold`,`px-2`,`py-0.5`,`rounded`,`bg-slate-800`,`text-slate-400`,`border`,`border-slate-700`],[1,`text-[9px]`,`font-bold`,`px-2`,`py-0.5`,`rounded`,`bg-rose-500/15`,`text-rose-300`,`border`,`border-rose-500/30`,`flex`,`items-center`,`gap-1`,3,`title`],[1,`text-[9px]`,`font-bold`,`px-2`,`py-0.5`,`rounded`,`bg-emerald-500/15`,`text-emerald-300`,`border`,`border-emerald-500/30`]],template:function(e,n){e&1&&MD(0,Ye,43,7,`div`,0),e&2&&RD(n.isOpen?0:-1)},dependencies:[PC,Hn,Gn,Bn,Xe$1,Vt$1,Pn,ln,OC],encapsulation:2})};var Xe=a=>[`/eventos`,a,`operacao`];var Ze=(a,t)=>t.id_mes;var et=(a,t)=>t.id_evento;var Le=(a,t)=>t.id_escala;var Fe=(a,t)=>t.id_obreiro;function tt(a,t){if(a&1){let e=VD();Gs(0,`div`,25),Tg(`click`,function(r){return r.stopPropagation()}),Gs(1,`button`,26),Tg(`click`,function(){Of(e);return Pf(zD().exportarPdfPorEventos())}),zf(),Gs(2,`svg`,27),_g(3,`path`,28),Sl(),Kf(),Gs(4,`span`),yI(5,`Escala por Cultos / Eventos`),Sl()(),Gs(6,`button`,26),Tg(`click`,function(){Of(e);return Pf(zD().exportarPdfPorObreiros())}),zf(),Gs(7,`svg`,27),_g(8,`path`,29),Sl(),Kf(),Gs(9,`span`),yI(10,`Escala por Obreiros`),Sl()()()}}function nt(a,t){a&1&&(Gs(0,`a`,13)(1,`span`),yI(2,`⚡ Gerar Automática`),Sl()())}function it(a,t){if(a&1&&(Gs(0,`option`,20),yI(1),Sl()),a&2){let e=t.$implicit,n=zD();bg(`value`,e.id_mes),Tb(),$g(n.formatMesReferencia(e))}}function ot(a,t){a&1&&(Gs(0,`div`,35)(1,`div`,37),zf(),Gs(2,`svg`,38),_g(3,`path`,39),Sl()(),Kf(),Gs(4,`h3`,40),yI(5,`Nenhum evento encontrado`),Sl(),Gs(6,`p`,41),yI(7,`Cadastre eventos ou selecione outro mês no filtro superior.`),Sl()())}function at(a,t){if(a&1&&(Gs(0,`span`,46),yI(1),Sl()),a&2){let e=zD().$implicit,n=zD(2);Tb(),Nl(` `,n.formatMesReferencia(e.mes),` `)}}function rt(a,t){if(a&1&&(Gs(0,`span`,59),yI(1),Sl()),a&2){let e=zD(2).$implicit,n=zD(2);Tb(),Nl(`(`,n.getCheckinStats(e.id_evento).faltas,` ausente)`)}}function st(a,t){if(a&1&&(Gs(0,`div`,50)(1,`span`,57),yI(2,`Presença:`),Sl(),Gs(3,`span`,58),yI(4),Sl(),MD(5,rt,2,1,`span`,59),Sl()),a&2){let e=zD().$implicit,n=zD(2);Tb(4),Bg(` `,n.getCheckinStats(e.id_evento).presentes,`/`,n.getEscaladosByEvent(e.id_evento).length,` `),Tb(),RD(n.getCheckinStats(e.id_evento).faltas>0?5:-1)}}function lt(a,t){if(a&1){let e=VD();Gs(0,`button`,60),Tg(`click`,function(){Of(e);let r=zD().$implicit;return Pf(zD(2).openAddModal(r.id_evento,r.id_mes))}),zf(),Gs(1,`svg`,61),_g(2,`path`,62),Sl(),Kf(),Gs(3,`span`),yI(4,`Escalar`),Sl()()}}function dt(a,t){if(a&1){let e=VD();Gs(0,`div`,63),Tg(`click`,function(){Of(e);let r=zD().$implicit;return Pf(zD(2).toggleEventoExpand(r.id_evento))}),Gs(1,`div`,17)(2,`span`,64),yI(3),Sl()(),Gs(4,`span`,65),yI(5,`Ver escalados ▸`),Sl()()}if(a&2){let e=zD().$implicit,n=zD(2);Tb(3),Nl(`👥 `,n.getEscaladosByEvent(e.id_evento).length,` obreiro(s) escalado(s)`)}}function ct(a,t){a&1&&(Gs(0,`div`,66),yI(1,` Nenhum obreiro escalado neste evento ainda. `),Sl())}function mt(a,t){a&1&&(Gs(0,`span`,75),yI(1,`• Púlpito`),Sl())}function pt(a,t){a&1&&(Gs(0,`span`,76),yI(1,`• Líder`),Sl())}function ut(a,t){if(a&1){let e=VD();Gs(0,`div`,77)(1,`button`,84),Tg(`click`,function(){Of(e);let r=zD().$implicit;return Pf(zD(5).openSubstituirModal(r))}),zf(),Gs(2,`svg`,61),_g(3,`path`,85),Sl()(),Kf(),Gs(4,`button`,86),Tg(`click`,function(){Of(e);let r=zD().$implicit;return Pf(zD(5).confirmDeleteEscala(r))}),zf(),Gs(5,`svg`,61),_g(6,`path`,87),Sl()()()}}function xt(a,t){if(a&1){let e=VD();Gs(0,`div`,68)(1,`div`,69)(2,`div`,70)(3,`div`,71),yI(4),Sl(),Gs(5,`div`,72)(6,`div`,73),yI(7),Sl(),Gs(8,`div`,74)(9,`span`),yI(10),Sl(),MD(11,mt,2,0,`span`,75),MD(12,pt,2,0,`span`,76),Sl()()(),MD(13,ut,7,0,`div`,77),Sl(),Gs(14,`div`,78)(15,`div`,79)(16,`button`,80),Tg(`click`,function(){let r=Of(e).$implicit;return Pf(zD(5).toggleCheckin(r,r.checkin===!0?null:!0))}),Gs(17,`span`,81),yI(18,`✓`),Sl(),Gs(19,`span`),yI(20,`Presente`),Sl()(),Gs(21,`button`,82),Tg(`click`,function(){let r=Of(e).$implicit;return Pf(zD(5).toggleCheckin(r,r.checkin===!1?null:!1))}),Gs(22,`span`,83),yI(23,`✕`),Sl(),Gs(24,`span`),yI(25,`Falta`),Sl()()()()()}if(a&2){let e=t.$implicit,n=zD(5);Tb(4),Nl(` `,n.getInitials(e.obreiros?.nome),` `),Tb(2),bg(`title`,e.obreiros?.nome),Tb(),Nl(` `,e.obreiros?.nome,` `),Tb(3),$g(e.obreiros?.diacono?`Diácono`:`Obreiro`),Tb(),RD(e.obreiros?.pulpito?11:-1),Tb(),RD(e.obreiros?.lider?12:-1),Tb(),RD(n.authService.canManageEscalas()?13:-1),Tb(3),sI(e.checkin===!0?`bg-emerald-500/25 text-emerald-300 border-emerald-500/40 shadow-sm font-bold`:`text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60 border-transparent`),Tb(5),sI(e.checkin===!1?`bg-rose-500/25 text-rose-300 border-rose-500/40 shadow-sm font-bold`:`text-slate-400 hover:text-rose-300 hover:bg-slate-800/60 border-transparent`)}}function _t(a,t){if(a&1&&(Gs(0,`div`,67),LD(1,xt,26,11,`div`,68,Le),Sl()),a&2){let e=zD(2).$implicit,n=zD(2);Tb(),FD(n.getEscaladosByEvent(e.id_evento))}}function bt(a,t){if(a&1&&(Gs(0,`div`,56),MD(1,ct,2,0,`div`,66)(2,_t,3,0,`div`,67),Sl()),a&2){let e=zD().$implicit,n=zD(2);Tb(),RD(n.getEscaladosByEvent(e.id_evento).length===0?1:2)}}function ft(a,t){if(a&1){let e=VD();Gs(0,`div`,36)(1,`div`,42)(2,`div`,43),Tg(`click`,function(){let r=Of(e).$implicit;return Pf(zD(2).toggleEventoExpand(r.id_evento))}),Gs(3,`div`,44)(4,`span`,45),yI(5),Sl(),MD(6,at,2,1,`span`,46),Gs(7,`span`,31),yI(8),PI(9,`date`),Sl()(),Gs(10,`h3`,47)(11,`span`),yI(12),Sl(),zf(),Gs(13,`svg`,48),_g(14,`path`,11),Sl()()(),Kf(),Gs(15,`div`,49),MD(16,st,6,3,`div`,50),Gs(17,`a`,51)(18,`span`),yI(19,`⚙️ Gerenciar`),Sl()(),MD(20,lt,5,0,`button`,52),Gs(21,`button`,53),Tg(`click`,function(){let r=Of(e).$implicit;return Pf(zD(2).toggleEventoExpand(r.id_evento))}),zf(),Gs(22,`svg`,54),_g(23,`path`,11),Sl()()()(),MD(24,dt,6,1,`div`,55),MD(25,bt,3,1,`div`,56),Sl()}if(a&2){let e=t.$implicit,n=zD(2);bg(`id`,`evento-card-`+e.id_evento),Tb(4),sI(n.getTurnoStyle(e.turno).bg+` `+n.getTurnoStyle(e.turno).text+` `+n.getTurnoStyle(e.turno).border),Tb(),Nl(` `,n.getTurnoLabel(e.turno),` `),Tb(),RD(e.mes?6:-1),Tb(2),Nl(` `,FI(9,17,e.data,`dd/MM/yyyy`),` `),Tb(4),$g(e.descricao||`Culto`),Tb(),Rg(`rotate-180`,n.isEventoExpanded(e.id_evento)),Tb(3),RD(n.getEscaladosByEvent(e.id_evento).length>0?16:-1),Tb(),bg(`routerLink`,AI(20,Xe,e.id_evento)),Tb(3),RD(n.authService.canManageEscalas()?20:-1),Tb(),bg(`title`,n.isEventoExpanded(e.id_evento)?`Recolher obreiros`:`Expandir obreiros`),Tb(),Rg(`rotate-180`,n.isEventoExpanded(e.id_evento)),Tb(2),RD(n.isEventoExpanded(e.id_evento)?-1:24),Tb(),RD(n.isEventoExpanded(e.id_evento)?25:-1)}}function vt(a,t){if(a&1){let e=VD();Gs(0,`div`,21)(1,`div`,30)(2,`span`,31),yI(3),Sl(),Gs(4,`div`,17)(5,`button`,32),Tg(`click`,function(){Of(e);return Pf(zD().expandAllEventos())}),yI(6,` Expandir Todos `),Sl(),Gs(7,`span`,33),yI(8,`•`),Sl(),Gs(9,`button`,34),Tg(`click`,function(){Of(e);return Pf(zD().collapseAllEventos())}),yI(10,` Recolher Todos `),Sl()()(),MD(11,ot,8,0,`div`,35),LD(12,ft,26,22,`div`,36,et),Sl()}if(a&2){let e=zD();Tb(3),Nl(` `,e.filteredEventos().length,` cultos / eventos `),Tb(8),RD(e.filteredEventos().length===0?11:-1),Tb(),FD(e.filteredEventos())}}function gt(a,t){a&1&&(Gs(0,`span`,75),yI(1,`• Púlpito`),Sl())}function ht(a,t){a&1&&(Gs(0,`span`,76),yI(1,`• Líder`),Sl())}function Et(a,t){a&1&&(Gs(0,`span`,102),yI(1,`Sem escalas`),Sl())}function Ct(a,t){if(a&1&&(Gs(0,`span`),yI(1),Sl()),a&2){let e=zD(2).$implicit,n=zD(2);Tb(),Nl(``,n.getEscalasByObreiro(e.id_obreiro).length,` culto(s) escalado(s)`)}}function yt(a,t){if(a&1){let e=VD();Gs(0,`div`,100),Tg(`click`,function(){Of(e);let r=zD().$implicit;return Pf(zD(2).toggleObreiroExpand(r.id_obreiro))}),Gs(1,`div`,101),MD(2,Et,2,0,`span`,102)(3,Ct,2,1,`span`),Sl(),Gs(4,`span`,103),yI(5,`Ver escalas ▸`),Sl()()}if(a&2){let e=zD().$implicit,n=zD(2);Tb(2),RD(n.getEscalasByObreiro(e.id_obreiro).length===0?2:3)}}function St(a,t){a&1&&(Gs(0,`p`,104),yI(1,`Nenhuma escala neste período.`),Sl())}function wt(a,t){a&1&&(Gs(0,`span`,108),yI(1,`✓ Presente`),Sl())}function Mt(a,t){a&1&&(Gs(0,`span`,109),yI(1,`✕ Falta`),Sl())}function kt(a,t){a&1&&(Gs(0,`span`,110),yI(1,`⏳ Pendente`),Sl())}function Tt(a,t){if(a&1){let e=VD();Gs(0,`button`,114),Tg(`click`,function(){Of(e);let r=zD().$implicit;return Pf(zD(4).confirmDeleteEscala(r))}),zf(),Gs(1,`svg`,115),_g(2,`path`,87),Sl()()}}function It(a,t){if(a&1&&(Gs(0,`div`,105)(1,`div`,93)(2,`div`,106)(3,`span`,107),yI(4),PI(5,`date`),Sl(),MD(6,wt,2,0,`span`,108)(7,Mt,2,0,`span`,109)(8,kt,2,0,`span`,110),Sl(),Gs(9,`p`,111),yI(10),Sl()(),Gs(11,`div`,112),MD(12,Tt,3,0,`button`,113),Sl()()),a&2){let e=t.$implicit,n=zD(4);Tb(4),$g(FI(5,4,e.eventos?.data,`dd/MM`)),Tb(2),RD(e.checkin===!0?6:e.checkin===!1?7:8),Tb(4),$g(e.eventos?.descricao),Tb(2),RD(n.authService.canManageEscalas()?12:-1)}}function Dt(a,t){if(a&1&&(Gs(0,`div`,99),MD(1,St,2,0,`p`,104),LD(2,It,13,7,`div`,105,Le),Sl()),a&2){let e=zD().$implicit,n=zD(2);Tb(),RD(n.getEscalasByObreiro(e.id_obreiro).length===0?1:-1),Tb(),FD(n.getEscalasByObreiro(e.id_obreiro))}}function Ot(a,t){if(a&1){let e=VD();Gs(0,`div`,89)(1,`div`,90),Tg(`click`,function(){let r=Of(e).$implicit;return Pf(zD(2).toggleObreiroExpand(r.id_obreiro))}),Gs(2,`div`,91)(3,`div`,92),yI(4),Sl(),Gs(5,`div`,93)(6,`h4`,94)(7,`span`),yI(8),Sl(),zf(),Gs(9,`svg`,95),_g(10,`path`,11),Sl()(),Kf(),Gs(11,`div`,96)(12,`span`),yI(13),Sl(),MD(14,gt,2,0,`span`,75),MD(15,ht,2,0,`span`,76),Sl()()(),Gs(16,`span`,97),yI(17),Sl()(),MD(18,yt,6,1,`div`,98),MD(19,Dt,4,1,`div`,99),Sl()}if(a&2){let e=t.$implicit,n=zD(2);Tb(4),Nl(` `,n.getInitials(e.nome),` `),Tb(4),$g(e.nome),Tb(),Rg(`rotate-180`,n.isObreiroExpanded(e.id_obreiro)),Tb(4),$g(e.diacono?`Diácono`:`Obreiro`),Tb(),RD(e.pulpito?14:-1),Tb(),RD(e.lider?15:-1),Tb(2),Nl(` `,n.getEscalasByObreiro(e.id_obreiro).length,` escalas `),Tb(),RD(n.isObreiroExpanded(e.id_obreiro)?-1:18),Tb(),RD(n.isObreiroExpanded(e.id_obreiro)?19:-1)}}function Lt(a,t){if(a&1){let e=VD();Gs(0,`div`,21)(1,`div`,30)(2,`span`,31),yI(3),Sl(),Gs(4,`div`,17)(5,`button`,32),Tg(`click`,function(){Of(e);return Pf(zD().expandAllObreiros())}),yI(6,` Expandir Todos `),Sl(),Gs(7,`span`,33),yI(8,`•`),Sl(),Gs(9,`button`,34),Tg(`click`,function(){Of(e);return Pf(zD().collapseAllObreiros())}),yI(10,` Recolher Todos `),Sl()()(),Gs(11,`div`,88),LD(12,Ot,20,10,`div`,89,Fe),Sl()()}if(a&2){let e=zD();Tb(3),Nl(` `,e.obreiroService.obreiros().length,` obreiros `),Tb(9),FD(e.obreiroService.obreiros())}}function Ft(a,t){a&1&&(Gs(0,`div`,131),yI(1,` Nenhum obreiro disponível encontrado com este filtro. `),Sl())}function Vt(a,t){a&1&&(Gs(0,`span`,76),yI(1,`• Líder`),Sl())}function Nt(a,t){a&1&&(Gs(0,`span`,75),yI(1,`• Púlpito`),Sl())}function $t(a,t){if(a&1&&(Gs(0,`span`,141)(1,`span`),yI(2,`⚠️ Bloqueado`),Sl()()),a&2){let e=zD().$implicit;bg(`title`,e.motivoBloqueio)}}function Pt(a,t){a&1&&(Gs(0,`span`,142),yI(1,` ✓ Disponível `),Sl())}function At(a,t){if(a&1){let e=VD();Gs(0,`div`,136),Tg(`click`,function(){let r=Of(e).$implicit;return Pf(zD(2).selecionarSubstituto(r.id_obreiro))}),Gs(1,`div`,91)(2,`div`,137),yI(3),Sl(),Gs(4,`div`,93)(5,`h4`,138),yI(6),Sl(),Gs(7,`div`,139)(8,`span`),yI(9),Sl(),MD(10,Vt,2,0,`span`,76),MD(11,Nt,2,0,`span`,75),Sl()()(),Gs(12,`div`,140),MD(13,$t,3,1,`span`,141)(14,Pt,2,0,`span`,142),Sl()()}if(a&2){let e=t.$implicit,n=zD(2);sI(n.substitutoSelecionadoId()===e.id_obreiro?`bg-amber-500/15 border-amber-500/50 shadow`:`bg-slate-950/60 border-slate-800/80 hover:border-slate-700`),Tb(3),Nl(` `,n.getInitials(e.nome),` `),Tb(3),$g(e.nome),Tb(3),$g(e.diacono?`Diácono`:`Obreiro`),Tb(),RD(e.lider?10:-1),Tb(),RD(e.pulpito?11:-1),Tb(2),RD(e.isBloqueado?13:14)}}function jt(a,t){if(a&1){let e=VD();Gs(0,`div`,24)(1,`div`,116),Tg(`click`,function(r){return r.stopPropagation()}),Gs(2,`div`,117)(3,`div`,118)(4,`div`,119),yI(5,` 🔄 `),Sl(),Gs(6,`div`)(7,`h3`,40),yI(8,`Substituir Obreiro`),Sl(),Gs(9,`p`,120),yI(10,`Selecione quem irá assumir esta vaga na escala`),Sl()()(),Gs(11,`button`,121),Tg(`click`,function(){Of(e);return Pf(zD().closeSubstituirModal())}),yI(12,` ✕ `),Sl()(),Gs(13,`div`,122)(14,`div`,123)(15,`span`),yI(16,`Culto / Evento:`),Sl(),Gs(17,`span`,124),yI(18),PI(19,`date`),Sl()(),Gs(20,`div`,125)(21,`span`,57),yI(22,`Substituindo:`),Sl(),Gs(23,`span`,126),yI(24),Sl()()(),Gs(25,`div`,6),zf(),Gs(26,`svg`,127),_g(27,`path`,128),Sl(),Kf(),Gs(28,`input`,129),Tg(`ngModelChange`,function(r){Of(e);return Pf(zD().substitutoSearchQuery.set(r))}),Sl(),y_(),Sl(),Gs(29,`div`,130),MD(30,Ft,2,0,`div`,131),LD(31,At,15,8,`div`,132,Fe),Sl(),Gs(33,`div`,133)(34,`button`,134),Tg(`click`,function(){Of(e);return Pf(zD().closeSubstituirModal())}),yI(35,` Cancelar `),Sl(),Gs(36,`button`,135),Tg(`click`,function(){Of(e);return Pf(zD().confirmarSubstituicao())}),Gs(37,`span`),yI(38,`Confirmar Substituição`),Sl()()()()()}if(a&2){let e=zD();Tb(18),Bg(` `,FI(19,6,e.selectedEscalaParaSubstituir()?.eventos?.data,`dd/MM/yyyy`),` • `,e.getTurnoLabel(e.selectedEscalaParaSubstituir()?.eventos?.turno||0),` `),Tb(6),Nl(` `,e.selectedEscalaParaSubstituir()?.obreiros?.nome,` `),Tb(4),bg(`ngModel`,e.substitutoSearchQuery()),w_(),Tb(2),RD(e.candidatosSubstitutos().length===0?30:-1),Tb(),FD(e.candidatosSubstitutos()),Tb(5),bg(`disabled`,!e.substitutoSelecionadoId()||e.escalaService.loading())}}var Oe=class a{authService=S(m);escalaService=S(f);eventoService=S(f$1);obreiroService=S(h);mesService=S(h$1);bloqueioService=S(q);pdfService=S(se);toast=S(Dm);route=S(K);formatMesReferencia=l;viewMode=`eventos`;selectedMesId=po(0);selectedEventoId=null;selectedEscala=null;isModalOpen=!1;isConfirmOpen=!1;isPdfMenuOpen=!1;filteredEventos=UI(()=>{let t=this.selectedMesId(),e=this.eventoService.eventos();return[...t===0?e:e.filter(r=>r.id_mes===t)].sort((r,d)=>{let b=(r.data||``).localeCompare(d.data||``);return b!==0?b:(r.turno||0)-(d.turno||0)})});filteredEscalas=UI(()=>{let t=this.selectedMesId(),e=this.escalaService.escalas();return t===0?e:e.filter(n=>n.id_mes===t)});isSubstituirModalOpen=!1;selectedEscalaParaSubstituir=po(null);substitutoSearchQuery=po(``);substitutoSelecionadoId=po(null);candidatosSubstitutos=UI(()=>{let t=this.selectedEscalaParaSubstituir();if(!t)return[];let e=this.obreiroService.obreiros().filter(m=>m.ativo),n=this.bloqueioService.bloqueios(),r=this.substitutoSearchQuery().toLowerCase().trim(),d=t.id_evento,b=t.eventos||this.eventoService.eventos().find(m=>m.id_evento===d),f=b?.data,h=b?.turno,E=new Set(this.filteredEscalas().filter(m=>m.id_evento===d).map(m=>m.id_obreiro));return e.filter(m=>typeof m.id_obreiro==`number`).filter(m=>m.id_obreiro!==t.id_obreiro).filter(m=>!E.has(m.id_obreiro)).map(m=>{let S=!1,p=``;if(f){let F=n.find(I=>I.id_obreiro===m.id_obreiro&&I.data===f&&(I.turno===h||I.turno===4||I.turno===0));F&&(S=!0,p=F.motivo||`Indisponibilidade informada`)}return J(V({},m),{isBloqueado:S,motivoBloqueio:p})}).filter(m=>r?m.nome.toLowerCase().includes(r)||m.apelido&&m.apelido.toLowerCase().includes(r):!0).sort((m,S)=>m.isBloqueado!==S.isBloqueado?m.isBloqueado?1:-1:m.nome.localeCompare(S.nome))});openSubstituirModal(t){this.selectedEscalaParaSubstituir.set(t),this.substitutoSearchQuery.set(``),this.substitutoSelecionadoId.set(null),this.isSubstituirModalOpen=!0}closeSubstituirModal(){this.isSubstituirModalOpen=!1,this.selectedEscalaParaSubstituir.set(null),this.substitutoSelecionadoId.set(null),this.substitutoSearchQuery.set(``)}selecionarSubstituto(t){t&&this.substitutoSelecionadoId.set(t)}async confirmarSubstituicao(){let t=this.selectedEscalaParaSubstituir(),e=this.substitutoSelecionadoId();if(!t||!t.id_escala||!e)return;await this.escalaService.substituirObreiro(t.id_escala,e)&&this.closeSubstituirModal()}expandedEventos=po(new Set);expandedObreiros=po(new Set);isEventoExpanded(t){return t?this.expandedEventos().has(t):!1}toggleEventoExpand(t){t&&this.expandedEventos.update(e=>{let n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n})}expandAllEventos(){let t=this.filteredEventos().map(e=>e.id_evento).filter(e=>typeof e==`number`);this.expandedEventos.set(new Set(t))}collapseAllEventos(){this.expandedEventos.set(new Set)}isObreiroExpanded(t){return t?this.expandedObreiros().has(t):!1}toggleObreiroExpand(t){t&&this.expandedObreiros.update(e=>{let n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n})}expandAllObreiros(){let t=this.obreiroService.obreiros().map(e=>e.id_obreiro).filter(e=>typeof e==`number`);this.expandedObreiros.set(new Set(t))}collapseAllObreiros(){this.expandedObreiros.set(new Set)}async onMesChange(t){let e=Number(t);this.selectedMesId.set(e),e>0?await this.escalaService.fetchByMes(e):await this.escalaService.fetchAll(),typeof window<`u`&&window.innerWidth<768||this.expandAllEventos(),this.scrollToCurrentOrNextEvento()}async ngOnInit(){this.route.queryParams.subscribe(d=>{if(d.mes){let b=Number(d.mes);isNaN(b)||this.selectedMesId.set(b)}});let[e]=await Promise.all([this.mesService.fetchAll(),this.eventoService.fetchAll(),this.obreiroService.fetchAll(),this.bloqueioService.fetchAll()]);if(this.selectedMesId()===0){let d=p(e);d&&d.id_mes&&this.selectedMesId.set(d.id_mes)}let n=this.selectedMesId();n>0?await this.escalaService.fetchByMes(n):await this.escalaService.fetchAll(),typeof window<`u`&&window.innerWidth<768?(this.collapseAllEventos(),this.collapseAllObreiros()):(this.expandAllEventos(),this.expandAllObreiros()),this.scrollToCurrentOrNextEvento()}scrollToCurrentOrNextEvento(){let t=this.mesService.meses().find(m=>m.id_mes===this.selectedMesId());if(!t)return;let e=new Date;if(!(t.ano_referencia===e.getFullYear()&&t.mes_referencia===e.getMonth()+1))return;let f=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`,h=this.filteredEventos(),E=h.find(m=>m.data===f);E||(E=h.find(m=>m.data>f)),E&&E.id_evento&&setTimeout(()=>{let m=document.getElementById(`evento-card-${E.id_evento}`);m&&m.scrollIntoView({behavior:`smooth`,block:`start`})},150)}getEscaladosByEvent(t){return this.filteredEscalas().filter(e=>e.id_evento===t)}getEscalasByObreiro(t){return this.filteredEscalas().filter(e=>e.id_obreiro===t)}getCheckinStats(t){let e=this.getEscaladosByEvent(t);return{presentes:e.filter(b=>b.checkin===!0).length,faltas:e.filter(b=>b.checkin===!1).length,pendentes:e.filter(b=>b.checkin===null||b.checkin===void 0).length}}async toggleCheckin(t,e){t.id_escala&&await this.escalaService.updateCheckin(t.id_escala,e)}openAddModal(t,e){this.selectedEventoId=t||null,e&&this.selectedMesId()===0&&this.selectedMesId.set(e),this.isModalOpen=!0}exportarPdfPorEventos(){this.isPdfMenuOpen=!1;let t=this.selectedMesId(),e=this.mesService.meses().find(n=>Number(n.id_mes)===Number(t));if(!e){this.toast.warning(`Selecione um mês`,`Por favor, selecione um mês de referência para exportar o PDF.`);return}this.pdfService.gerarPdfPorEventos(e,this.eventoService.eventos(),this.escalaService.escalas())}exportarPdfPorObreiros(){this.isPdfMenuOpen=!1;let t=this.selectedMesId(),e=this.mesService.meses().find(n=>Number(n.id_mes)===Number(t));if(!e){this.toast.warning(`Selecione um mês`,`Por favor, selecione um mês de referência para exportar o PDF.`);return}this.pdfService.gerarPdfPorObreiros(e,this.eventoService.eventos(),this.escalaService.escalas(),this.obreiroService.obreiros())}getTurnoLabel(t$3){return t[t$3]||`Geral`}getTurnoStyle(t){return b[t]||{bg:`bg-slate-800`,text:`text-slate-300`,border:`border-slate-700`}}getInitials(t){if(!t)return`OB`;let e=t.trim().split(` `);return e.length===1?e[0].substring(0,2).toUpperCase():(e[0][0]+e[e.length-1][0]).toUpperCase()}closeModal(){this.isModalOpen=!1,this.selectedEventoId=null}confirmDeleteEscala(t){this.selectedEscala=t,this.isConfirmOpen=!0}closeConfirm(){this.isConfirmOpen=!1,this.selectedEscala=null}async handleSave(t){await this.escalaService.addObreiroToEvento(t)&&this.closeModal()}async handleDelete(){this.selectedEscala&&this.selectedEscala.id_escala&&await this.escalaService.removeObreiroFromEvento(this.selectedEscala.id_escala)&&this.closeConfirm()}static ɵfac=function(e){return new(e||a)};static ɵcmp=fD({type:a,selectors:[[`app-escalas-list`]],decls:40,vars:24,consts:[[1,`space-y-6`,`animate-fade-in`,`pb-20`,`md:pb-10`],[1,`flex`,`flex-col`,`sm:flex-row`,`sm:items-center`,`justify-between`,`gap-4`],[1,`text-2xl`,`sm:text-3xl`,`font-extrabold`,`text-white`,`tracking-tight`,`flex`,`items-center`,`gap-2.5`],[1,`text-xs`,`px-2.5`,`py-1`,`rounded-full`,`bg-indigo-500/10`,`text-indigo-400`,`border`,`border-indigo-500/20`,`font-semibold`],[1,`text-sm`,`text-slate-400`,`mt-1`],[1,`flex`,`items-center`,`gap-2.5`,`flex-wrap`,`relative`],[1,`relative`],[`type`,`button`,1,`inline-flex`,`items-center`,`justify-center`,`gap-2`,`px-3.5`,`py-2.5`,`rounded-xl`,`bg-slate-800/90`,`hover:bg-slate-700`,`text-slate-200`,`text-sm`,`font-semibold`,`border`,`border-slate-700/80`,`transition-all`,`shadow-md`,3,`click`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`text-rose-400`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-3.5`,`h-3.5`,`text-slate-400`,`transition-transform`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M19 9l-7 7-7-7`],[1,`absolute`,`right-0`,`mt-2`,`w-56`,`bg-slate-900`,`border`,`border-slate-800`,`rounded-xl`,`shadow-2xl`,`p-1.5`,`z-50`,`animate-fade-in`,`space-y-1`],[`routerLink`,`/escalas/gerador`,1,`inline-flex`,`items-center`,`justify-center`,`gap-2`,`px-3.5`,`py-2.5`,`rounded-xl`,`bg-purple-600/20`,`hover:bg-purple-600`,`text-purple-300`,`hover:text-white`,`text-sm`,`font-semibold`,`border`,`border-purple-500/30`,`transition-all`,`shadow-md`],[1,`glass-panel`,`rounded-2xl`,`p-3.5`,`border`,`border-slate-800/80`,`flex`,`flex-col`,`md:flex-row`,`items-stretch`,`md:items-center`,`justify-between`,`gap-3`],[1,`flex`,`items-center`,`p-1`,`bg-slate-900/90`,`border`,`border-slate-800`,`rounded-xl`],[1,`px-3.5`,`py-1.5`,`rounded-lg`,`text-xs`,`font-semibold`,`transition-all`,3,`click`],[1,`flex`,`items-center`,`gap-2`],[1,`text-xs`,`text-slate-400`,`font-semibold`],[1,`px-3`,`py-1.5`,`bg-slate-900/80`,`border`,`border-slate-700/60`,`rounded-xl`,`text-xs`,`text-slate-200`,`focus:outline-none`,`focus:border-indigo-500`,3,`ngModelChange`,`ngModel`],[3,`value`],[1,`space-y-4`],[3,`save`,`close`,`isOpen`,`meses`,`eventos`,`obreiros`,`bloqueios`,`escalas`,`defaultMesId`,`defaultEventoId`,`loading`],[`title`,`Remover da Escala`,3,`confirm`,`cancel`,`isOpen`,`message`],[1,`fixed`,`inset-0`,`z-50`,`overflow-y-auto`,`bg-black/80`,`backdrop-blur-sm`,`flex`,`items-end`,`sm:items-center`,`justify-center`,`p-0`,`sm:p-4`,`animate-fade-in`],[1,`absolute`,`right-0`,`mt-2`,`w-56`,`bg-slate-900`,`border`,`border-slate-800`,`rounded-xl`,`shadow-2xl`,`p-1.5`,`z-50`,`animate-fade-in`,`space-y-1`,3,`click`],[`type`,`button`,1,`w-full`,`text-left`,`px-3`,`py-2`,`rounded-lg`,`text-xs`,`font-semibold`,`text-slate-200`,`hover:bg-indigo-600/20`,`hover:text-indigo-300`,`transition-all`,`flex`,`items-center`,`gap-2`,3,`click`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`text-indigo-400`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z`],[1,`flex`,`items-center`,`justify-between`,`gap-2`,`px-1`],[1,`text-xs`,`font-semibold`,`text-slate-400`],[`type`,`button`,1,`text-[11px]`,`font-semibold`,`text-indigo-400`,`hover:text-indigo-300`,`transition-colors`,3,`click`],[1,`text-slate-600`],[`type`,`button`,1,`text-[11px]`,`font-semibold`,`text-slate-400`,`hover:text-slate-200`,`transition-colors`,3,`click`],[1,`glass-panel`,`rounded-3xl`,`p-12`,`text-center`,`border`,`border-slate-800/80`,`max-w-md`,`mx-auto`,`space-y-3`],[1,`glass-panel`,`rounded-2xl`,`p-4`,`sm:p-5`,`border`,`border-slate-800/80`,`space-y-3.5`,`transition-all`,`shadow-sm`,3,`id`],[1,`w-14`,`h-14`,`rounded-2xl`,`bg-indigo-500/10`,`border`,`border-indigo-500/20`,`text-indigo-400`,`mx-auto`,`flex`,`items-center`,`justify-center`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-7`,`h-7`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`1.5`,`d`,`M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z`],[1,`text-base`,`font-bold`,`text-white`],[1,`text-xs`,`text-slate-400`],[1,`flex`,`flex-col`,`sm:flex-row`,`sm:items-center`,`justify-between`,`gap-3`,`border-b`,`border-slate-800/80`,`pb-3`],[1,`space-y-1`,`cursor-pointer`,`select-none`,`group/evhdr`,`flex-1`,3,`click`],[1,`flex`,`items-center`,`gap-2`,`flex-wrap`],[1,`text-[10px]`,`uppercase`,`font-bold`,`tracking-wider`,`px-2`,`py-0.5`,`rounded-full`,`border`],[1,`text-[10px]`,`font-semibold`,`text-indigo-300`,`bg-indigo-500/10`,`px-2`,`py-0.5`,`rounded-md`,`border`,`border-indigo-500/20`],[1,`text-base`,`font-bold`,`text-white`,`group-hover/evhdr:text-indigo-300`,`transition-colors`,`flex`,`items-center`,`gap-2`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`text-slate-400`,`group-hover/evhdr:text-white`,`transition-transform`,`duration-200`],[1,`flex`,`items-center`,`gap-2`,`sm:gap-3`,`flex-wrap`],[1,`flex`,`items-center`,`gap-2`,`text-xs`,`bg-slate-900/80`,`border`,`border-slate-800`,`px-3`,`py-1.5`,`rounded-xl`],[1,`px-2.5`,`py-1.5`,`rounded-lg`,`bg-indigo-600/20`,`hover:bg-indigo-600`,`text-xs`,`font-bold`,`text-indigo-300`,`hover:text-white`,`border`,`border-indigo-500/30`,`transition-all`,`flex`,`items-center`,`gap-1.5`,3,`routerLink`],[1,`px-3`,`py-1.5`,`rounded-lg`,`bg-slate-800`,`hover:bg-slate-700`,`text-xs`,`font-semibold`,`text-slate-300`,`hover:text-white`,`border`,`border-slate-700`,`transition-all`,`flex`,`items-center`,`gap-1.5`],[`type`,`button`,1,`p-1.5`,`rounded-lg`,`text-slate-400`,`hover:text-white`,`hover:bg-slate-800`,`transition-colors`,3,`click`,`title`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`transition-transform`,`duration-200`],[1,`cursor-pointer`,`flex`,`items-center`,`justify-between`,`gap-2`,`text-xs`,`text-slate-400`,`hover:text-slate-300`,`transition-colors`,`pt-1`],[1,`animate-fade-in`,`pt-1`],[1,`text-slate-400`],[1,`font-bold`,`text-emerald-400`],[1,`text-rose-400`,`text-[11px]`],[1,`px-3`,`py-1.5`,`rounded-lg`,`bg-slate-800`,`hover:bg-slate-700`,`text-xs`,`font-semibold`,`text-slate-300`,`hover:text-white`,`border`,`border-slate-700`,`transition-all`,`flex`,`items-center`,`gap-1.5`,3,`click`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-3.5`,`h-3.5`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M12 4v16m8-8H4`],[1,`cursor-pointer`,`flex`,`items-center`,`justify-between`,`gap-2`,`text-xs`,`text-slate-400`,`hover:text-slate-300`,`transition-colors`,`pt-1`,3,`click`],[1,`font-bold`,`text-indigo-300`],[1,`text-indigo-400`,`font-semibold`,`text-xs`,`shrink-0`],[1,`py-6`,`text-center`,`text-xs`,`text-slate-500`],[1,`grid`,`grid-cols-1`,`sm:grid-cols-2`,`lg:grid-cols-3`,`gap-3`],[1,`bg-slate-900/80`,`border`,`border-slate-800`,`hover:border-slate-700`,`rounded-2xl`,`p-3.5`,`flex`,`flex-col`,`justify-between`,`gap-3`,`group`,`transition-all`,`shadow-sm`],[1,`flex`,`items-start`,`justify-between`,`gap-2.5`],[1,`flex`,`items-center`,`gap-2.5`,`min-w-0`,`flex-1`],[1,`w-9`,`h-9`,`rounded-xl`,`bg-slate-800`,`border`,`border-slate-700`,`flex`,`items-center`,`justify-center`,`font-bold`,`text-xs`,`text-indigo-400`,`shrink-0`],[1,`min-w-0`,`flex-1`],[1,`text-xs`,`sm:text-sm`,`font-bold`,`text-white`,`leading-tight`,`break-words`,3,`title`],[1,`text-[10px]`,`text-slate-400`,`flex`,`items-center`,`gap-1.5`,`flex-wrap`,`mt-0.5`],[1,`text-purple-400`,`font-semibold`],[1,`text-amber-400`,`font-semibold`],[1,`flex`,`items-center`,`gap-1`,`shrink-0`,`pt-0.5`],[1,`pt-2`,`border-t`,`border-slate-800/60`],[1,`flex`,`items-center`,`rounded-xl`,`bg-slate-950/90`,`border`,`border-slate-800/90`,`p-1`,`gap-1`,`shadow-inner`,`w-full`],[`type`,`button`,`title`,`Marcar Presente`,1,`flex-1`,`py-1.5`,`px-2`,`rounded-lg`,`text-xs`,`font-semibold`,`border`,`transition-all`,`flex`,`items-center`,`justify-center`,`gap-1.5`,`active:scale-95`,`touch-manipulation`,`min-h-[32px]`,3,`click`],[1,`text-emerald-400`,`font-bold`,`text-sm`],[`type`,`button`,`title`,`Marcar Falta / Ausente`,1,`flex-1`,`py-1.5`,`px-2`,`rounded-lg`,`text-xs`,`font-semibold`,`border`,`transition-all`,`flex`,`items-center`,`justify-center`,`gap-1.5`,`active:scale-95`,`touch-manipulation`,`min-h-[32px]`,3,`click`],[1,`text-rose-400`,`font-bold`,`text-sm`],[`title`,`Substituir obreiro por outro`,1,`w-8`,`h-8`,`rounded-lg`,`bg-slate-950/70`,`hover:bg-amber-500/15`,`text-slate-400`,`hover:text-amber-300`,`border`,`border-slate-800`,`hover:border-amber-500/30`,`transition-all`,`flex`,`items-center`,`justify-center`,`shrink-0`,`active:scale-95`,`touch-manipulation`,`shadow-sm`,3,`click`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4`],[`title`,`Remover da escala`,1,`w-8`,`h-8`,`rounded-lg`,`bg-slate-950/70`,`hover:bg-rose-500/15`,`text-slate-400`,`hover:text-rose-400`,`border`,`border-slate-800`,`hover:border-rose-500/30`,`transition-all`,`flex`,`items-center`,`justify-center`,`shrink-0`,`active:scale-95`,`touch-manipulation`,`shadow-sm`,3,`click`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16`],[1,`grid`,`grid-cols-1`,`sm:grid-cols-2`,`lg:grid-cols-3`,`gap-4`],[1,`glass-panel`,`rounded-2xl`,`p-4`,`border`,`border-slate-800/80`,`space-y-3`,`transition-all`,`shadow-sm`],[1,`flex`,`items-center`,`justify-between`,`cursor-pointer`,`select-none`,`group/obhdr`,3,`click`],[1,`flex`,`items-center`,`gap-2.5`,`min-w-0`],[1,`w-9`,`h-9`,`rounded-xl`,`bg-slate-800`,`border`,`border-slate-700`,`flex`,`items-center`,`justify-center`,`font-bold`,`text-xs`,`text-indigo-400`,`shrink-0`,`group-hover/obhdr:border-indigo-400`,`transition-colors`],[1,`min-w-0`],[1,`text-sm`,`font-bold`,`text-white`,`group-hover/obhdr:text-indigo-300`,`transition-colors`,`truncate`,`flex`,`items-center`,`gap-1.5`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-3.5`,`h-3.5`,`text-slate-400`,`group-hover/obhdr:text-white`,`transition-transform`,`duration-200`],[1,`text-[10px]`,`text-slate-400`,`flex`,`items-center`,`gap-1`,`flex-wrap`,`mt-0.5`],[1,`text-xs`,`font-extrabold`,`px-2`,`py-0.5`,`rounded-full`,`bg-indigo-500/10`,`text-indigo-400`,`border`,`border-indigo-500/20`,`shrink-0`],[1,`cursor-pointer`,`flex`,`items-center`,`justify-between`,`gap-2`,`text-xs`,`text-slate-400`,`hover:text-slate-300`,`transition-colors`,`pt-1`,`border-t`,`border-slate-800/60`],[1,`space-y-1.5`,`pt-2`,`border-t`,`border-slate-800`,`animate-fade-in`],[1,`cursor-pointer`,`flex`,`items-center`,`justify-between`,`gap-2`,`text-xs`,`text-slate-400`,`hover:text-slate-300`,`transition-colors`,`pt-1`,`border-t`,`border-slate-800/60`,3,`click`],[1,`truncate`,`text-[11px]`],[1,`text-slate-500`,`italic`],[1,`text-indigo-400`,`font-semibold`,`text-[11px]`,`shrink-0`],[1,`text-xs`,`text-slate-500`,`italic`],[1,`text-xs`,`bg-slate-900/60`,`border`,`border-slate-800`,`p-2`,`rounded-lg`,`flex`,`items-center`,`justify-between`,`gap-2`],[1,`flex`,`items-center`,`gap-1.5`],[1,`text-slate-300`,`font-semibold`],[1,`text-[9px]`,`font-bold`,`px-1.5`,`py-0.2`,`rounded`,`bg-emerald-500/15`,`text-emerald-400`,`border`,`border-emerald-500/30`],[1,`text-[9px]`,`font-bold`,`px-1.5`,`py-0.2`,`rounded`,`bg-rose-500/15`,`text-rose-400`,`border`,`border-rose-500/30`],[1,`text-[9px]`,`text-slate-500`,`px-1.5`,`py-0.2`,`rounded`,`bg-slate-800`,`border`,`border-slate-700`],[1,`text-slate-400`,`text-[11px]`,`truncate`],[1,`flex`,`items-center`,`gap-1`,`shrink-0`],[`title`,`Remover da escala`,1,`p-2`,`rounded-lg`,`bg-slate-950/60`,`hover:bg-rose-500/15`,`text-slate-400`,`hover:text-rose-400`,`border`,`border-slate-800`,`hover:border-rose-500/30`,`transition-all`,`min-h-[32px]`,`min-w-[32px]`,`flex`,`items-center`,`justify-center`,`active:scale-95`],[`title`,`Remover da escala`,1,`p-2`,`rounded-lg`,`bg-slate-950/60`,`hover:bg-rose-500/15`,`text-slate-400`,`hover:text-rose-400`,`border`,`border-slate-800`,`hover:border-rose-500/30`,`transition-all`,`min-h-[32px]`,`min-w-[32px]`,`flex`,`items-center`,`justify-center`,`active:scale-95`,3,`click`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`],[1,`glass-panel`,`w-full`,`sm:max-w-lg`,`rounded-t-3xl`,`sm:rounded-3xl`,`border`,`border-slate-700/80`,`bg-slate-900/95`,`shadow-2xl`,`p-5`,`sm:p-6`,`space-y-4`,`max-h-[85vh]`,`flex`,`flex-col`,3,`click`],[1,`flex`,`items-start`,`justify-between`,`gap-3`,`border-b`,`border-slate-800`,`pb-3.5`],[1,`flex`,`items-center`,`gap-3`],[1,`w-10`,`h-10`,`rounded-xl`,`bg-amber-500/10`,`border`,`border-amber-500/20`,`text-amber-400`,`flex`,`items-center`,`justify-center`,`text-lg`,`font-bold`,`shrink-0`],[1,`text-xs`,`text-slate-400`,`mt-0.5`],[1,`p-1.5`,`rounded-lg`,`text-slate-400`,`hover:text-white`,`hover:bg-slate-800`,`transition-colors`,3,`click`],[1,`bg-slate-950/80`,`border`,`border-slate-800`,`rounded-2xl`,`p-3.5`,`space-y-2`],[1,`flex`,`items-center`,`justify-between`,`text-xs`,`text-slate-400`],[1,`font-semibold`,`text-slate-200`],[1,`flex`,`items-center`,`justify-between`,`text-xs`],[1,`font-bold`,`text-rose-400`,`bg-rose-500/10`,`px-2`,`py-0.5`,`rounded`,`border`,`border-rose-500/20`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`text-slate-400`,`absolute`,`left-3.5`,`top-1/2`,`-translate-y-1/2`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z`],[`type`,`text`,`placeholder`,`Buscar obreiro substituto...`,1,`w-full`,`pl-10`,`pr-4`,`py-2`,`bg-slate-950/80`,`border`,`border-slate-700/60`,`rounded-xl`,`text-xs`,`sm:text-sm`,`text-slate-100`,`placeholder-slate-500`,`focus:outline-none`,`focus:border-amber-500`,`transition-all`,3,`ngModelChange`,`ngModel`],[1,`flex-1`,`overflow-y-auto`,`space-y-2`,`max-h-64`,`pr-1`],[1,`py-8`,`text-center`,`text-xs`,`text-slate-500`],[1,`p-3`,`rounded-xl`,`border`,`flex`,`items-center`,`justify-between`,`gap-3`,`cursor-pointer`,`transition-all`,3,`class`],[1,`pt-3`,`border-t`,`border-slate-800`,`flex`,`items-center`,`justify-end`,`gap-2`],[`type`,`button`,1,`px-4`,`py-2`,`rounded-xl`,`text-xs`,`font-semibold`,`text-slate-400`,`hover:text-white`,`bg-slate-800`,`hover:bg-slate-700`,`transition-colors`,3,`click`],[`type`,`button`,1,`px-4`,`py-2`,`rounded-xl`,`text-xs`,`font-bold`,`text-slate-900`,`bg-amber-400`,`hover:bg-amber-300`,`disabled:opacity-50`,`disabled:cursor-not-allowed`,`shadow-md`,`transition-all`,`flex`,`items-center`,`gap-1.5`,3,`click`,`disabled`],[1,`p-3`,`rounded-xl`,`border`,`flex`,`items-center`,`justify-between`,`gap-3`,`cursor-pointer`,`transition-all`,3,`click`],[1,`w-8`,`h-8`,`rounded-lg`,`bg-slate-800`,`border`,`border-slate-700`,`flex`,`items-center`,`justify-center`,`font-bold`,`text-xs`,`text-indigo-400`,`shrink-0`],[1,`text-xs`,`sm:text-sm`,`font-bold`,`text-white`,`truncate`],[1,`flex`,`items-center`,`gap-1.5`,`text-[10px]`,`text-slate-400`,`mt-0.5`,`flex-wrap`],[1,`shrink-0`],[1,`text-[9px]`,`font-bold`,`px-2`,`py-0.5`,`rounded`,`bg-rose-500/15`,`text-rose-300`,`border`,`border-rose-500/30`,`flex`,`items-center`,`gap-1`,3,`title`],[1,`text-[9px]`,`font-bold`,`px-2`,`py-0.5`,`rounded`,`bg-emerald-500/15`,`text-emerald-300`,`border`,`border-emerald-500/30`]],template:function(e,n){e&1&&(Gs(0,`div`,0)(1,`div`,1)(2,`div`)(3,`h1`,2)(4,`span`),yI(5,`Escalas & Presença`),Sl(),Gs(6,`span`,3),yI(7),Sl()(),Gs(8,`p`,4),yI(9,`Organização de equipes por culto e controle de check-in / presença`),Sl()(),Gs(10,`div`,5)(11,`div`,6)(12,`button`,7),Tg(`click`,function(){return n.isPdfMenuOpen=!n.isPdfMenuOpen}),zf(),Gs(13,`svg`,8),_g(14,`path`,9),Sl(),Kf(),Gs(15,`span`),yI(16,`Exportar PDF`),Sl(),zf(),Gs(17,`svg`,10),_g(18,`path`,11),Sl()(),MD(19,tt,11,0,`div`,12),Sl(),MD(20,nt,3,0,`a`,13),Sl()(),Kf(),Gs(21,`div`,14)(22,`div`,15)(23,`button`,16),Tg(`click`,function(){return n.viewMode=`eventos`}),yI(24,` Por Eventos / Cultos `),Sl(),Gs(25,`button`,16),Tg(`click`,function(){return n.viewMode=`obreiros`}),yI(26,` Por Obreiros `),Sl()(),Gs(27,`div`,17)(28,`label`,18),yI(29,`Mês:`),Sl(),Gs(30,`select`,19),Tg(`ngModelChange`,function(d){return n.onMesChange(+d)}),Gs(31,`option`,20),yI(32,`Todos os Meses`),Sl(),LD(33,it,2,2,`option`,20,Ze),Sl(),y_(),Sl()(),MD(35,vt,14,2,`div`,21)(36,Lt,14,1,`div`,21),Gs(37,`app-escala-modal`,22),Tg(`save`,function(d){return n.handleSave(d)})(`close`,function(){return n.closeModal()}),Sl(),Gs(38,`app-confirm-modal`,23),Tg(`confirm`,function(){return n.handleDelete()})(`cancel`,function(){return n.closeConfirm()}),Sl(),MD(39,jt,39,9,`div`,24),Sl()),e&2&&(Tb(7),Nl(` `,n.filteredEscalas().length,` escalados `),Tb(10),Rg(`rotate-180`,n.isPdfMenuOpen),Tb(2),RD(n.isPdfMenuOpen?19:-1),Tb(),RD(n.authService.isAdmin()?20:-1),Tb(3),sI(n.viewMode===`eventos`?`bg-indigo-600 text-white font-bold shadow`:`text-slate-400 hover:text-slate-200`),Tb(2),sI(n.viewMode===`obreiros`?`bg-indigo-600 text-white font-bold shadow`:`text-slate-400 hover:text-slate-200`),Tb(5),bg(`ngModel`,n.selectedMesId()),w_(),Tb(),bg(`value`,0),Tb(2),FD(n.mesService.meses()),Tb(2),RD(n.viewMode===`eventos`?35:36),Tb(2),bg(`isOpen`,n.isModalOpen)(`meses`,n.mesService.meses())(`eventos`,n.eventoService.eventos())(`obreiros`,n.obreiroService.obreiros())(`bloqueios`,n.bloqueioService.bloqueios())(`escalas`,n.escalaService.escalas())(`defaultMesId`,n.selectedMesId()>0?n.selectedMesId():null)(`defaultEventoId`,n.selectedEventoId)(`loading`,n.escalaService.loading()),Tb(),bg(`isOpen`,n.isConfirmOpen)(`message`,`Tem certeza que deseja desescalar `+(n.selectedEscala?.obreiros?.nome||`este obreiro`)+` deste evento?`),Tb(),RD(n.isSubstituirModalOpen&&n.selectedEscalaParaSubstituir()?39:-1))},dependencies:[PC,Hn,Gn,Bn,Xe$1,Vt$1,Pn,ln,pa,tn,le,w,OC],encapsulation:2})};export{Oe as EscalasListComponent};
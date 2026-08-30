import{B as Kf,Ct as Ug,D as Hg,Dt as VI,Et as VC,I as Js,Jt as _g,K as Lf,Kn as tv,Mn as mD,O as Hh,Ot as Vg,P as Jf,R as KI,S as GD,T as H,Tt as V,U as LD,Ut as ZD,X as Ml,Z as Nb,Zt as _t$1,an as dI,at as PI,bt as UD,en as b_,f as D_,gt as Sg,hn as go,jt as WI,m as Dg,mt as S,nr as xl,nt as Og,ot as Pf,qt as _I,s as BD,v as FD,yt as UC,zt as Y}from"./chunk-B22FJM3N.js";import{i as pa,o as tn,r as K,t as m}from"./main-BVMA5IKZ.js";import{t as w}from"./chunk-HPsu8fCX.js";import{h as fn,l as Xe$1,n as Bn,p as bt$1,s as Wn,t as $n,x as zn}from"./chunk--jJmPfEN.js";import{t as o}from"./chunk-uz4g6ehC.js";import{t as q}from"./chunk-c9xMJHsF.js";import{r as t,t as b}from"./chunk-DYullDaB.js";import{i as p,n as h,r as l}from"./chunk-KVVqjTAM.js";import{t as h$1}from"./chunk-BnD6-m8l.js";import{t as f}from"./chunk-D_XZhipE.js";import{t as f$1}from"./chunk-BrvFEAHr.js";var se=class a{getDiaSemanaFromData(t){if(!t)return``;let e=t.split(`-`);return o[new Date(Number(e[0]),Number(e[1])-1,Number(e[2])).getDay()+1]||``}formatDateBR(t){if(!t)return``;let e=t.split(`-`);return e.length===3?`${e[2]}/${e[1]}/${e[0]}`:t}agruparEventosPorSemana(t){if(!t||t.length===0)return[];let e=new Map;for(let r of t){if(!r.data)continue;let d=r.data.split(`-`),b=new Date(Number(d[0]),Number(d[1])-1,Number(d[2])),f=b.getDay(),h=new Date(b);h.setDate(b.getDate()-f);let E=new Date(h);E.setDate(h.getDate()+6);let m=h.toISOString().split(`T`)[0],S=`${String(h.getDate()).padStart(2,`0`)}/${String(h.getMonth()+1).padStart(2,`0`)}`,p=`${String(E.getDate()).padStart(2,`0`)}/${String(E.getMonth()+1).padStart(2,`0`)}`;e.has(m)||e.set(m,{startFmt:S,endFmt:p,startKey:m,eventos:[]}),e.get(m).eventos.push(r)}return Array.from(e.values()).sort((r,d)=>r.startKey.localeCompare(d.startKey)).map((r,d)=>({titulo:`SEMANA ${d+1} (${r.startFmt} a ${r.endFmt})`,eventos:r.eventos.sort((b,f)=>{let h=(b.data||``).localeCompare(f.data||``);return h!==0?h:(b.turno||0)-(f.turno||0)})}))}openPrintWindow(t,e){let n=window.open(``,`_blank`,`width=1000,height=800`);if(!n){alert(`Por favor, permita pop-ups para gerar o PDF da escala.`);return}`${document.baseURI}`;let d=`
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
    `;this.openPrintWindow(`ADTAG_Escala_${d.replace(`/`,`_`)}_Por_Obreiros`,S)}static ɵfac=function(e){return new(e||a)};static ɵprov=H({token:a,factory:a.ɵfac,providedIn:`root`})};var Pe=(a,t)=>t.id_mes;var Ae=(a,t)=>t.id_evento;var je=(a,t)=>t.id_obreiro;function Be(a,t){if(a&1&&(Js(0,`option`,12),_I(1),xl()),a&2){let e=t.$implicit,n=ZD(2);_g(`value`,e.id_mes),Nb(),Ug(n.formatMesReferencia(e))}}function qe(a,t){if(a&1&&(Js(0,`option`,12),_I(1),VI(2,`date`),xl()),a&2){let e=t.$implicit,n=ZD(2);_g(`value`,e.id_evento),Nb(),Hg(` `,WI(2,4,e.data,`dd/MM`),` • `,e.descricao||`Culto`,` (`,n.getTurnoLabel(e.turno),`) `)}}function Re(a,t){if(a&1&&(Js(0,`div`,13)(1,`div`,25)(2,`span`,26),_I(3),xl(),Js(4,`span`,27),_I(5,`•`),xl(),Js(6,`span`,28),_I(7),VI(8,`date`),xl(),Js(9,`span`,27),_I(10,`•`),xl(),Js(11,`span`,29),_I(12),xl()(),Js(13,`span`,30),_I(14),xl()()),a&2){let e=ZD(2);Nb(3),Ug(e.currentEvento()?.descricao||`Culto`),Nb(4),Ug(WI(8,4,e.currentEvento()?.data,`dd/MM/yyyy`)),Nb(5),Ug(e.getTurnoLabel(e.currentEvento()?.turno)),Nb(2),Ml(` 👥 `,e.escaladosNesteEvento().size,` já escalados `)}}function ze(a,t){a&1&&(Js(0,`div`,19),_I(1,` Nenhum obreiro encontrado com este filtro. `),xl())}function Ge(a,t){a&1&&(Js(0,`span`,37),_I(1,`• Líder`),xl())}function He(a,t){a&1&&(Js(0,`span`,38),_I(1,`• Púlpito`),xl())}function Ue(a,t){a&1&&(Js(0,`span`,40),_I(1,` 👥 Já Escalado `),xl())}function Qe(a,t){if(a&1&&(Js(0,`span`,41)(1,`span`),_I(2,`⚠️ Bloqueado`),xl()()),a&2){let e=ZD().$implicit;_g(`title`,e.motivoBloqueio)}}function Je(a,t){a&1&&(Js(0,`span`,42),_I(1,` ✓ Disponível `),xl())}function We(a,t){if(a&1){let e=GD();Js(0,`div`,31),Sg(`click`,function(){let r=Pf(e).$implicit;return Lf(ZD(2).selecionarObreiro(r.id_obreiro,r.isJaEscalado))}),Js(1,`div`,32)(2,`div`,33),_I(3),xl(),Js(4,`div`,34)(5,`h4`,35),_I(6),xl(),Js(7,`div`,36)(8,`span`),_I(9),xl(),LD(10,Ge,2,0,`span`,37),LD(11,He,2,0,`span`,38),xl()()(),Js(12,`div`,39),LD(13,Ue,2,0,`span`,40)(14,Qe,3,1,`span`,41)(15,Je,2,0,`span`,42),xl()()}if(a&2){let e=t.$implicit,n=ZD(2);dI(n.selectedObreiroId()===e.id_obreiro?`bg-indigo-500/15 border-indigo-500/50 shadow`:`bg-slate-950/60 border-slate-800/80 hover:border-slate-700`),Og(`opacity-50`,e.isJaEscalado)(`cursor-not-allowed`,e.isJaEscalado)(`cursor-pointer`,!e.isJaEscalado),Nb(3),Ml(` `,n.getInitials(e.nome),` `),Nb(3),Ug(e.nome),Nb(3),Ug(e.diacono?`Diácono`:`Obreiro`),Nb(),FD(e.lider?10:-1),Nb(),FD(e.pulpito?11:-1),Nb(2),FD(e.isJaEscalado?13:e.isBloqueado?14:15)}}function Ke(a,t){a&1&&Dg(0,`span`,24)}function Ye(a,t){if(a&1){let e=GD();Js(0,`div`,0)(1,`div`,1),Sg(`click`,function(r){return r.stopPropagation()}),Js(2,`div`,2)(3,`div`,3)(4,`div`,4),_I(5,` ➕ `),xl(),Js(6,`div`)(7,`h3`,5),_I(8,`Escalar Obreiro`),xl(),Js(9,`p`,6),_I(10,`Selecione quem irá servir na escala deste culto`),xl()()(),Js(11,`button`,7),Sg(`click`,function(){Pf(e);return Lf(ZD().onCancel())}),_I(12,` ✕ `),xl()(),Js(13,`div`,8)(14,`div`,9)(15,`div`)(16,`label`,10),_I(17,`Mês de Referência`),xl(),Js(18,`select`,11),Sg(`ngModelChange`,function(r){Pf(e);return Lf(ZD().onMesSelect(r))}),BD(19,Be,2,2,`option`,12,Pe),xl(),b_(),xl(),Js(21,`div`)(22,`label`,10),_I(23,`Culto / Evento`),xl(),Js(24,`select`,11),Sg(`ngModelChange`,function(r){Pf(e);return Lf(ZD().onEventoSelect(r))}),BD(25,qe,3,7,`option`,12,Ae),xl(),b_(),xl()(),LD(27,Re,15,7,`div`,13),xl(),Js(28,`div`,14),Kf(),Js(29,`svg`,15),Dg(30,`path`,16),xl(),Jf(),Js(31,`input`,17),Sg(`ngModelChange`,function(r){Pf(e);return Lf(ZD().searchQuery.set(r))}),xl(),b_(),xl(),Js(32,`div`,18),LD(33,ze,2,0,`div`,19),BD(34,We,16,14,`div`,20,je),xl(),Js(36,`div`,21)(37,`button`,22),Sg(`click`,function(){Pf(e);return Lf(ZD().onCancel())}),_I(38,` Cancelar `),xl(),Js(39,`button`,23),Sg(`click`,function(){Pf(e);return Lf(ZD().onSubmit())}),LD(40,Ke,1,0,`span`,24),Js(41,`span`),_I(42,`Adicionar à Escala`),xl()()()()()}if(a&2){let e=ZD();Nb(18),_g(`ngModel`,e.selectedMesId()),D_(),Nb(),UD(e.mesesData()),Nb(5),_g(`ngModel`,e.selectedEventoId()),D_(),Nb(),UD(e.filteredEventos()),Nb(2),FD(e.currentEvento()?27:-1),Nb(4),_g(`ngModel`,e.searchQuery()),D_(),Nb(2),FD(e.candidatosObreiros().length===0?33:-1),Nb(),UD(e.candidatosObreiros()),Nb(5),_g(`disabled`,!e.selectedObreiroId()||e.loading),Nb(),FD(e.loading?40:-1)}}var le=class a{isOpen=!1;meses=[];eventos=[];obreiros=[];bloqueios=[];escalas=[];defaultMesId=null;defaultEventoId=null;loading=!1;save=new _t$1;close=new _t$1;formatMesReferencia=l;TURNO_LABELS=t;TURNO_COLORS=b;escalasData=go([]);obreirosData=go([]);bloqueiosData=go([]);eventosData=go([]);mesesData=go([]);selectedMesId=go(null);selectedEventoId=go(null);selectedObreiroId=go(null);searchQuery=go(``);ngOnChanges(t){if(t.escalas&&this.escalasData.set(this.escalas||[]),t.obreiros&&this.obreirosData.set(this.obreiros||[]),t.bloqueios&&this.bloqueiosData.set(this.bloqueios||[]),t.eventos&&this.eventosData.set(this.eventos||[]),t.meses&&this.mesesData.set(this.meses||[]),t.isOpen&&this.isOpen){this.escalasData.set(this.escalas||[]),this.obreirosData.set(this.obreiros||[]),this.bloqueiosData.set(this.bloqueios||[]),this.eventosData.set(this.eventos||[]),this.mesesData.set(this.meses||[]);let e=this.defaultMesId||this.meses[0]?.id_mes||null;this.selectedMesId.set(e);let n=this.defaultEventoId||this.eventos.find(r=>!e||r.id_mes===e)?.id_evento||this.eventos[0]?.id_evento||null;this.selectedEventoId.set(n),this.selectedObreiroId.set(null),this.searchQuery.set(``)}else(t.defaultEventoId||t.defaultMesId)&&(this.defaultMesId&&this.selectedMesId.set(this.defaultMesId),this.defaultEventoId&&this.selectedEventoId.set(this.defaultEventoId))}filteredEventos=KI(()=>{let t=this.selectedMesId(),e=this.eventosData();return t?e.filter(n=>n.id_mes===t).sort((n,r)=>{let d=(n.data||``).localeCompare(r.data||``);return d!==0?d:(n.turno||0)-(r.turno||0)}):e});currentEvento=KI(()=>{let t=this.selectedEventoId();return t&&this.eventosData().find(e=>e.id_evento===t)||null});escaladosNesteEvento=KI(()=>{let t=this.selectedEventoId();return t?new Set(this.escalasData().filter(e=>e.id_evento===t).map(e=>e.id_obreiro).filter(e=>typeof e==`number`)):new Set});candidatosObreiros=KI(()=>{let t=this.currentEvento(),e=this.searchQuery().toLowerCase().trim(),n=t?.data,r=t?.turno,d=this.escaladosNesteEvento(),b=this.bloqueiosData();return this.obreirosData().filter(f=>typeof f.id_obreiro==`number`&&!!f.ativo).map(f=>{let h=d.has(f.id_obreiro),E=!1,m=``;if(n){let S=b.find(p=>p.id_obreiro===f.id_obreiro&&p.data===n&&(p.turno===r||p.turno===4||p.turno===0));S&&(E=!0,m=S.motivo||`Indisponibilidade informada`)}return Y(V({},f),{isJaEscalado:h,isBloqueado:E,motivoBloqueio:m})}).filter(f=>e?f.nome.toLowerCase().includes(e)||f.apelido&&f.apelido.toLowerCase().includes(e):!0).sort((f,h)=>f.isJaEscalado!==h.isJaEscalado?f.isJaEscalado?1:-1:f.isBloqueado!==h.isBloqueado?f.isBloqueado?1:-1:f.nome.localeCompare(h.nome))});getInitials(t){if(!t)return`OB`;let e=t.trim().split(/\s+/);return e.length>=2?(e[0][0]+e[e.length-1][0]).toUpperCase():t.slice(0,2).toUpperCase()}getTurnoLabel(t$2){return t$2&&t[t$2]||`Culto`}onMesSelect(t){let e=Number(t);this.selectedMesId.set(e);let n=this.eventos.filter(r=>r.id_mes===e);n.length>0?this.selectedEventoId.set(n[0].id_evento||null):this.selectedEventoId.set(null),this.selectedObreiroId.set(null)}onEventoSelect(t){this.selectedEventoId.set(Number(t)),this.selectedObreiroId.set(null)}selecionarObreiro(t,e){e||this.selectedObreiroId.set(t)}onSubmit(){let t=this.selectedMesId(),e=this.selectedEventoId(),n=this.selectedObreiroId();t&&e&&n&&this.save.emit({id_mes:t,id_evento:e,id_obreiro:n})}onCancel(){this.close.emit()}static ɵfac=function(e){return new(e||a)};static ɵcmp=mD({type:a,selectors:[[`app-escala-modal`]],inputs:{isOpen:`isOpen`,meses:`meses`,eventos:`eventos`,obreiros:`obreiros`,bloqueios:`bloqueios`,escalas:`escalas`,defaultMesId:`defaultMesId`,defaultEventoId:`defaultEventoId`,loading:`loading`},outputs:{save:`save`,close:`close`},features:[Hh],decls:1,vars:1,consts:[[1,`fixed`,`inset-0`,`z-50`,`overflow-y-auto`,`bg-black/80`,`backdrop-blur-sm`,`flex`,`items-end`,`sm:items-center`,`justify-center`,`p-0`,`sm:p-4`,`animate-fade-in`],[1,`glass-panel`,`w-full`,`sm:max-w-lg`,`rounded-t-3xl`,`sm:rounded-3xl`,`border`,`border-slate-700/80`,`bg-slate-900/95`,`shadow-2xl`,`p-5`,`sm:p-6`,`space-y-4`,`max-h-[88vh]`,`flex`,`flex-col`,3,`click`],[1,`flex`,`items-start`,`justify-between`,`gap-3`,`border-b`,`border-slate-800`,`pb-3.5`],[1,`flex`,`items-center`,`gap-3`],[1,`w-10`,`h-10`,`rounded-xl`,`bg-indigo-500/10`,`border`,`border-indigo-500/20`,`text-indigo-400`,`flex`,`items-center`,`justify-center`,`text-lg`,`font-bold`,`shrink-0`],[1,`text-base`,`font-bold`,`text-white`],[1,`text-xs`,`text-slate-400`,`mt-0.5`],[`type`,`button`,1,`p-1.5`,`rounded-lg`,`text-slate-400`,`hover:text-white`,`hover:bg-slate-800`,`transition-colors`,3,`click`],[1,`bg-slate-950/80`,`border`,`border-slate-800`,`rounded-2xl`,`p-3.5`,`space-y-2.5`],[1,`grid`,`grid-cols-1`,`sm:grid-cols-2`,`gap-2`],[1,`block`,`text-[10px]`,`uppercase`,`font-bold`,`text-slate-400`,`mb-1`],[1,`w-full`,`px-3`,`py-1.5`,`bg-slate-900`,`border`,`border-slate-700/70`,`rounded-xl`,`text-xs`,`text-slate-100`,`focus:outline-none`,`focus:border-indigo-500`,`transition-all`,3,`ngModelChange`,`ngModel`],[3,`value`],[1,`flex`,`items-center`,`justify-between`,`text-xs`,`text-slate-400`,`pt-2`,`border-t`,`border-slate-800/80`,`flex-wrap`,`gap-2`],[1,`relative`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`text-slate-400`,`absolute`,`left-3.5`,`top-1/2`,`-translate-y-1/2`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z`],[`type`,`text`,`placeholder`,`Buscar obreiro para escalar...`,1,`w-full`,`pl-10`,`pr-4`,`py-2`,`bg-slate-950/80`,`border`,`border-slate-700/60`,`rounded-xl`,`text-xs`,`sm:text-sm`,`text-slate-100`,`placeholder-slate-500`,`focus:outline-none`,`focus:border-indigo-500`,`transition-all`,3,`ngModelChange`,`ngModel`],[1,`flex-1`,`overflow-y-auto`,`space-y-2`,`max-h-60`,`sm:max-h-64`,`pr-1`],[1,`py-8`,`text-center`,`text-xs`,`text-slate-500`],[1,`p-3`,`rounded-xl`,`border`,`flex`,`items-center`,`justify-between`,`gap-3`,`transition-all`,3,`opacity-50`,`cursor-not-allowed`,`cursor-pointer`,`class`],[1,`pt-3`,`border-t`,`border-slate-800`,`flex`,`items-center`,`justify-end`,`gap-2`],[`type`,`button`,1,`px-4`,`py-2`,`rounded-xl`,`text-xs`,`font-semibold`,`text-slate-400`,`hover:text-white`,`bg-slate-800`,`hover:bg-slate-700`,`transition-colors`,3,`click`],[`type`,`button`,1,`px-5`,`py-2`,`rounded-xl`,`text-xs`,`font-bold`,`text-white`,`bg-indigo-600`,`hover:bg-indigo-500`,`disabled:opacity-50`,`disabled:cursor-not-allowed`,`shadow-md`,`shadow-indigo-600/30`,`transition-all`,`flex`,`items-center`,`gap-2`,3,`click`,`disabled`],[1,`w-3.5`,`h-3.5`,`border-2`,`border-white/20`,`border-t-white`,`rounded-full`,`animate-spin`],[1,`flex`,`items-center`,`gap-2`],[1,`font-bold`,`text-slate-200`],[1,`text-slate-600`],[1,`text-indigo-400`,`font-semibold`],[1,`text-slate-300`],[1,`text-[11px]`,`font-semibold`,`text-slate-400`,`bg-slate-900`,`px-2`,`py-0.5`,`rounded`,`border`,`border-slate-800`],[1,`p-3`,`rounded-xl`,`border`,`flex`,`items-center`,`justify-between`,`gap-3`,`transition-all`,3,`click`],[1,`flex`,`items-center`,`gap-2.5`,`min-w-0`],[1,`w-8`,`h-8`,`rounded-lg`,`bg-slate-800`,`border`,`border-slate-700`,`flex`,`items-center`,`justify-center`,`font-bold`,`text-xs`,`text-indigo-400`,`shrink-0`],[1,`min-w-0`],[1,`text-xs`,`sm:text-sm`,`font-bold`,`text-white`,`truncate`],[1,`flex`,`items-center`,`gap-1.5`,`text-[10px]`,`text-slate-400`,`mt-0.5`,`flex-wrap`],[1,`text-amber-400`,`font-semibold`],[1,`text-purple-400`,`font-semibold`],[1,`shrink-0`],[1,`text-[9px]`,`font-bold`,`px-2`,`py-0.5`,`rounded`,`bg-slate-800`,`text-slate-400`,`border`,`border-slate-700`],[1,`text-[9px]`,`font-bold`,`px-2`,`py-0.5`,`rounded`,`bg-rose-500/15`,`text-rose-300`,`border`,`border-rose-500/30`,`flex`,`items-center`,`gap-1`,3,`title`],[1,`text-[9px]`,`font-bold`,`px-2`,`py-0.5`,`rounded`,`bg-emerald-500/15`,`text-emerald-300`,`border`,`border-emerald-500/30`]],template:function(e,n){e&1&&LD(0,Ye,43,7,`div`,0),e&2&&FD(n.isOpen?0:-1)},dependencies:[VC,zn,Wn,$n,Xe$1,bt$1,Bn,fn,UC],encapsulation:2})};var Xe=a=>[`/eventos`,a,`operacao`];var Ze=(a,t)=>t.id_mes;var et=(a,t)=>t.id_evento;var Le=(a,t)=>t.id_escala;var Fe=(a,t)=>t.id_obreiro;function tt(a,t){if(a&1){let e=GD();Js(0,`div`,25),Sg(`click`,function(r){return r.stopPropagation()}),Js(1,`button`,26),Sg(`click`,function(){Pf(e);return Lf(ZD().exportarPdfPorEventos())}),Kf(),Js(2,`svg`,27),Dg(3,`path`,28),xl(),Jf(),Js(4,`span`),_I(5,`Escala por Cultos / Eventos`),xl()(),Js(6,`button`,26),Sg(`click`,function(){Pf(e);return Lf(ZD().exportarPdfPorObreiros())}),Kf(),Js(7,`svg`,27),Dg(8,`path`,29),xl(),Jf(),Js(9,`span`),_I(10,`Escala por Obreiros`),xl()()()}}function nt(a,t){a&1&&(Js(0,`a`,13)(1,`span`),_I(2,`⚡ Gerar Automática`),xl()())}function it(a,t){if(a&1&&(Js(0,`option`,20),_I(1),xl()),a&2){let e=t.$implicit,n=ZD();_g(`value`,e.id_mes),Nb(),Ug(n.formatMesReferencia(e))}}function ot(a,t){a&1&&(Js(0,`div`,35)(1,`div`,37),Kf(),Js(2,`svg`,38),Dg(3,`path`,39),xl()(),Jf(),Js(4,`h3`,40),_I(5,`Nenhum evento encontrado`),xl(),Js(6,`p`,41),_I(7,`Cadastre eventos ou selecione outro mês no filtro superior.`),xl()())}function at(a,t){if(a&1&&(Js(0,`span`,46),_I(1),xl()),a&2){let e=ZD().$implicit,n=ZD(2);Nb(),Ml(` `,n.formatMesReferencia(e.mes),` `)}}function rt(a,t){if(a&1&&(Js(0,`span`,59),_I(1),xl()),a&2){let e=ZD(2).$implicit,n=ZD(2);Nb(),Ml(`(`,n.getCheckinStats(e.id_evento).faltas,` ausente)`)}}function st(a,t){if(a&1&&(Js(0,`div`,50)(1,`span`,57),_I(2,`Presença:`),xl(),Js(3,`span`,58),_I(4),xl(),LD(5,rt,2,1,`span`,59),xl()),a&2){let e=ZD().$implicit,n=ZD(2);Nb(4),Vg(` `,n.getCheckinStats(e.id_evento).presentes,`/`,n.getEscaladosByEvent(e.id_evento).length,` `),Nb(),FD(n.getCheckinStats(e.id_evento).faltas>0?5:-1)}}function lt(a,t){if(a&1){let e=GD();Js(0,`button`,60),Sg(`click`,function(){Pf(e);let r=ZD().$implicit;return Lf(ZD(2).openAddModal(r.id_evento,r.id_mes))}),Kf(),Js(1,`svg`,61),Dg(2,`path`,62),xl(),Jf(),Js(3,`span`),_I(4,`Escalar`),xl()()}}function dt(a,t){if(a&1){let e=GD();Js(0,`div`,63),Sg(`click`,function(){Pf(e);let r=ZD().$implicit;return Lf(ZD(2).toggleEventoExpand(r.id_evento))}),Js(1,`div`,17)(2,`span`,64),_I(3),xl()(),Js(4,`span`,65),_I(5,`Ver escalados ▸`),xl()()}if(a&2){let e=ZD().$implicit,n=ZD(2);Nb(3),Ml(`👥 `,n.getEscaladosByEvent(e.id_evento).length,` obreiro(s) escalado(s)`)}}function ct(a,t){a&1&&(Js(0,`div`,66),_I(1,` Nenhum obreiro escalado neste evento ainda. `),xl())}function mt(a,t){a&1&&(Js(0,`span`,75),_I(1,`• Púlpito`),xl())}function pt(a,t){a&1&&(Js(0,`span`,76),_I(1,`• Líder`),xl())}function ut(a,t){if(a&1){let e=GD();Js(0,`div`,77)(1,`button`,84),Sg(`click`,function(){Pf(e);let r=ZD().$implicit;return Lf(ZD(5).openSubstituirModal(r))}),Kf(),Js(2,`svg`,61),Dg(3,`path`,85),xl()(),Jf(),Js(4,`button`,86),Sg(`click`,function(){Pf(e);let r=ZD().$implicit;return Lf(ZD(5).confirmDeleteEscala(r))}),Kf(),Js(5,`svg`,61),Dg(6,`path`,87),xl()()()}}function xt(a,t){if(a&1){let e=GD();Js(0,`div`,68)(1,`div`,69)(2,`div`,70)(3,`div`,71),_I(4),xl(),Js(5,`div`,72)(6,`div`,73),_I(7),xl(),Js(8,`div`,74)(9,`span`),_I(10),xl(),LD(11,mt,2,0,`span`,75),LD(12,pt,2,0,`span`,76),xl()()(),LD(13,ut,7,0,`div`,77),xl(),Js(14,`div`,78)(15,`div`,79)(16,`button`,80),Sg(`click`,function(){let r=Pf(e).$implicit;return Lf(ZD(5).toggleCheckin(r,r.checkin===!0?null:!0))}),Js(17,`span`,81),_I(18,`✓`),xl(),Js(19,`span`),_I(20,`Presente`),xl()(),Js(21,`button`,82),Sg(`click`,function(){let r=Pf(e).$implicit;return Lf(ZD(5).toggleCheckin(r,r.checkin===!1?null:!1))}),Js(22,`span`,83),_I(23,`✕`),xl(),Js(24,`span`),_I(25,`Falta`),xl()()()()()}if(a&2){let e=t.$implicit,n=ZD(5);Nb(4),Ml(` `,n.getInitials(e.obreiros?.nome),` `),Nb(2),_g(`title`,e.obreiros?.nome),Nb(),Ml(` `,e.obreiros?.nome,` `),Nb(3),Ug(e.obreiros?.diacono?`Diácono`:`Obreiro`),Nb(),FD(e.obreiros?.pulpito?11:-1),Nb(),FD(e.obreiros?.lider?12:-1),Nb(),FD(n.authService.canManageEscalas()?13:-1),Nb(3),dI(e.checkin===!0?`bg-emerald-500/25 text-emerald-300 border-emerald-500/40 shadow-sm font-bold`:`text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60 border-transparent`),Nb(5),dI(e.checkin===!1?`bg-rose-500/25 text-rose-300 border-rose-500/40 shadow-sm font-bold`:`text-slate-400 hover:text-rose-300 hover:bg-slate-800/60 border-transparent`)}}function _t(a,t){if(a&1&&(Js(0,`div`,67),BD(1,xt,26,11,`div`,68,Le),xl()),a&2){let e=ZD(2).$implicit,n=ZD(2);Nb(),UD(n.getEscaladosByEvent(e.id_evento))}}function bt(a,t){if(a&1&&(Js(0,`div`,56),LD(1,ct,2,0,`div`,66)(2,_t,3,0,`div`,67),xl()),a&2){let e=ZD().$implicit,n=ZD(2);Nb(),FD(n.getEscaladosByEvent(e.id_evento).length===0?1:2)}}function ft(a,t){if(a&1){let e=GD();Js(0,`div`,36)(1,`div`,42)(2,`div`,43),Sg(`click`,function(){let r=Pf(e).$implicit;return Lf(ZD(2).toggleEventoExpand(r.id_evento))}),Js(3,`div`,44)(4,`span`,45),_I(5),xl(),LD(6,at,2,1,`span`,46),Js(7,`span`,31),_I(8),VI(9,`date`),xl()(),Js(10,`h3`,47)(11,`span`),_I(12),xl(),Kf(),Js(13,`svg`,48),Dg(14,`path`,11),xl()()(),Jf(),Js(15,`div`,49),LD(16,st,6,3,`div`,50),Js(17,`a`,51)(18,`span`),_I(19,`⚙️ Gerenciar`),xl()(),LD(20,lt,5,0,`button`,52),Js(21,`button`,53),Sg(`click`,function(){let r=Pf(e).$implicit;return Lf(ZD(2).toggleEventoExpand(r.id_evento))}),Kf(),Js(22,`svg`,54),Dg(23,`path`,11),xl()()()(),LD(24,dt,6,1,`div`,55),LD(25,bt,3,1,`div`,56),xl()}if(a&2){let e=t.$implicit,n=ZD(2);_g(`id`,`evento-card-`+e.id_evento),Nb(4),dI(n.getTurnoStyle(e.turno).bg+` `+n.getTurnoStyle(e.turno).text+` `+n.getTurnoStyle(e.turno).border),Nb(),Ml(` `,n.getTurnoLabel(e.turno),` `),Nb(),FD(e.mes?6:-1),Nb(2),Ml(` `,WI(9,17,e.data,`dd/MM/yyyy`),` `),Nb(4),Ug(e.descricao||`Culto`),Nb(),Og(`rotate-180`,n.isEventoExpanded(e.id_evento)),Nb(3),FD(n.getEscaladosByEvent(e.id_evento).length>0?16:-1),Nb(),_g(`routerLink`,PI(20,Xe,e.id_evento)),Nb(3),FD(n.authService.canManageEscalas()?20:-1),Nb(),_g(`title`,n.isEventoExpanded(e.id_evento)?`Recolher obreiros`:`Expandir obreiros`),Nb(),Og(`rotate-180`,n.isEventoExpanded(e.id_evento)),Nb(2),FD(n.isEventoExpanded(e.id_evento)?-1:24),Nb(),FD(n.isEventoExpanded(e.id_evento)?25:-1)}}function vt(a,t){if(a&1){let e=GD();Js(0,`div`,21)(1,`div`,30)(2,`span`,31),_I(3),xl(),Js(4,`div`,17)(5,`button`,32),Sg(`click`,function(){Pf(e);return Lf(ZD().expandAllEventos())}),_I(6,` Expandir Todos `),xl(),Js(7,`span`,33),_I(8,`•`),xl(),Js(9,`button`,34),Sg(`click`,function(){Pf(e);return Lf(ZD().collapseAllEventos())}),_I(10,` Recolher Todos `),xl()()(),LD(11,ot,8,0,`div`,35),BD(12,ft,26,22,`div`,36,et),xl()}if(a&2){let e=ZD();Nb(3),Ml(` `,e.filteredEventos().length,` cultos / eventos `),Nb(8),FD(e.filteredEventos().length===0?11:-1),Nb(),UD(e.filteredEventos())}}function gt(a,t){a&1&&(Js(0,`span`,75),_I(1,`• Púlpito`),xl())}function ht(a,t){a&1&&(Js(0,`span`,76),_I(1,`• Líder`),xl())}function Et(a,t){a&1&&(Js(0,`span`,102),_I(1,`Sem escalas`),xl())}function Ct(a,t){if(a&1&&(Js(0,`span`),_I(1),xl()),a&2){let e=ZD(2).$implicit,n=ZD(2);Nb(),Ml(``,n.getEscalasByObreiro(e.id_obreiro).length,` culto(s) escalado(s)`)}}function yt(a,t){if(a&1){let e=GD();Js(0,`div`,100),Sg(`click`,function(){Pf(e);let r=ZD().$implicit;return Lf(ZD(2).toggleObreiroExpand(r.id_obreiro))}),Js(1,`div`,101),LD(2,Et,2,0,`span`,102)(3,Ct,2,1,`span`),xl(),Js(4,`span`,103),_I(5,`Ver escalas ▸`),xl()()}if(a&2){let e=ZD().$implicit,n=ZD(2);Nb(2),FD(n.getEscalasByObreiro(e.id_obreiro).length===0?2:3)}}function St(a,t){a&1&&(Js(0,`p`,104),_I(1,`Nenhuma escala neste período.`),xl())}function wt(a,t){a&1&&(Js(0,`span`,108),_I(1,`✓ Presente`),xl())}function Mt(a,t){a&1&&(Js(0,`span`,109),_I(1,`✕ Falta`),xl())}function kt(a,t){a&1&&(Js(0,`span`,110),_I(1,`⏳ Pendente`),xl())}function Tt(a,t){if(a&1){let e=GD();Js(0,`button`,114),Sg(`click`,function(){Pf(e);let r=ZD().$implicit;return Lf(ZD(4).confirmDeleteEscala(r))}),Kf(),Js(1,`svg`,115),Dg(2,`path`,87),xl()()}}function It(a,t){if(a&1&&(Js(0,`div`,105)(1,`div`,93)(2,`div`,106)(3,`span`,107),_I(4),VI(5,`date`),xl(),LD(6,wt,2,0,`span`,108)(7,Mt,2,0,`span`,109)(8,kt,2,0,`span`,110),xl(),Js(9,`p`,111),_I(10),xl()(),Js(11,`div`,112),LD(12,Tt,3,0,`button`,113),xl()()),a&2){let e=t.$implicit,n=ZD(4);Nb(4),Ug(WI(5,4,e.eventos?.data,`dd/MM`)),Nb(2),FD(e.checkin===!0?6:e.checkin===!1?7:8),Nb(4),Ug(e.eventos?.descricao),Nb(2),FD(n.authService.canManageEscalas()?12:-1)}}function Dt(a,t){if(a&1&&(Js(0,`div`,99),LD(1,St,2,0,`p`,104),BD(2,It,13,7,`div`,105,Le),xl()),a&2){let e=ZD().$implicit,n=ZD(2);Nb(),FD(n.getEscalasByObreiro(e.id_obreiro).length===0?1:-1),Nb(),UD(n.getEscalasByObreiro(e.id_obreiro))}}function Ot(a,t){if(a&1){let e=GD();Js(0,`div`,89)(1,`div`,90),Sg(`click`,function(){let r=Pf(e).$implicit;return Lf(ZD(2).toggleObreiroExpand(r.id_obreiro))}),Js(2,`div`,91)(3,`div`,92),_I(4),xl(),Js(5,`div`,93)(6,`h4`,94)(7,`span`),_I(8),xl(),Kf(),Js(9,`svg`,95),Dg(10,`path`,11),xl()(),Jf(),Js(11,`div`,96)(12,`span`),_I(13),xl(),LD(14,gt,2,0,`span`,75),LD(15,ht,2,0,`span`,76),xl()()(),Js(16,`span`,97),_I(17),xl()(),LD(18,yt,6,1,`div`,98),LD(19,Dt,4,1,`div`,99),xl()}if(a&2){let e=t.$implicit,n=ZD(2);Nb(4),Ml(` `,n.getInitials(e.nome),` `),Nb(4),Ug(e.nome),Nb(),Og(`rotate-180`,n.isObreiroExpanded(e.id_obreiro)),Nb(4),Ug(e.diacono?`Diácono`:`Obreiro`),Nb(),FD(e.pulpito?14:-1),Nb(),FD(e.lider?15:-1),Nb(2),Ml(` `,n.getEscalasByObreiro(e.id_obreiro).length,` escalas `),Nb(),FD(n.isObreiroExpanded(e.id_obreiro)?-1:18),Nb(),FD(n.isObreiroExpanded(e.id_obreiro)?19:-1)}}function Lt(a,t){if(a&1){let e=GD();Js(0,`div`,21)(1,`div`,30)(2,`span`,31),_I(3),xl(),Js(4,`div`,17)(5,`button`,32),Sg(`click`,function(){Pf(e);return Lf(ZD().expandAllObreiros())}),_I(6,` Expandir Todos `),xl(),Js(7,`span`,33),_I(8,`•`),xl(),Js(9,`button`,34),Sg(`click`,function(){Pf(e);return Lf(ZD().collapseAllObreiros())}),_I(10,` Recolher Todos `),xl()()(),Js(11,`div`,88),BD(12,Ot,20,10,`div`,89,Fe),xl()()}if(a&2){let e=ZD();Nb(3),Ml(` `,e.obreiroService.obreiros().length,` obreiros `),Nb(9),UD(e.obreiroService.obreiros())}}function Ft(a,t){a&1&&(Js(0,`div`,131),_I(1,` Nenhum obreiro disponível encontrado com este filtro. `),xl())}function Vt(a,t){a&1&&(Js(0,`span`,76),_I(1,`• Líder`),xl())}function Nt(a,t){a&1&&(Js(0,`span`,75),_I(1,`• Púlpito`),xl())}function $t(a,t){if(a&1&&(Js(0,`span`,141)(1,`span`),_I(2,`⚠️ Bloqueado`),xl()()),a&2){let e=ZD().$implicit;_g(`title`,e.motivoBloqueio)}}function Pt(a,t){a&1&&(Js(0,`span`,142),_I(1,` ✓ Disponível `),xl())}function At(a,t){if(a&1){let e=GD();Js(0,`div`,136),Sg(`click`,function(){let r=Pf(e).$implicit;return Lf(ZD(2).selecionarSubstituto(r.id_obreiro))}),Js(1,`div`,91)(2,`div`,137),_I(3),xl(),Js(4,`div`,93)(5,`h4`,138),_I(6),xl(),Js(7,`div`,139)(8,`span`),_I(9),xl(),LD(10,Vt,2,0,`span`,76),LD(11,Nt,2,0,`span`,75),xl()()(),Js(12,`div`,140),LD(13,$t,3,1,`span`,141)(14,Pt,2,0,`span`,142),xl()()}if(a&2){let e=t.$implicit,n=ZD(2);dI(n.substitutoSelecionadoId()===e.id_obreiro?`bg-amber-500/15 border-amber-500/50 shadow`:`bg-slate-950/60 border-slate-800/80 hover:border-slate-700`),Nb(3),Ml(` `,n.getInitials(e.nome),` `),Nb(3),Ug(e.nome),Nb(3),Ug(e.diacono?`Diácono`:`Obreiro`),Nb(),FD(e.lider?10:-1),Nb(),FD(e.pulpito?11:-1),Nb(2),FD(e.isBloqueado?13:14)}}function jt(a,t){if(a&1){let e=GD();Js(0,`div`,24)(1,`div`,116),Sg(`click`,function(r){return r.stopPropagation()}),Js(2,`div`,117)(3,`div`,118)(4,`div`,119),_I(5,` 🔄 `),xl(),Js(6,`div`)(7,`h3`,40),_I(8,`Substituir Obreiro`),xl(),Js(9,`p`,120),_I(10,`Selecione quem irá assumir esta vaga na escala`),xl()()(),Js(11,`button`,121),Sg(`click`,function(){Pf(e);return Lf(ZD().closeSubstituirModal())}),_I(12,` ✕ `),xl()(),Js(13,`div`,122)(14,`div`,123)(15,`span`),_I(16,`Culto / Evento:`),xl(),Js(17,`span`,124),_I(18),VI(19,`date`),xl()(),Js(20,`div`,125)(21,`span`,57),_I(22,`Substituindo:`),xl(),Js(23,`span`,126),_I(24),xl()()(),Js(25,`div`,6),Kf(),Js(26,`svg`,127),Dg(27,`path`,128),xl(),Jf(),Js(28,`input`,129),Sg(`ngModelChange`,function(r){Pf(e);return Lf(ZD().substitutoSearchQuery.set(r))}),xl(),b_(),xl(),Js(29,`div`,130),LD(30,Ft,2,0,`div`,131),BD(31,At,15,8,`div`,132,Fe),xl(),Js(33,`div`,133)(34,`button`,134),Sg(`click`,function(){Pf(e);return Lf(ZD().closeSubstituirModal())}),_I(35,` Cancelar `),xl(),Js(36,`button`,135),Sg(`click`,function(){Pf(e);return Lf(ZD().confirmarSubstituicao())}),Js(37,`span`),_I(38,`Confirmar Substituição`),xl()()()()()}if(a&2){let e=ZD();Nb(18),Vg(` `,WI(19,6,e.selectedEscalaParaSubstituir()?.eventos?.data,`dd/MM/yyyy`),` • `,e.getTurnoLabel(e.selectedEscalaParaSubstituir()?.eventos?.turno||0),` `),Nb(6),Ml(` `,e.selectedEscalaParaSubstituir()?.obreiros?.nome,` `),Nb(4),_g(`ngModel`,e.substitutoSearchQuery()),D_(),Nb(2),FD(e.candidatosSubstitutos().length===0?30:-1),Nb(),UD(e.candidatosSubstitutos()),Nb(5),_g(`disabled`,!e.substitutoSelecionadoId()||e.escalaService.loading())}}var Oe=class a{authService=S(m);escalaService=S(f);eventoService=S(f$1);obreiroService=S(h$1);mesService=S(h);bloqueioService=S(q);pdfService=S(se);toast=S(tv);route=S(K);formatMesReferencia=l;viewMode=`eventos`;selectedMesId=go(0);selectedEventoId=null;selectedEscala=null;isModalOpen=!1;isConfirmOpen=!1;isPdfMenuOpen=!1;filteredEventos=KI(()=>{let t=this.selectedMesId(),e=this.eventoService.eventos();return[...t===0?e:e.filter(r=>r.id_mes===t)].sort((r,d)=>{let b=(r.data||``).localeCompare(d.data||``);return b!==0?b:(r.turno||0)-(d.turno||0)})});filteredEscalas=KI(()=>{let t=this.selectedMesId(),e=this.escalaService.escalas();return t===0?e:e.filter(n=>n.id_mes===t)});isSubstituirModalOpen=!1;selectedEscalaParaSubstituir=go(null);substitutoSearchQuery=go(``);substitutoSelecionadoId=go(null);candidatosSubstitutos=KI(()=>{let t=this.selectedEscalaParaSubstituir();if(!t)return[];let e=this.obreiroService.obreiros().filter(m=>m.ativo),n=this.bloqueioService.bloqueios(),r=this.substitutoSearchQuery().toLowerCase().trim(),d=t.id_evento,b=t.eventos||this.eventoService.eventos().find(m=>m.id_evento===d),f=b?.data,h=b?.turno,E=new Set(this.filteredEscalas().filter(m=>m.id_evento===d).map(m=>m.id_obreiro));return e.filter(m=>typeof m.id_obreiro==`number`).filter(m=>m.id_obreiro!==t.id_obreiro).filter(m=>!E.has(m.id_obreiro)).map(m=>{let S=!1,p=``;if(f){let F=n.find(I=>I.id_obreiro===m.id_obreiro&&I.data===f&&(I.turno===h||I.turno===4||I.turno===0));F&&(S=!0,p=F.motivo||`Indisponibilidade informada`)}return Y(V({},m),{isBloqueado:S,motivoBloqueio:p})}).filter(m=>r?m.nome.toLowerCase().includes(r)||m.apelido&&m.apelido.toLowerCase().includes(r):!0).sort((m,S)=>m.isBloqueado!==S.isBloqueado?m.isBloqueado?1:-1:m.nome.localeCompare(S.nome))});openSubstituirModal(t){this.selectedEscalaParaSubstituir.set(t),this.substitutoSearchQuery.set(``),this.substitutoSelecionadoId.set(null),this.isSubstituirModalOpen=!0}closeSubstituirModal(){this.isSubstituirModalOpen=!1,this.selectedEscalaParaSubstituir.set(null),this.substitutoSelecionadoId.set(null),this.substitutoSearchQuery.set(``)}selecionarSubstituto(t){t&&this.substitutoSelecionadoId.set(t)}async confirmarSubstituicao(){let t=this.selectedEscalaParaSubstituir(),e=this.substitutoSelecionadoId();if(!t||!t.id_escala||!e)return;await this.escalaService.substituirObreiro(t.id_escala,e)&&this.closeSubstituirModal()}expandedEventos=go(new Set);expandedObreiros=go(new Set);isEventoExpanded(t){return t?this.expandedEventos().has(t):!1}toggleEventoExpand(t){t&&this.expandedEventos.update(e=>{let n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n})}expandAllEventos(){let t=this.filteredEventos().map(e=>e.id_evento).filter(e=>typeof e==`number`);this.expandedEventos.set(new Set(t))}collapseAllEventos(){this.expandedEventos.set(new Set)}isObreiroExpanded(t){return t?this.expandedObreiros().has(t):!1}toggleObreiroExpand(t){t&&this.expandedObreiros.update(e=>{let n=new Set(e);return n.has(t)?n.delete(t):n.add(t),n})}expandAllObreiros(){let t=this.obreiroService.obreiros().map(e=>e.id_obreiro).filter(e=>typeof e==`number`);this.expandedObreiros.set(new Set(t))}collapseAllObreiros(){this.expandedObreiros.set(new Set)}async onMesChange(t){let e=Number(t);this.selectedMesId.set(e),e>0?await this.escalaService.fetchByMes(e):await this.escalaService.fetchAll(),typeof window<`u`&&window.innerWidth<768||this.expandAllEventos(),this.scrollToCurrentOrNextEvento()}async ngOnInit(){this.route.queryParams.subscribe(d=>{if(d.mes){let b=Number(d.mes);isNaN(b)||this.selectedMesId.set(b)}});let[e]=await Promise.all([this.mesService.fetchAll(),this.eventoService.fetchAll(),this.obreiroService.fetchAll(),this.bloqueioService.fetchAll()]);if(this.selectedMesId()===0){let d=p(e);d&&d.id_mes&&this.selectedMesId.set(d.id_mes)}let n=this.selectedMesId();n>0?await this.escalaService.fetchByMes(n):await this.escalaService.fetchAll(),typeof window<`u`&&window.innerWidth<768?(this.collapseAllEventos(),this.collapseAllObreiros()):(this.expandAllEventos(),this.expandAllObreiros()),this.scrollToCurrentOrNextEvento()}scrollToCurrentOrNextEvento(){let t=this.mesService.meses().find(m=>m.id_mes===this.selectedMesId());if(!t)return;let e=new Date;if(!(t.ano_referencia===e.getFullYear()&&t.mes_referencia===e.getMonth()+1))return;let f=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,`0`)}-${String(e.getDate()).padStart(2,`0`)}`,h=this.filteredEventos(),E=h.find(m=>m.data===f);E||(E=h.find(m=>m.data>f)),E&&E.id_evento&&setTimeout(()=>{let m=document.getElementById(`evento-card-${E.id_evento}`);m&&m.scrollIntoView({behavior:`smooth`,block:`start`})},150)}getEscaladosByEvent(t){return this.filteredEscalas().filter(e=>e.id_evento===t)}getEscalasByObreiro(t){return this.filteredEscalas().filter(e=>e.id_obreiro===t)}getCheckinStats(t){let e=this.getEscaladosByEvent(t);return{presentes:e.filter(b=>b.checkin===!0).length,faltas:e.filter(b=>b.checkin===!1).length,pendentes:e.filter(b=>b.checkin===null||b.checkin===void 0).length}}async toggleCheckin(t,e){t.id_escala&&await this.escalaService.updateCheckin(t.id_escala,e)}openAddModal(t,e){this.selectedEventoId=t||null,e&&this.selectedMesId()===0&&this.selectedMesId.set(e),this.isModalOpen=!0}exportarPdfPorEventos(){this.isPdfMenuOpen=!1;let t=this.selectedMesId(),e=this.mesService.meses().find(n=>Number(n.id_mes)===Number(t));if(!e){this.toast.warning(`Selecione um mês`,`Por favor, selecione um mês de referência para exportar o PDF.`);return}this.pdfService.gerarPdfPorEventos(e,this.eventoService.eventos(),this.escalaService.escalas())}exportarPdfPorObreiros(){this.isPdfMenuOpen=!1;let t=this.selectedMesId(),e=this.mesService.meses().find(n=>Number(n.id_mes)===Number(t));if(!e){this.toast.warning(`Selecione um mês`,`Por favor, selecione um mês de referência para exportar o PDF.`);return}this.pdfService.gerarPdfPorObreiros(e,this.eventoService.eventos(),this.escalaService.escalas(),this.obreiroService.obreiros())}getTurnoLabel(t$3){return t[t$3]||`Geral`}getTurnoStyle(t){return b[t]||{bg:`bg-slate-800`,text:`text-slate-300`,border:`border-slate-700`}}getInitials(t){if(!t)return`OB`;let e=t.trim().split(` `);return e.length===1?e[0].substring(0,2).toUpperCase():(e[0][0]+e[e.length-1][0]).toUpperCase()}closeModal(){this.isModalOpen=!1,this.selectedEventoId=null}confirmDeleteEscala(t){this.selectedEscala=t,this.isConfirmOpen=!0}closeConfirm(){this.isConfirmOpen=!1,this.selectedEscala=null}async handleSave(t){await this.escalaService.addObreiroToEvento(t)&&this.closeModal()}async handleDelete(){this.selectedEscala&&this.selectedEscala.id_escala&&await this.escalaService.removeObreiroFromEvento(this.selectedEscala.id_escala)&&this.closeConfirm()}static ɵfac=function(e){return new(e||a)};static ɵcmp=mD({type:a,selectors:[[`app-escalas-list`]],decls:40,vars:24,consts:[[1,`space-y-6`,`animate-fade-in`,`pb-20`,`md:pb-10`],[1,`flex`,`flex-col`,`sm:flex-row`,`sm:items-center`,`justify-between`,`gap-4`],[1,`text-2xl`,`sm:text-3xl`,`font-extrabold`,`text-white`,`tracking-tight`,`flex`,`items-center`,`gap-2.5`],[1,`text-xs`,`px-2.5`,`py-1`,`rounded-full`,`bg-indigo-500/10`,`text-indigo-400`,`border`,`border-indigo-500/20`,`font-semibold`],[1,`text-sm`,`text-slate-400`,`mt-1`],[1,`flex`,`items-center`,`gap-2.5`,`flex-wrap`,`relative`],[1,`relative`],[`type`,`button`,1,`inline-flex`,`items-center`,`justify-center`,`gap-2`,`px-3.5`,`py-2.5`,`rounded-xl`,`bg-slate-800/90`,`hover:bg-slate-700`,`text-slate-200`,`text-sm`,`font-semibold`,`border`,`border-slate-700/80`,`transition-all`,`shadow-md`,3,`click`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`text-rose-400`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-3.5`,`h-3.5`,`text-slate-400`,`transition-transform`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M19 9l-7 7-7-7`],[1,`absolute`,`right-0`,`mt-2`,`w-56`,`bg-slate-900`,`border`,`border-slate-800`,`rounded-xl`,`shadow-2xl`,`p-1.5`,`z-50`,`animate-fade-in`,`space-y-1`],[`routerLink`,`/escalas/gerador`,1,`inline-flex`,`items-center`,`justify-center`,`gap-2`,`px-3.5`,`py-2.5`,`rounded-xl`,`bg-purple-600/20`,`hover:bg-purple-600`,`text-purple-300`,`hover:text-white`,`text-sm`,`font-semibold`,`border`,`border-purple-500/30`,`transition-all`,`shadow-md`],[1,`glass-panel`,`rounded-2xl`,`p-3.5`,`border`,`border-slate-800/80`,`flex`,`flex-col`,`md:flex-row`,`items-stretch`,`md:items-center`,`justify-between`,`gap-3`],[1,`flex`,`items-center`,`p-1`,`bg-slate-900/90`,`border`,`border-slate-800`,`rounded-xl`],[1,`px-3.5`,`py-1.5`,`rounded-lg`,`text-xs`,`font-semibold`,`transition-all`,3,`click`],[1,`flex`,`items-center`,`gap-2`],[1,`text-xs`,`text-slate-400`,`font-semibold`],[1,`px-3`,`py-1.5`,`bg-slate-900/80`,`border`,`border-slate-700/60`,`rounded-xl`,`text-xs`,`text-slate-200`,`focus:outline-none`,`focus:border-indigo-500`,3,`ngModelChange`,`ngModel`],[3,`value`],[1,`space-y-4`],[3,`save`,`close`,`isOpen`,`meses`,`eventos`,`obreiros`,`bloqueios`,`escalas`,`defaultMesId`,`defaultEventoId`,`loading`],[`title`,`Remover da Escala`,3,`confirm`,`cancel`,`isOpen`,`message`],[1,`fixed`,`inset-0`,`z-50`,`overflow-y-auto`,`bg-black/80`,`backdrop-blur-sm`,`flex`,`items-end`,`sm:items-center`,`justify-center`,`p-0`,`sm:p-4`,`animate-fade-in`],[1,`absolute`,`right-0`,`mt-2`,`w-56`,`bg-slate-900`,`border`,`border-slate-800`,`rounded-xl`,`shadow-2xl`,`p-1.5`,`z-50`,`animate-fade-in`,`space-y-1`,3,`click`],[`type`,`button`,1,`w-full`,`text-left`,`px-3`,`py-2`,`rounded-lg`,`text-xs`,`font-semibold`,`text-slate-200`,`hover:bg-indigo-600/20`,`hover:text-indigo-300`,`transition-all`,`flex`,`items-center`,`gap-2`,3,`click`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`text-indigo-400`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z`],[1,`flex`,`items-center`,`justify-between`,`gap-2`,`px-1`],[1,`text-xs`,`font-semibold`,`text-slate-400`],[`type`,`button`,1,`text-[11px]`,`font-semibold`,`text-indigo-400`,`hover:text-indigo-300`,`transition-colors`,3,`click`],[1,`text-slate-600`],[`type`,`button`,1,`text-[11px]`,`font-semibold`,`text-slate-400`,`hover:text-slate-200`,`transition-colors`,3,`click`],[1,`glass-panel`,`rounded-3xl`,`p-12`,`text-center`,`border`,`border-slate-800/80`,`max-w-md`,`mx-auto`,`space-y-3`],[1,`glass-panel`,`rounded-2xl`,`p-4`,`sm:p-5`,`border`,`border-slate-800/80`,`space-y-3.5`,`transition-all`,`shadow-sm`,3,`id`],[1,`w-14`,`h-14`,`rounded-2xl`,`bg-indigo-500/10`,`border`,`border-indigo-500/20`,`text-indigo-400`,`mx-auto`,`flex`,`items-center`,`justify-center`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-7`,`h-7`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`1.5`,`d`,`M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z`],[1,`text-base`,`font-bold`,`text-white`],[1,`text-xs`,`text-slate-400`],[1,`flex`,`flex-col`,`sm:flex-row`,`sm:items-center`,`justify-between`,`gap-3`,`border-b`,`border-slate-800/80`,`pb-3`],[1,`space-y-1`,`cursor-pointer`,`select-none`,`group/evhdr`,`flex-1`,3,`click`],[1,`flex`,`items-center`,`gap-2`,`flex-wrap`],[1,`text-[10px]`,`uppercase`,`font-bold`,`tracking-wider`,`px-2`,`py-0.5`,`rounded-full`,`border`],[1,`text-[10px]`,`font-semibold`,`text-indigo-300`,`bg-indigo-500/10`,`px-2`,`py-0.5`,`rounded-md`,`border`,`border-indigo-500/20`],[1,`text-base`,`font-bold`,`text-white`,`group-hover/evhdr:text-indigo-300`,`transition-colors`,`flex`,`items-center`,`gap-2`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`text-slate-400`,`group-hover/evhdr:text-white`,`transition-transform`,`duration-200`],[1,`flex`,`items-center`,`gap-2`,`sm:gap-3`,`flex-wrap`],[1,`flex`,`items-center`,`gap-2`,`text-xs`,`bg-slate-900/80`,`border`,`border-slate-800`,`px-3`,`py-1.5`,`rounded-xl`],[1,`px-2.5`,`py-1.5`,`rounded-lg`,`bg-indigo-600/20`,`hover:bg-indigo-600`,`text-xs`,`font-bold`,`text-indigo-300`,`hover:text-white`,`border`,`border-indigo-500/30`,`transition-all`,`flex`,`items-center`,`gap-1.5`,3,`routerLink`],[1,`px-3`,`py-1.5`,`rounded-lg`,`bg-slate-800`,`hover:bg-slate-700`,`text-xs`,`font-semibold`,`text-slate-300`,`hover:text-white`,`border`,`border-slate-700`,`transition-all`,`flex`,`items-center`,`gap-1.5`],[`type`,`button`,1,`p-1.5`,`rounded-lg`,`text-slate-400`,`hover:text-white`,`hover:bg-slate-800`,`transition-colors`,3,`click`,`title`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`transition-transform`,`duration-200`],[1,`cursor-pointer`,`flex`,`items-center`,`justify-between`,`gap-2`,`text-xs`,`text-slate-400`,`hover:text-slate-300`,`transition-colors`,`pt-1`],[1,`animate-fade-in`,`pt-1`],[1,`text-slate-400`],[1,`font-bold`,`text-emerald-400`],[1,`text-rose-400`,`text-[11px]`],[1,`px-3`,`py-1.5`,`rounded-lg`,`bg-slate-800`,`hover:bg-slate-700`,`text-xs`,`font-semibold`,`text-slate-300`,`hover:text-white`,`border`,`border-slate-700`,`transition-all`,`flex`,`items-center`,`gap-1.5`,3,`click`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-3.5`,`h-3.5`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M12 4v16m8-8H4`],[1,`cursor-pointer`,`flex`,`items-center`,`justify-between`,`gap-2`,`text-xs`,`text-slate-400`,`hover:text-slate-300`,`transition-colors`,`pt-1`,3,`click`],[1,`font-bold`,`text-indigo-300`],[1,`text-indigo-400`,`font-semibold`,`text-xs`,`shrink-0`],[1,`py-6`,`text-center`,`text-xs`,`text-slate-500`],[1,`grid`,`grid-cols-1`,`sm:grid-cols-2`,`lg:grid-cols-3`,`gap-3`],[1,`bg-slate-900/80`,`border`,`border-slate-800`,`hover:border-slate-700`,`rounded-2xl`,`p-3.5`,`flex`,`flex-col`,`justify-between`,`gap-3`,`group`,`transition-all`,`shadow-sm`],[1,`flex`,`items-start`,`justify-between`,`gap-2.5`],[1,`flex`,`items-center`,`gap-2.5`,`min-w-0`,`flex-1`],[1,`w-9`,`h-9`,`rounded-xl`,`bg-slate-800`,`border`,`border-slate-700`,`flex`,`items-center`,`justify-center`,`font-bold`,`text-xs`,`text-indigo-400`,`shrink-0`],[1,`min-w-0`,`flex-1`],[1,`text-xs`,`sm:text-sm`,`font-bold`,`text-white`,`leading-tight`,`break-words`,3,`title`],[1,`text-[10px]`,`text-slate-400`,`flex`,`items-center`,`gap-1.5`,`flex-wrap`,`mt-0.5`],[1,`text-purple-400`,`font-semibold`],[1,`text-amber-400`,`font-semibold`],[1,`flex`,`items-center`,`gap-1`,`shrink-0`,`pt-0.5`],[1,`pt-2`,`border-t`,`border-slate-800/60`],[1,`flex`,`items-center`,`rounded-xl`,`bg-slate-950/90`,`border`,`border-slate-800/90`,`p-1`,`gap-1`,`shadow-inner`,`w-full`],[`type`,`button`,`title`,`Marcar Presente`,1,`flex-1`,`py-1.5`,`px-2`,`rounded-lg`,`text-xs`,`font-semibold`,`border`,`transition-all`,`flex`,`items-center`,`justify-center`,`gap-1.5`,`active:scale-95`,`touch-manipulation`,`min-h-[32px]`,3,`click`],[1,`text-emerald-400`,`font-bold`,`text-sm`],[`type`,`button`,`title`,`Marcar Falta / Ausente`,1,`flex-1`,`py-1.5`,`px-2`,`rounded-lg`,`text-xs`,`font-semibold`,`border`,`transition-all`,`flex`,`items-center`,`justify-center`,`gap-1.5`,`active:scale-95`,`touch-manipulation`,`min-h-[32px]`,3,`click`],[1,`text-rose-400`,`font-bold`,`text-sm`],[`title`,`Substituir obreiro por outro`,1,`w-8`,`h-8`,`rounded-lg`,`bg-slate-950/70`,`hover:bg-amber-500/15`,`text-slate-400`,`hover:text-amber-300`,`border`,`border-slate-800`,`hover:border-amber-500/30`,`transition-all`,`flex`,`items-center`,`justify-center`,`shrink-0`,`active:scale-95`,`touch-manipulation`,`shadow-sm`,3,`click`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4`],[`title`,`Remover da escala`,1,`w-8`,`h-8`,`rounded-lg`,`bg-slate-950/70`,`hover:bg-rose-500/15`,`text-slate-400`,`hover:text-rose-400`,`border`,`border-slate-800`,`hover:border-rose-500/30`,`transition-all`,`flex`,`items-center`,`justify-center`,`shrink-0`,`active:scale-95`,`touch-manipulation`,`shadow-sm`,3,`click`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16`],[1,`grid`,`grid-cols-1`,`sm:grid-cols-2`,`lg:grid-cols-3`,`gap-4`],[1,`glass-panel`,`rounded-2xl`,`p-4`,`border`,`border-slate-800/80`,`space-y-3`,`transition-all`,`shadow-sm`],[1,`flex`,`items-center`,`justify-between`,`cursor-pointer`,`select-none`,`group/obhdr`,3,`click`],[1,`flex`,`items-center`,`gap-2.5`,`min-w-0`],[1,`w-9`,`h-9`,`rounded-xl`,`bg-slate-800`,`border`,`border-slate-700`,`flex`,`items-center`,`justify-center`,`font-bold`,`text-xs`,`text-indigo-400`,`shrink-0`,`group-hover/obhdr:border-indigo-400`,`transition-colors`],[1,`min-w-0`],[1,`text-sm`,`font-bold`,`text-white`,`group-hover/obhdr:text-indigo-300`,`transition-colors`,`truncate`,`flex`,`items-center`,`gap-1.5`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-3.5`,`h-3.5`,`text-slate-400`,`group-hover/obhdr:text-white`,`transition-transform`,`duration-200`],[1,`text-[10px]`,`text-slate-400`,`flex`,`items-center`,`gap-1`,`flex-wrap`,`mt-0.5`],[1,`text-xs`,`font-extrabold`,`px-2`,`py-0.5`,`rounded-full`,`bg-indigo-500/10`,`text-indigo-400`,`border`,`border-indigo-500/20`,`shrink-0`],[1,`cursor-pointer`,`flex`,`items-center`,`justify-between`,`gap-2`,`text-xs`,`text-slate-400`,`hover:text-slate-300`,`transition-colors`,`pt-1`,`border-t`,`border-slate-800/60`],[1,`space-y-1.5`,`pt-2`,`border-t`,`border-slate-800`,`animate-fade-in`],[1,`cursor-pointer`,`flex`,`items-center`,`justify-between`,`gap-2`,`text-xs`,`text-slate-400`,`hover:text-slate-300`,`transition-colors`,`pt-1`,`border-t`,`border-slate-800/60`,3,`click`],[1,`truncate`,`text-[11px]`],[1,`text-slate-500`,`italic`],[1,`text-indigo-400`,`font-semibold`,`text-[11px]`,`shrink-0`],[1,`text-xs`,`text-slate-500`,`italic`],[1,`text-xs`,`bg-slate-900/60`,`border`,`border-slate-800`,`p-2`,`rounded-lg`,`flex`,`items-center`,`justify-between`,`gap-2`],[1,`flex`,`items-center`,`gap-1.5`],[1,`text-slate-300`,`font-semibold`],[1,`text-[9px]`,`font-bold`,`px-1.5`,`py-0.2`,`rounded`,`bg-emerald-500/15`,`text-emerald-400`,`border`,`border-emerald-500/30`],[1,`text-[9px]`,`font-bold`,`px-1.5`,`py-0.2`,`rounded`,`bg-rose-500/15`,`text-rose-400`,`border`,`border-rose-500/30`],[1,`text-[9px]`,`text-slate-500`,`px-1.5`,`py-0.2`,`rounded`,`bg-slate-800`,`border`,`border-slate-700`],[1,`text-slate-400`,`text-[11px]`,`truncate`],[1,`flex`,`items-center`,`gap-1`,`shrink-0`],[`title`,`Remover da escala`,1,`p-2`,`rounded-lg`,`bg-slate-950/60`,`hover:bg-rose-500/15`,`text-slate-400`,`hover:text-rose-400`,`border`,`border-slate-800`,`hover:border-rose-500/30`,`transition-all`,`min-h-[32px]`,`min-w-[32px]`,`flex`,`items-center`,`justify-center`,`active:scale-95`],[`title`,`Remover da escala`,1,`p-2`,`rounded-lg`,`bg-slate-950/60`,`hover:bg-rose-500/15`,`text-slate-400`,`hover:text-rose-400`,`border`,`border-slate-800`,`hover:border-rose-500/30`,`transition-all`,`min-h-[32px]`,`min-w-[32px]`,`flex`,`items-center`,`justify-center`,`active:scale-95`,3,`click`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`],[1,`glass-panel`,`w-full`,`sm:max-w-lg`,`rounded-t-3xl`,`sm:rounded-3xl`,`border`,`border-slate-700/80`,`bg-slate-900/95`,`shadow-2xl`,`p-5`,`sm:p-6`,`space-y-4`,`max-h-[85vh]`,`flex`,`flex-col`,3,`click`],[1,`flex`,`items-start`,`justify-between`,`gap-3`,`border-b`,`border-slate-800`,`pb-3.5`],[1,`flex`,`items-center`,`gap-3`],[1,`w-10`,`h-10`,`rounded-xl`,`bg-amber-500/10`,`border`,`border-amber-500/20`,`text-amber-400`,`flex`,`items-center`,`justify-center`,`text-lg`,`font-bold`,`shrink-0`],[1,`text-xs`,`text-slate-400`,`mt-0.5`],[1,`p-1.5`,`rounded-lg`,`text-slate-400`,`hover:text-white`,`hover:bg-slate-800`,`transition-colors`,3,`click`],[1,`bg-slate-950/80`,`border`,`border-slate-800`,`rounded-2xl`,`p-3.5`,`space-y-2`],[1,`flex`,`items-center`,`justify-between`,`text-xs`,`text-slate-400`],[1,`font-semibold`,`text-slate-200`],[1,`flex`,`items-center`,`justify-between`,`text-xs`],[1,`font-bold`,`text-rose-400`,`bg-rose-500/10`,`px-2`,`py-0.5`,`rounded`,`border`,`border-rose-500/20`],[`fill`,`none`,`viewBox`,`0 0 24 24`,`stroke`,`currentColor`,1,`w-4`,`h-4`,`text-slate-400`,`absolute`,`left-3.5`,`top-1/2`,`-translate-y-1/2`],[`stroke-linecap`,`round`,`stroke-linejoin`,`round`,`stroke-width`,`2`,`d`,`M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z`],[`type`,`text`,`placeholder`,`Buscar obreiro substituto...`,1,`w-full`,`pl-10`,`pr-4`,`py-2`,`bg-slate-950/80`,`border`,`border-slate-700/60`,`rounded-xl`,`text-xs`,`sm:text-sm`,`text-slate-100`,`placeholder-slate-500`,`focus:outline-none`,`focus:border-amber-500`,`transition-all`,3,`ngModelChange`,`ngModel`],[1,`flex-1`,`overflow-y-auto`,`space-y-2`,`max-h-64`,`pr-1`],[1,`py-8`,`text-center`,`text-xs`,`text-slate-500`],[1,`p-3`,`rounded-xl`,`border`,`flex`,`items-center`,`justify-between`,`gap-3`,`cursor-pointer`,`transition-all`,3,`class`],[1,`pt-3`,`border-t`,`border-slate-800`,`flex`,`items-center`,`justify-end`,`gap-2`],[`type`,`button`,1,`px-4`,`py-2`,`rounded-xl`,`text-xs`,`font-semibold`,`text-slate-400`,`hover:text-white`,`bg-slate-800`,`hover:bg-slate-700`,`transition-colors`,3,`click`],[`type`,`button`,1,`px-4`,`py-2`,`rounded-xl`,`text-xs`,`font-bold`,`text-slate-900`,`bg-amber-400`,`hover:bg-amber-300`,`disabled:opacity-50`,`disabled:cursor-not-allowed`,`shadow-md`,`transition-all`,`flex`,`items-center`,`gap-1.5`,3,`click`,`disabled`],[1,`p-3`,`rounded-xl`,`border`,`flex`,`items-center`,`justify-between`,`gap-3`,`cursor-pointer`,`transition-all`,3,`click`],[1,`w-8`,`h-8`,`rounded-lg`,`bg-slate-800`,`border`,`border-slate-700`,`flex`,`items-center`,`justify-center`,`font-bold`,`text-xs`,`text-indigo-400`,`shrink-0`],[1,`text-xs`,`sm:text-sm`,`font-bold`,`text-white`,`truncate`],[1,`flex`,`items-center`,`gap-1.5`,`text-[10px]`,`text-slate-400`,`mt-0.5`,`flex-wrap`],[1,`shrink-0`],[1,`text-[9px]`,`font-bold`,`px-2`,`py-0.5`,`rounded`,`bg-rose-500/15`,`text-rose-300`,`border`,`border-rose-500/30`,`flex`,`items-center`,`gap-1`,3,`title`],[1,`text-[9px]`,`font-bold`,`px-2`,`py-0.5`,`rounded`,`bg-emerald-500/15`,`text-emerald-300`,`border`,`border-emerald-500/30`]],template:function(e,n){e&1&&(Js(0,`div`,0)(1,`div`,1)(2,`div`)(3,`h1`,2)(4,`span`),_I(5,`Escalas & Presença`),xl(),Js(6,`span`,3),_I(7),xl()(),Js(8,`p`,4),_I(9,`Organização de equipes por culto e controle de check-in / presença`),xl()(),Js(10,`div`,5)(11,`div`,6)(12,`button`,7),Sg(`click`,function(){return n.isPdfMenuOpen=!n.isPdfMenuOpen}),Kf(),Js(13,`svg`,8),Dg(14,`path`,9),xl(),Jf(),Js(15,`span`),_I(16,`Exportar PDF`),xl(),Kf(),Js(17,`svg`,10),Dg(18,`path`,11),xl()(),LD(19,tt,11,0,`div`,12),xl(),LD(20,nt,3,0,`a`,13),xl()(),Jf(),Js(21,`div`,14)(22,`div`,15)(23,`button`,16),Sg(`click`,function(){return n.viewMode=`eventos`}),_I(24,` Por Eventos / Cultos `),xl(),Js(25,`button`,16),Sg(`click`,function(){return n.viewMode=`obreiros`}),_I(26,` Por Obreiros `),xl()(),Js(27,`div`,17)(28,`label`,18),_I(29,`Mês:`),xl(),Js(30,`select`,19),Sg(`ngModelChange`,function(d){return n.onMesChange(+d)}),Js(31,`option`,20),_I(32,`Todos os Meses`),xl(),BD(33,it,2,2,`option`,20,Ze),xl(),b_(),xl()(),LD(35,vt,14,2,`div`,21)(36,Lt,14,1,`div`,21),Js(37,`app-escala-modal`,22),Sg(`save`,function(d){return n.handleSave(d)})(`close`,function(){return n.closeModal()}),xl(),Js(38,`app-confirm-modal`,23),Sg(`confirm`,function(){return n.handleDelete()})(`cancel`,function(){return n.closeConfirm()}),xl(),LD(39,jt,39,9,`div`,24),xl()),e&2&&(Nb(7),Ml(` `,n.filteredEscalas().length,` escalados `),Nb(10),Og(`rotate-180`,n.isPdfMenuOpen),Nb(2),FD(n.isPdfMenuOpen?19:-1),Nb(),FD(n.authService.isAdmin()?20:-1),Nb(3),dI(n.viewMode===`eventos`?`bg-indigo-600 text-white font-bold shadow`:`text-slate-400 hover:text-slate-200`),Nb(2),dI(n.viewMode===`obreiros`?`bg-indigo-600 text-white font-bold shadow`:`text-slate-400 hover:text-slate-200`),Nb(5),_g(`ngModel`,n.selectedMesId()),D_(),Nb(),_g(`value`,0),Nb(2),UD(n.mesService.meses()),Nb(2),FD(n.viewMode===`eventos`?35:36),Nb(2),_g(`isOpen`,n.isModalOpen)(`meses`,n.mesService.meses())(`eventos`,n.eventoService.eventos())(`obreiros`,n.obreiroService.obreiros())(`bloqueios`,n.bloqueioService.bloqueios())(`escalas`,n.escalaService.escalas())(`defaultMesId`,n.selectedMesId()>0?n.selectedMesId():null)(`defaultEventoId`,n.selectedEventoId)(`loading`,n.escalaService.loading()),Nb(),_g(`isOpen`,n.isConfirmOpen)(`message`,`Tem certeza que deseja desescalar `+(n.selectedEscala?.obreiros?.nome||`este obreiro`)+` deste evento?`),Nb(),FD(n.isSubstituirModalOpen&&n.selectedEscalaParaSubstituir()?39:-1))},dependencies:[VC,zn,Wn,$n,Xe$1,bt$1,Bn,fn,pa,tn,le,w,UC],encapsulation:2})};export{Oe as EscalasListComponent};
import{Kn as tv,T as H,hn as go,mt as S,un as ev}from"./chunk-B22FJM3N.js";var f=class l{supabase=S(ev).client;toast=S(tv);escalas=go([]);loading=go(!1);mesCache=new Map;async fetchByMes(s,r=!1){if(!r&&this.mesCache.has(s)){let t=this.mesCache.get(s);return this.escalas.set(t),t}this.loading.set(!0);try{let{data:t,error:e}=await this.supabase.from(`escala`).select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `).eq(`id_mes`,s).order(`id_escala`,{ascending:!0}).limit(2e3);if(e)throw e;let a=t||[];return this.mesCache.set(s,a),this.escalas.set(a),a}catch(t){return console.error(`Erro ao buscar escala do mês:`,t),this.toast.error(`Erro ao carregar escala`,t.message),[]}finally{this.loading.set(!1)}}async fetchAll(){this.loading.set(!0);try{let s=[],r=0,t=1e3,e=!0;for(;e;){let{data:o,error:i}=await this.supabase.from(`escala`).select(`
            *,
            eventos (*),
            obreiros (*),
            mes (*)
          `).order(`id_escala`,{ascending:!0}).range(r,r+t-1);if(i)throw i;o&&o.length>0?(s.push(...o),o.length<t?e=!1:r+=t):e=!1}let a=new Map;for(let o of s)o.id_mes&&(a.has(o.id_mes)||a.set(o.id_mes,[]),a.get(o.id_mes).push(o));for(let[o,i]of a.entries())this.mesCache.set(o,i);return this.escalas.set(s),s}catch(s){return console.error(`Erro ao buscar todas as escalas:`,s),this.toast.error(`Erro ao carregar escalas`,s.message),[]}finally{this.loading.set(!1)}}async addObreiroToEvento(s){this.loading.set(!0);try{let{data:r,error:t}=await this.supabase.from(`escala`).insert([s]).select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `).single();if(t){if(t.code===`23505`)return this.toast.warning(`Obreiro já escalado`,`Este obreiro já faz parte da escala deste evento.`),null;throw t}let e=r;return this.escalas.update(a=>[...a,e]),e.id_mes&&this.mesCache.has(e.id_mes)&&this.mesCache.set(e.id_mes,[...this.mesCache.get(e.id_mes),e]),this.toast.success(`Obreiro escalado!`,`Inclusão na escala realizada com sucesso.`),e}catch(r){return console.error(`Erro ao escalar obreiro:`,r),this.toast.error(`Falha ao adicionar na escala`,r.message),null}finally{this.loading.set(!1)}}async addMultipleObreirosToEvento(s){if(!s||s.length===0)return[];this.loading.set(!0);try{let{data:r,error:t}=await this.supabase.from(`escala`).insert(s).select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `);if(t)if(t.code===`23505`)this.toast.warning(`Atenção`,`Um ou mais obreiros selecionados já estavam escalados neste evento.`);else throw t;let e=r||[];if(e.length>0){this.escalas.update(o=>[...o,...e]);let a=s[0].id_mes;a&&this.mesCache.has(a)&&this.mesCache.set(a,[...this.mesCache.get(a)||[],...e]),this.toast.success(`Obreiros escalados!`,`${e.length} ${e.length===1?`obreiro foi adicionado`:`obreiros foram adicionados`} \xE0 escala.`)}return e}catch(r){return console.error(`Erro ao escalar múltiplos obreiros:`,r),this.toast.error(`Erro ao escalar`,r.message||`Falha ao incluir obreiros na escala.`),[]}finally{this.loading.set(!1)}}async updateCheckin(s,r){try{let{data:t,error:e}=await this.supabase.from(`escala`).update({checkin:r}).eq(`id_escala`,s).select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `).single();if(e)throw e;let a=t;this.escalas.update(i=>i.map(h=>h.id_escala===s?a:h)),a.id_mes&&this.mesCache.has(a.id_mes)&&this.mesCache.set(a.id_mes,this.mesCache.get(a.id_mes).map(i=>i.id_escala===s?a:i));let o=r===!0?`Presente ✅`:r===!1?`Ausente ❌`:`Pendente ⏳`;return this.toast.success(`Check-in atualizado`,`Status alterado para: ${o}`),a}catch(t){return console.error(`Erro ao atualizar check-in:`,t),this.toast.error(`Falha ao registrar check-in`,t.message),null}}async substituirObreiro(s,r){this.loading.set(!0);try{let{data:t,error:e}=await this.supabase.from(`escala`).update({id_obreiro:r,checkin:null}).eq(`id_escala`,s).select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `).single();if(e){if(e.code===`23505`)return this.toast.warning(`Obreiro já escalado`,`Este obreiro substituto já faz parte da escala deste culto.`),null;throw e}let a=t;return this.escalas.update(o=>o.map(i=>i.id_escala===s?a:i)),a.id_mes&&this.mesCache.has(a.id_mes)&&this.mesCache.set(a.id_mes,this.mesCache.get(a.id_mes).map(o=>o.id_escala===s?a:o)),this.toast.success(`Substituição realizada!`,`Obreiro substitu\xEDdo com sucesso por ${a.obreiros?.nome}.`),a}catch(t){return console.error(`Erro ao substituir obreiro:`,t),this.toast.error(`Falha ao substituir obreiro`,t.message),null}finally{this.loading.set(!1)}}async saveGeneratedSchedule(s,r,t=!0){this.loading.set(!0);try{if(t){let{error:e}=await this.supabase.from(`escala`).delete().eq(`id_mes`,s);if(e)throw e}if(r.length>0){let{data:e,error:a}=await this.supabase.from(`escala`).insert(r).select(`
            *,
            eventos (*),
            obreiros (*),
            mes (*)
          `);if(a)throw a}return await this.fetchByMes(s,!0),this.toast.success(`Escala Mensal Gerada!`,`${r.length} escalas foram gravadas com sucesso.`),!0}catch(e){return console.error(`Erro ao salvar escala gerada:`,e),this.toast.error(`Falha ao salvar escala`,e.message),!1}finally{this.loading.set(!1)}}async removeObreiroFromEvento(s){this.loading.set(!0);try{let{error:r}=await this.supabase.from(`escala`).delete().eq(`id_escala`,s);if(r)throw r;return this.escalas.update(t=>t.filter(e=>e.id_escala!==s)),this.mesCache.clear(),this.toast.success(`Escala atualizada`,`Obreiro desescalado com sucesso.`),!0}catch(r){return console.error(`Erro ao remover da escala:`,r),this.toast.error(`Falha ao remover da escala`,r.message),!1}finally{this.loading.set(!1)}}static ɵfac=function(r){return new(r||l)};static ɵprov=H({token:l,factory:l.ɵfac,providedIn:`root`})};export{f as t};
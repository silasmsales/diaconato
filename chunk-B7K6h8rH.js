import{E as H,In as po,Ut as Zy,dt as S,ot as Qy}from"./chunk-YzxS7Zkq.js";var f=class l{supabase=S(Zy).client;toast=S(Qy);escalas=po([]);loading=po(!1);mesCache=new Map;async fetchByMes(s,t=!1){if(!t&&this.mesCache.has(s)){let r=this.mesCache.get(s);return this.escalas.set(r),r}this.loading.set(!0);try{let{data:r,error:e}=await this.supabase.from(`escala`).select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `).eq(`id_mes`,s).order(`id_escala`,{ascending:!0}).limit(2e3);if(e)throw e;let a=r||[];return this.mesCache.set(s,a),this.escalas.set(a),a}catch(r){return console.error(`Erro ao buscar escala do mês:`,r),this.toast.error(`Erro ao carregar escala`,r.message),[]}finally{this.loading.set(!1)}}async fetchAll(){this.loading.set(!0);try{let s=[],t=0,r=1e3,e=!0;for(;e;){let{data:o,error:i}=await this.supabase.from(`escala`).select(`
            *,
            eventos (*),
            obreiros (*),
            mes (*)
          `).order(`id_escala`,{ascending:!0}).range(t,t+r-1);if(i)throw i;o&&o.length>0?(s.push(...o),o.length<r?e=!1:t+=r):e=!1}let a=new Map;for(let o of s)o.id_mes&&(a.has(o.id_mes)||a.set(o.id_mes,[]),a.get(o.id_mes).push(o));for(let[o,i]of a.entries())this.mesCache.set(o,i);return this.escalas.set(s),s}catch(s){return console.error(`Erro ao buscar todas as escalas:`,s),this.toast.error(`Erro ao carregar escalas`,s.message),[]}finally{this.loading.set(!1)}}async addObreiroToEvento(s){this.loading.set(!0);try{let{data:t,error:r}=await this.supabase.from(`escala`).insert([s]).select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `).single();if(r){if(r.code===`23505`)return this.toast.warning(`Obreiro já escalado`,`Este obreiro já faz parte da escala deste evento.`),null;throw r}let e=t;return this.escalas.update(a=>[...a,e]),e.id_mes&&this.mesCache.has(e.id_mes)&&this.mesCache.set(e.id_mes,[...this.mesCache.get(e.id_mes),e]),this.toast.success(`Obreiro escalado!`,`Inclusão na escala realizada com sucesso.`),e}catch(t){return console.error(`Erro ao escalar obreiro:`,t),this.toast.error(`Falha ao adicionar na escala`,t.message),null}finally{this.loading.set(!1)}}async updateCheckin(s,t){try{let{data:r,error:e}=await this.supabase.from(`escala`).update({checkin:t}).eq(`id_escala`,s).select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `).single();if(e)throw e;let a=r;this.escalas.update(i=>i.map(h=>h.id_escala===s?a:h)),a.id_mes&&this.mesCache.has(a.id_mes)&&this.mesCache.set(a.id_mes,this.mesCache.get(a.id_mes).map(i=>i.id_escala===s?a:i));let o=t===!0?`Presente ✅`:t===!1?`Ausente ❌`:`Pendente ⏳`;return this.toast.success(`Check-in atualizado`,`Status alterado para: ${o}`),a}catch(r){return console.error(`Erro ao atualizar check-in:`,r),this.toast.error(`Falha ao registrar check-in`,r.message),null}}async substituirObreiro(s,t){this.loading.set(!0);try{let{data:r,error:e}=await this.supabase.from(`escala`).update({id_obreiro:t,checkin:null}).eq(`id_escala`,s).select(`
          *,
          eventos (*),
          obreiros (*),
          mes (*)
        `).single();if(e){if(e.code===`23505`)return this.toast.warning(`Obreiro já escalado`,`Este obreiro substituto já faz parte da escala deste culto.`),null;throw e}let a=r;return this.escalas.update(o=>o.map(i=>i.id_escala===s?a:i)),a.id_mes&&this.mesCache.has(a.id_mes)&&this.mesCache.set(a.id_mes,this.mesCache.get(a.id_mes).map(o=>o.id_escala===s?a:o)),this.toast.success(`Substituição realizada!`,`Obreiro substitu\xEDdo com sucesso por ${a.obreiros?.nome}.`),a}catch(r){return console.error(`Erro ao substituir obreiro:`,r),this.toast.error(`Falha ao substituir obreiro`,r.message),null}finally{this.loading.set(!1)}}async saveGeneratedSchedule(s,t,r=!0){this.loading.set(!0);try{if(r){let{error:e}=await this.supabase.from(`escala`).delete().eq(`id_mes`,s);if(e)throw e}if(t.length>0){let{data:e,error:a}=await this.supabase.from(`escala`).insert(t).select(`
            *,
            eventos (*),
            obreiros (*),
            mes (*)
          `);if(a)throw a}return await this.fetchByMes(s,!0),this.toast.success(`Escala Mensal Gerada!`,`${t.length} escalas foram gravadas com sucesso.`),!0}catch(e){return console.error(`Erro ao salvar escala gerada:`,e),this.toast.error(`Falha ao salvar escala`,e.message),!1}finally{this.loading.set(!1)}}async removeObreiroFromEvento(s){this.loading.set(!0);try{let{error:t}=await this.supabase.from(`escala`).delete().eq(`id_escala`,s);if(t)throw t;return this.escalas.update(r=>r.filter(e=>e.id_escala!==s)),this.mesCache.clear(),this.toast.success(`Escala atualizada`,`Obreiro desescalado com sucesso.`),!0}catch(t){return console.error(`Erro ao remover da escala:`,t),this.toast.error(`Falha ao remover da escala`,t.message),!1}finally{this.loading.set(!1)}}static ɵfac=function(t){return new(t||l)};static ɵprov=H({token:l,factory:l.ɵfac,providedIn:`root`})};export{f as t};
import { codecTables, type CodecOptions } from './codec'
import { translate, type Lang } from '../i18n'

/**
 * Génère le décodeur à installer sur le site cible. Le cœur (`tinyDecode`) est
 * du JS ES5 autonome : même logique que `decodeUrl`, vérifiée par les tests.
 */
export function decoderCore(opts: CodecOptions): string {
  const { keys, values } = codecTables(opts)
  return `function tinyDecode(search){
  var P=${JSON.stringify(opts.param)},K=${JSON.stringify(keys)},V=${JSON.stringify(values)};
  var own=Object.prototype.hasOwnProperty;
  function dec(s){try{return decodeURIComponent(s.replace(/\\+/g," "))}catch(e){return s}}
  function key(t){return t.charAt(0)==="!"?dec(t.slice(1)):own.call(K,t)?K[t]:dec(t)}
  function val(t){return t.charAt(0)==="!"&&own.call(V,t.slice(1))?V[t.slice(1)]:dec(t)}
  if(!search||search.length<2)return null;
  var segs=search.slice(1).split("&"),out=[],done=false,i,j,n,k,it,c,kk;
  for(i=0;i<segs.length;i++){
    if(!segs[i])continue;
    j=segs[i].indexOf("=");k=j<0?segs[i]:segs[i].slice(0,j);
    if(!done&&j>=0&&dec(k)===P){
      done=true;it=segs[i].slice(j+1).split(",");
      for(n=0;n<it.length;n++){
        if(!it[n])continue;
        c=it[n].indexOf(":");
        kk=encodeURIComponent(key(c<0?it[n]:it[n].slice(0,c)));
        out.push(c<0?kk:kk+"="+encodeURIComponent(val(it[n].slice(c+1))));
      }
    }else out.push(segs[i]);
  }
  return done?(out.length?"?"+out.join("&"):""):null;
}`
}

/** Snippet navigateur : à placer dans <head>, AVANT Google Analytics / GTM / pixels. */
export function browserSnippet(opts: CodecOptions, lang: Lang = 'fr'): string {
  return `<script>
/* ${translate(lang, 'snippet.browser')} */
(function(){
  ${decoderCore(opts).replace(/\n/g, '\n  ')}
  try{
    var s=tinyDecode(location.search);
    if(s!==null)history.replaceState(history.state,"",location.pathname+s+location.hash);
  }catch(e){}
})();
</script>`
}

/** Module serveur / edge : renvoie l'URL complète restaurée (middleware, Worker, redirection…). */
export function serverSnippet(opts: CodecOptions, lang: Lang = 'fr'): string {
  return `// ${translate(lang, 'snippet.server')}
${decoderCore(opts)}

export function restoreTinyParams(href) {
  const url = new URL(href);
  const search = tinyDecode(url.search);
  if (search === null) return href;
  url.search = search;
  return url.toString();
}

// ${translate(lang, 'snippet.serverExample')}
// const restored = restoreTinyParams(request.url);
// if (restored !== request.url) return Response.redirect(restored, 302);`
}

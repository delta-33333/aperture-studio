/* Aperture Marketing Studio */
(function(){
const NETWORKS=[
{id:"meta",label:"Meta (FB / IG)",format:"9:16 · 15 s",aspect:"9:16"},
{id:"tiktok",label:"TikTok",format:"9:16 · 15 s",aspect:"9:16"},
{id:"linkedin",label:"LinkedIn",format:"16:9 · 15 s",aspect:"16:9"},
{id:"x",label:"X",format:"16:9 · 15 s",aspect:"16:9"},
{id:"youtube",label:"YouTube Shorts",format:"9:16 · 15 s",aspect:"9:16"},
{id:"google",label:"Google Ads",format:"Titres + desc.",aspect:"1:1"}
];
const KEY="aperture_studio_v1";
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return{}}}
function save(p){const s={...load(),...p};localStorage.setItem(KEY,JSON.stringify(s));return s}
function ensure(){if(typeof load().tokens!=="number")save({tokens:80,plan:"lab"})}
function toast(m){const t=document.getElementById("toast");if(!t)return;t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
async function copyText(t){await navigator.clipboard.writeText(t);toast("Copié")}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function rePrompt(product,ids){
const name=product.name.trim(),line=product.oneLiner.trim(),desc=(product.description||"").trim(),cta=(product.cta||"En savoir plus").trim();
const site=(product.website||"").replace(/^https?:\/\//,"").replace(/\/$/,"");
const M={
meta:()=>({primary:`${name} pour ceux qui n'ont plus le temps de bricoler.\n\n${line}\n\n${cta}${site?" → "+site:""}`,alt:`Le process tient. Le volume, plus vraiment.\n\n${name} : ${line}\n\n${cta}`,videoPrompt:`Cinematic 15s vertical ad, no text, no logos. Dark warm light. Metaphor for: ${line}. Slow push-in, 9:16.`}),
tiktok:()=>({primary:`Le process tient.\nLe volume, plus vraiment.\n\n${name} — ${line}\n\n${cta}`,alt:`${name}.\n${line}`,videoPrompt:`Vertical 15s TikTok promo, no text, no logos. ${line}. Natural light, 9:16.`}),
linkedin:()=>({primary:`Un ICP n'est pas un persona. C'est un compte qui signe.\n\n${name} : ${line}\n\n${desc?desc.slice(0,220):"On clarifie l'offre."}\n\n${cta}${site?" — "+site:""}`,alt:`${name}\n\n${line}\n\n${cta}`,videoPrompt:`Professional 15s LinkedIn, 16:9, no text. B2B scene for: ${line}. Soft daylight.`}),
x:()=>({primary:`La plupart des équipes vendent trop large.\n\n${name} : ${line}\n\n${cta}${site?"\n"+site:""}`,alt:`${name}\n${line}`,videoPrompt:`15s X clip, no text. Metaphor for: ${line}. High contrast, 16:9.`}),
youtube:()=>({primary:`${name}, en 15 secondes.\n\n${line}\n\n${cta}`,alt:`${name} — ${line}`,videoPrompt:`YouTube Short 9:16, 15s, no captions. Story for: ${line}. Hook in 2s.`}),
google:()=>({primary:`Titres:\n1. ${name.slice(0,30)}\n2. ${line.slice(0,30)}\n3. ${cta.slice(0,30)}\n\nDescription:\n${(line+" "+desc).slice(0,90)}\n\nURL: ${product.website||"https://"}`,alt:`${name} | ${line.slice(0,40)}`,videoPrompt:`Square product motion 15s for Demand Gen: ${line}.`})
};
return NETWORKS.filter(n=>ids.includes(n.id)).map(n=>({...n,...M[n.id]()}))
}
function updateBar(){const el=document.getElementById("tokenBalance");if(el)el.textContent=String(load().tokens??80)}
function debit(c){const t=load().tokens??80;if(t<c){toast("Tokens insuffisants");document.getElementById("upsell")?.classList.remove("hidden");return false}save({tokens:t-c});updateBar();return true}
function form(){return{name:document.getElementById("name").value,website:document.getElementById("website").value,oneLiner:document.getElementById("oneLiner").value,description:document.getElementById("description").value,cta:document.getElementById("cta").value}}
function nets(){return[...document.querySelectorAll(".checks input:checked")].map(i=>i.value)}
function render(pack){const root=document.getElementById("results");root.hidden=false;root.innerHTML=pack.map((n,i)=>`<div class="card"><div class="net-head"><h2>${esc(n.label)}</h2><span class="badge">${esc(n.format)}</span></div><p class="hint">Texte</p><div class="copy-box" id="p${i}">${esc(n.primary)}</div><div class="actions"><button class="btn secondary sm" type="button" data-c="p${i}">Copier</button></div><p class="hint" style="margin-top:1rem">Variante</p><div class="copy-box" id="a${i}">${esc(n.alt)}</div><div class="actions"><button class="btn ghost sm" type="button" data-c="a${i}">Copier</button></div><p class="hint" style="margin-top:1rem">Brief vidéo 15s</p><div class="copy-box" id="v${i}">${esc(n.videoPrompt)}</div><div class="actions"><button class="btn ghost sm" type="button" data-c="v${i}">Copier brief</button></div></div>`).join("");root.querySelectorAll("[data-c]").forEach(b=>b.addEventListener("click",()=>copyText(document.getElementById(b.getAttribute("data-c")).innerText)))}
function generate(){const p=form();if(!p.name.trim()||!p.oneLiner.trim()){toast("Nom + phrase requis");return}const n=nets();if(!n.length){toast("Choisissez un réseau");return}const cost=1+Math.min(n.length,3)*2;if(!debit(cost))return;const pack=rePrompt(p,n);window.__pack={product:p,items:pack};save({lastPack:window.__pack});render(pack);toast("Pack généré (−"+cost+")");document.getElementById("results").scrollIntoView({behavior:"smooth"})}
function download(){if(!window.__pack){toast("Générez d'abord");return}const{product,items}=window.__pack;let b=`APERTURE PACK\n${product.name}\n${product.oneLiner}\n\n`;items.forEach(n=>{b+=`\n=== ${n.label} ===\n\n${n.primary}\n\n${n.alt}\n\nBRIEF:\n${n.videoPrompt}\n`});const blob=new Blob([b],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=(product.name||"aperture").replace(/\s+/g,"-").toLowerCase()+"-pack.txt";a.click();toast("Téléchargé")}
document.addEventListener("DOMContentLoaded",()=>{ensure();updateBar();
document.getElementById("btnGenerate")?.addEventListener("click",generate);
document.getElementById("btnDownload")?.addEventListener("click",download);
document.getElementById("btnScrape")?.addEventListener("click",()=>{const u=document.getElementById("website").value.trim();if(!u){toast("URL requise");return}document.getElementById("website").value=u.startsWith("http")?u:"https://"+u;toast("Complétez la fiche (scrape serveur = phase 2)")});
document.getElementById("btnResetTokens")?.addEventListener("click",()=>{save({tokens:80});updateBar();toast("Tokens reset")});
});
})();
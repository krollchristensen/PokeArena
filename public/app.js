'use strict';
const $ = id => document.getElementById(id);
let selectedPokemon = null;
let team = [];
let editId = null;
const pretty = text => text.replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase());
const imageFor = id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
function notice(message, error = false) {
  const el = $('notification'); el.textContent = message; el.classList.toggle('error', error); el.hidden = false;
}
function clearNotice() { $('notification').hidden = true; }
async function api(url, options = {}) {
  let response;
  try { response = await fetch(url, options); }
  catch { throw new Error('Kan ikke kontakte serveren. Kontroller, at Node.js kører.'); }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  if (response.status === 204) return null;
  return response.json();
}
async function searchPokemon(name) {
  clearNotice();
  $('search-button').disabled = true;
  $('search-button').textContent = 'Søger...';
  try {
    const pokemon = await api(`/pokemon/${encodeURIComponent(name.trim().toLowerCase())}`);
    selectedPokemon = pokemon;
    $('search-empty').hidden = true;
    $('pokemon-detail').hidden = false;
    $('pokemon-image').src = pokemon.image || imageFor(pokemon.id);
    $('pokemon-image').alt = `Illustration af ${pretty(pokemon.name)}`;
    $('pokemon-watermark').textContent = String(pokemon.id).padStart(3, '0');
    $('pokemon-id').textContent = `POKÉDEX #${String(pokemon.id).padStart(3,'0')}`;
    $('pokemon-name').textContent = pretty(pokemon.name);
    $('pokemon-types').replaceChildren(...pokemon.types.map(type => {
      const el = document.createElement('span'); el.className = 'type-pill'; el.textContent = type; return el;
    }));
    const statNames = [['hp','HP'],['attack','ATK'],['defense','DEF'],['speed','SPD']];
    $('pokemon-stats').replaceChildren(...statNames.map(([key,label]) => {
      const value = pokemon.stats?.[key] ?? 0;
      const el = document.createElement('div'); el.className = 'stat-row';
      const l = document.createElement('label'); l.textContent = label;
      const v = document.createElement('span'); v.textContent = value;
      const track = document.createElement('div'); track.className = 'stat-track';
      const bar = document.createElement('i'); bar.style.width = `${Math.min(100,Math.round(value / 200 * 100))}%`;
      track.append(bar); el.append(l,v,track); return el;
    }));
    const total = Object.values(pokemon.stats || {}).reduce((a,b)=>a+b,0);
    $('pokemon-total').textContent = `TOTAL ${total}`;
    refreshAddButton();
  } catch (err) { notice(err.message, true); }
  finally { $('search-button').disabled = false; $('search-button').innerHTML = 'Find Pokémon <span aria-hidden="true">→</span>'; }
}
function refreshAddButton() {
  const exists = selectedPokemon && team.some(f => f.name === selectedPokemon.name);
  const full = team.length >= 6;
  $('add-button').disabled = !selectedPokemon || exists || full;
  $('add-button').textContent = exists ? 'Allerede på holdet' : full ? 'Holdet er fuldt (6/6)' : 'Tilføj til mit team +';
}
function drawTeam() {
  $('team-count').textContent = `${team.length} / 6`;
  $('team-status').textContent = team.length === 6 ? 'Holdet er komplet!' : team.length === 0 ? 'Klar til at rekruttere' : `${team.length} Pokémon klar til kamp`;
  $('team-capacity').textContent = `${6-team.length} LEDIGE PLADSER`;
  const grid = $('team-grid'); grid.replaceChildren();
  for (const favorite of team) {
    const cell = document.createElement('div'); cell.className = 'team-slot';
    const actions = document.createElement('div'); actions.className = 'slot-actions';
    const edit = document.createElement('button'); edit.type='button'; edit.textContent='✎'; edit.title=`Redigér ${favorite.name}`; edit.setAttribute('aria-label',edit.title);
    edit.addEventListener('click', () => openEdit(favorite));
    const del = document.createElement('button'); del.type='button'; del.textContent='×'; del.title=`Slet ${favorite.name}`; del.setAttribute('aria-label',del.title);
    del.addEventListener('click', () => removeFavorite(favorite)); actions.append(edit,del);
    const img = document.createElement('img'); img.src = favorite.pokemonId ? imageFor(favorite.pokemonId) : '';  img.alt = `Billede af ${favorite.name}`; img.loading='lazy';
    img.addEventListener('error', () => { img.style.display='none'; });
    const title = document.createElement('strong'); title.textContent = pretty(favorite.name);
    const note = document.createElement('span'); note.className='slot-note'; note.textContent=favorite.note || 'Ingen note'; note.title=favorite.note || '';
    cell.append(actions,img,title,note);grid.append(cell);
  }
  for(let i=team.length;i<6;i++) {
    const cell=document.createElement('div');cell.className='team-slot empty';
    const plus=document.createElement('span'); plus.className='empty-symbol'; plus.textContent='+';
    const label=document.createElement('span'); label.textContent='LEDIG PLADS';
    cell.append(plus,label);grid.append(cell);
  }
  refreshAddButton();
}
async function loadTeam(){ try {team=await api('/favorites');drawTeam();}catch(err){notice(err.message,true);} }
async function addFavorite() {
  if(!selectedPokemon) return;
  try {
    await api('/favorites',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:selectedPokemon.name,pokemonId:selectedPokemon.id,note:''})});
    await loadTeam();notice(`${pretty(selectedPokemon.name)} er nu på holdet!`);
  } catch(err){notice(err.message,true);await loadTeam();}
}
async function removeFavorite(favorite) {
  try { await api(`/favorites/${favorite.id}`,{method:'DELETE'}); await loadTeam();notice(`${pretty(favorite.name)} blev fjernet fra holdet.`); }
  catch(err){notice(err.message,true);}
}
function openEdit(favorite){ editId=favorite.id;$('edit-name').textContent=pretty(favorite.name);$('edit-note').value=favorite.note;$('edit-dialog').showModal(); }
async function saveEdit(event) {
  event.preventDefault();const item=team.find(f=>f.id===editId);if(!item)return;
  try {await api(`/favorites/${editId}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:item.name,note:$('edit-note').value})});$('edit-dialog').close();await loadTeam();notice('Noten er gemt.');}
  catch(err){notice(err.message,true);}
}
$('search-form').addEventListener('submit', event=>{event.preventDefault();searchPokemon($('search').value);});
document.querySelectorAll('[data-search]').forEach(button=>button.addEventListener('click',()=>{$('search').value=button.dataset.search;searchPokemon(button.dataset.search);}));
$('add-button').addEventListener('click',addFavorite);
$('edit-form').addEventListener('submit',saveEdit);
$('cancel-edit').addEventListener('click',()=>$('edit-dialog').close());
loadTeam().then(()=>searchPokemon('pikachu'));

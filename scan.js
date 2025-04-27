console.log("???? Script WYB's lancé !");

// --- Données à modifier si besoin ---
const groupes = {
  "Guerriers": ["admin"],
  "Alchimistes": ["Sebastian McClaren"],
  "Artistes": []
};

  
// --- Variables de cumul ---
const wybParGroupe = {
  "Guerriers": 0,
  "Alchimistes": 0,
  "Artistes": 0
};

// --- Scan des membres ---
const membres = document.querySelectorAll('#LMBER');

membres.forEach(membre => {
  const pseudoEl = membre.querySelector('#nameLMBER a');
  const pointsEl = membre.querySelector('.boxLMBER span:nth-child(5) + span');

  if (!pseudoEl || !pointsEl) return;

  const pseudo = pseudoEl.textContent.trim().toLowerCase();
  const wybTexte = pointsEl.textContent.trim();
  
  // Cherche si ce pseudo appartient à un groupe
  let groupeTrouvé = null;
  for (const [groupe, membres] of Object.entries(groupes)) {
    if (membres.map(m => m.toLowerCase()).includes(pseudo)) {
      groupeTrouvé = groupe;
      break;
    }
  }

  if (!groupeTrouvé) return;

  // Extraire nombre de WYB's
  const wybMatch = wybTexte.match(/\d+/);
  const wybNombre = wybMatch ? parseInt(wybMatch[0], 10) : 0;

  wybParGroupe[groupeTrouvé] += wybNombre;
});

// --- Affichage du résumé ---
const recapBloc = document.createElement('div');
recapBloc.classList.add('pointsl', 'masquerscan');
recapBloc.innerHTML = `
  <h3>Récapitulatif WYB's par groupe :</h3>
  <ul>
    <li>Guerriers : WYB's ${wybParGroupe["Guerriers"]}</li>
    <li>Alchimistes : WYB's ${wybParGroupe["Alchimistes"]}</li>
    <li>Artistes : WYB's ${wybParGroupe["Artistes"]}</li>
  </ul>
`;

const target = document.querySelector('.btmLMBER');
if (target) {
  target.insertAdjacentElement('afterend', recapBloc);
  console.log("✅ Résumé ajouté !");
} else {
  console.warn("❌ .btmLMBER introuvable pour insérer le résumé !");
}

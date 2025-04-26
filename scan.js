console.log("🚀 Script de scan lancé");

// === Configuration ===
const groupes = {
  "Guerriers": ["admin"],
  "Alchimistes": ["Sebastian McClaren"],
  "Artistes": []
};

const pointsParGroupe = {
  "Guerriers": 87,
  "Alchimistes": 112,
  "Artistes": 65
};

const baseUrl = "https://wyb-test.forumactif.com"; // 🔥 Remplace par l'URL de ton forum si besoin
const maxUsers = 150; // Combien de profils tu veux scanner (u1 à u150)

const pointsGroupe = {};
const wybsGroupe = {};

// === Fonctions ===
async function scannerProfils() {
  console.log("🔍 Début du scan...");

  // Réinitialiser les points
  Object.keys(groupes).forEach(groupe => {
    pointsGroupe[groupe] = pointsParGroupe[groupe];
    wybsGroupe[groupe] = 0;
  });

  for (let i = 1; i <= maxUsers; i++) {
    try {
      const response = await fetch(`${baseUrl}/u${i}`);
      if (!response.ok) continue;

      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      // Récupérer le pseudo
      const nameBox = doc.querySelector(".boxPFIL .namePFIL strong");
      if (!nameBox) continue;

      const pseudo = nameBox.textContent.trim().toLowerCase();
      let groupeTrouvé = null;
      for (const [groupe, membres] of Object.entries(groupes)) {
        if (membres.map(m => m.toLowerCase()).includes(pseudo)) {
          groupeTrouvé = groupe;
          break;
        }
      }

      if (!groupeTrouvé) continue;

      // Récupérer les WYB's
      const wybDiv = doc.querySelector(".abtPFIL #field_id-13 .field_uneditable");
      if (!wybDiv) continue;

      const wybs = parseInt(wybDiv.textContent.trim());
      if (isNaN(wybs)) continue;

      wybsGroupe[groupeTrouvé] += wybs;

      console.log(`✅ ${pseudo} (${groupeTrouvé}) : +${wybs} WYB's`);
    } catch (e) {
      console.error(`❌ Erreur sur u${i}`, e);
      continue;
    }
  }

  afficherResume();
}

function afficherResume() {
  const container = document.getElementById('resume-points');
  container.innerHTML = "";

  let texteCopie = "";

  Object.keys(groupes).forEach(groupe => {
    const total = pointsGroupe[groupe] + wybsGroupe[groupe];
    container.innerHTML += `<div>${groupe} : ${total} points (Fixes ${pointsParGroupe[groupe]} + WYB's ${wybsGroupe[groupe]})</div>`;
    texteCopie += `${groupe} : ${total} points\n`;
  });

  document.getElementById('copy-points').style.display = "inline-block";
  document.getElementById('copy-points').onclick = () => {
    navigator.clipboard.writeText(texteCopie.trim()).then(() => {
      alert("Résumé copié !");
    });
  };
}

// === Lancer le scan ===
document.getElementById('start-scan').addEventListener('click', () => {
  scannerProfils();
});

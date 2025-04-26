console.log("🚀 Script de scan lancé");

// === Configuration ===
const groupes = {
  "Guerriers": ["admin"],
  "Alchimistes": ["Sebastian McClaren"],
  "Artistes": []
};

const baseUrl = "https://wyb-test.forumactif.com"; // ➔ Ton forum
const maxUsers = 150; // ➔ Jusqu'à quel uN scanner

const wybsGroupe = {}; // Cumuler uniquement les WYB's

async function scannerProfils() {
  console.log("🔍 Début du scan...");

  // Réinitialiser
  Object.keys(groupes).forEach(groupe => {
    wybsGroupe[groupe] = 0;
  });

  for (let i = 1; i <= maxUsers; i++) {
    try {
      const response = await fetch(`${baseUrl}/u${i}`);
      if (!response.ok) continue;

      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      const nameBox = doc.querySelector(".boxPFIL .namePFIL strong");
      if (!nameBox) {
        console.log(`❌ Pas de pseudo pour u${i}`);
        continue;
      }

      const pseudo = nameBox.textContent.trim().toLowerCase();
      let groupeTrouvé = null;
      for (const [groupe, membres] of Object.entries(groupes)) {
        if (membres.map(m => m.toLowerCase()).includes(pseudo)) {
          groupeTrouvé = groupe;
          break;
        }
      }

      if (!groupeTrouvé) {
        console.log(`❌ ${pseudo} n'appartient à aucun groupe`);
        continue;
      }

      const wybDiv = doc.querySelector("#field_id-13 .field_uneditable");
      if (!wybDiv) {
        console.log(`❌ Pas de WYB's pour ${pseudo}`);
        continue;
      }

      const match = wybDiv.textContent.replace(/\s/g, '').match(/\d+/);
      if (!match) {
        console.log(`❌ WYB's pas trouvé pour ${pseudo}`);
        continue;
      }

      const wybs = parseInt(match[0], 10);
      wybsGroupe[groupeTrouvé] += wybs;

      console.log(`✅ ${pseudo} (${groupeTrouvé}) : +${wybs} WYB's`);
    } catch (error) {
      console.error(`❌ Erreur sur u${i}`, error);
    }
  }

  afficherResume();
}

function afficherResume() {
  const container = document.getElementById('resume-points');
  container.innerHTML = "";

  let texteCopie = "";

  Object.keys(wybsGroupe).forEach(groupe => {
    container.innerHTML += `<div><strong>${groupe}</strong> : ${wybsGroupe[groupe]} WYB's</div>`;
    texteCopie += `${groupe} : ${wybsGroupe[groupe]} WYB's\n`;
  });

  document.getElementById('copy-points').style.display = "inline-block";
  document.getElementById('copy-points').onclick = () => {
    navigator.clipboard.writeText(texteCopie.trim()).then(() => {
      alert("Résumé copié !");
    });
  };
}

document.getElementById('start-scan').addEventListener('click', () => {
  scannerProfils();
});

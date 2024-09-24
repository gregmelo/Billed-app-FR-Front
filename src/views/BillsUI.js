import ErrorPage from "./ErrorPage.js";
import LoadingPage from "./LoadingPage.js";
import VerticalLayout from "./VerticalLayout.js";

import Actions from "./Actions.js";

const row = (bill) => {
  return `
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `;
};

const rows = (data) => {
  console.log(data);

  // Fonction pour convertir les mois français en chiffres
  const convertFrenchDate = (dateStr) => {
    const months = {
      "Jan.": "01",
      "Fév.": "02",
      "Mar.": "03",
      "Avr.": "04",
      "Mai.": "05",
      "Juin": "06",
      "Juil.": "07",
      "Aoû.": "08",
      "Sep.": "09",
      "Oct.": "10",
      "Nov.": "11",
      "Déc.": "12",
    };

    // Remplace le mois en français par un mois numérique
    return dateStr.replace(
      /(\d{1,2}) (\w{3,4}) (\d{2})/,
      (match, day, month, year) => {
        let monthNum = months[month];
        if (!monthNum) {
          // Vérification supplémentaire pour "Jui."
          if (month === "Jui.") {
            if (dateStr.includes("Juin")) {
              monthNum = "06";
            } else if (dateStr.includes("Juil.")) {
              monthNum = "07";
            }
          }
        }
        if (monthNum) {
          return `20${year}-${monthNum}-${day.padStart(2, "0")}`; // Format YYYY-MM-DD
        }
        return null; // Retourne null si le mois n'est pas trouvé
      }
    );
  };

  const sortingDates = (a, b) => {
    const dateA = new Date(convertFrenchDate(a.date));
    const dateB = new Date(convertFrenchDate(b.date));
    console.log(dateA.getTime(), dateB.getTime());

    if (isNaN(dateA) || isNaN(dateB)) {
      console.error("Invalid date format", a.date, b.date);
      return 0;
    }

    return dateB - dateA; // Pour trier de la plus récente à la plus vieille
  };

  if (data && data.length) {
    return data
      .sort(sortingDates)
      .map((bill) => row(bill))
      .join("");
  } else {
    return "";
  }
};



export default ({ data: bills, loading, error }) => {
  const modal = () => `
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `;

  if (loading) {
    return LoadingPage();
  } else if (error) {
    return ErrorPage(error);
  }

  return `
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`;
};

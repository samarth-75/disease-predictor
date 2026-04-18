import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser = null;

// Track current user
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    window.location.href = "login.html";
  }
});

// ✅ Function to show form based on dropdown
window.showForm = function () {
  const selected = document.getElementById("reportType").value;
  const forms = document.querySelectorAll(".reportForm");
  forms.forEach(form => form.classList.add("hidden")); // Hide all
  if (selected) {
    document.getElementById(selected).classList.remove("hidden"); // Show selected
  }
  document.getElementById("results").innerHTML = "";
};

// ✅ Function for disease prediction
window.predictDisease = async function (type) {
  let result = "<h3>🧾 Results:</h3><p>";

  // ---- BLOOD TEST ----
  if (type === "blood") {
    const age = parseInt(document.getElementById("cbcAge").value);
    const gender = document.getElementById("cbcGender").value;
    const hb = parseFloat(document.getElementById("hb").value);
    const wbc = parseFloat(document.getElementById("wbc").value);
    const platelets = parseFloat(document.getElementById("platelets").value);

    if (!age || !gender || !hb || !wbc || !platelets) {
      result = "⚠️ Please fill all fields.";
      document.getElementById("results").innerHTML = result;
      return;
    }

    let hbLow, hbHigh;
    if (gender === "male") { hbLow = 13.5; hbHigh = 17.5; }
    else if (gender === "female") { hbLow = 12.0; hbHigh = 15.5; }
    else { hbLow = 11.0; hbHigh = 13.5; }

    if (hb < hbLow) result += "⚠️ Low Hemoglobin – Possible <b>Anemia</b>.<br>";
    if (hb > hbHigh) result += "⚠️ High Hemoglobin – Possible <b>Polycythemia</b>.<br>";
    if (wbc > 11000) result += "⚠️ High WBC – Possible <b>Infection or Leukemia</b>.<br>";
    if (wbc < 4000) result += "⚠️ Low WBC – Possible <b>Immunodeficiency</b>.<br>";
    if (platelets < 150000) result += "⚠️ Low Platelets – Possible <b>Dengue or Clotting Disorder</b>.<br>";
    if (platelets > 450000) result += "⚠️ High Platelets – Possible <b>Thrombocytosis</b>.<br>";

    if (hb >= hbLow && hb <= hbHigh && wbc >= 4000 && wbc <= 11000 && platelets >= 150000 && platelets <= 450000)
      result += "✅ CBC values look <b>Normal</b>.";
  }

  // ---- DIABETES ----
  else if (type === "diabetes") {
    const glucose = parseFloat(document.getElementById("glucose").value);
    const hba1c = parseFloat(document.getElementById("hba1c").value);

    if (!glucose || !hba1c) {
      result = "⚠️ Please fill all fields.";
      document.getElementById("results").innerHTML = result;
      return;
    }

    if (glucose < 70) result += "⚠️ Low Sugar – <b>Hypoglycemia</b>.<br>";
    else if (glucose > 126 || hba1c >= 6.5) result += "🚨 High sugar – <b>Diabetes</b>.<br>";
    else if (glucose >= 100 || hba1c >= 5.7) result += "⚠️ Borderline – <b>Prediabetes</b>.<br>";
    else result += "✅ Diabetes panel looks <b>Normal</b>.";
  }

  // ---- KIDNEY ----
  else if (type === "kidney") {
    const age = parseInt(document.getElementById("kidneyAge").value);
    const creatinine = parseFloat(document.getElementById("creatinine").value);
    const urea = parseFloat(document.getElementById("urea").value);
    const sodium = parseFloat(document.getElementById("sodium").value);
    const potassium = parseFloat(document.getElementById("potassium").value);

    if (!age || !creatinine || !urea || !sodium || !potassium) {
      result = "⚠️ Please fill all fields.";
      document.getElementById("results").innerHTML = result;
      return;
    }

    let creatinineHigh = 1.3;
    if (age < 12) creatinineHigh = 0.7;
    if (age > 65) creatinineHigh = 1.5;

    if (creatinine > creatinineHigh) result += "⚠️ High Creatinine – <b>Kidney Dysfunction</b>.<br>";
    if (urea > 45) result += "⚠️ High Urea – <b>Kidney Disease</b>.<br>";
    if (sodium < 135) result += "⚠️ Low Sodium – <b>Hyponatremia</b>.<br>";
    if (sodium > 145) result += "⚠️ High Sodium – <b>Hypernatremia</b>.<br>";
    if (potassium < 3.5) result += "⚠️ Low Potassium – <b>Hypokalemia</b>.<br>";
    if (potassium > 5.2) result += "⚠️ High Potassium – <b>Hyperkalemia</b>.<br>";

    if (creatinine <= creatinineHigh && urea <= 45 && sodium >= 135 && sodium <= 145 && potassium >= 3.5 && potassium <= 5.2)
      result += "✅ Kidney function looks <b>Normal</b>.";
  }

  // ---- LIVER ----
  else if (type === "liver") {
    const alt = parseFloat(document.getElementById("alt").value);
    const ast = parseFloat(document.getElementById("ast").value);
    const bilirubin = parseFloat(document.getElementById("bilirubin").value);
    const albumin = parseFloat(document.getElementById("albumin").value);

    if (!alt || !ast || !bilirubin || !albumin) {
      result = "⚠️ Please fill all fields.";
      document.getElementById("results").innerHTML = result;
      return;
    }

    if (alt > 56 || ast > 40) result += "⚠️ Elevated Enzymes – Possible <b>Hepatitis</b>.<br>";
    if (bilirubin > 1.2) result += "⚠️ High Bilirubin – <b>Jaundice</b>.<br>";
    if (albumin < 3.5) result += "⚠️ Low Albumin – <b>Liver/Kidney Disorder</b>.<br>";

    if (alt <= 56 && ast <= 40 && bilirubin <= 1.2 && albumin >= 3.5)
      result += "✅ Liver function looks <b>Normal</b>.";
  }

  // ---- THYROID ----
  else if (type === "thyroid") {
    const age = parseInt(document.getElementById("thyroidAge").value);
    const tsh = parseFloat(document.getElementById("tsh").value);

    if (!age || !tsh) {
      result = "⚠️ Please fill all fields.";
      document.getElementById("results").innerHTML = result;
      return;
    }

    let upper = (age < 12 || age > 65) ? 6.0 : 4.0;
    if (tsh < 0.4) result += "⚠️ Low TSH – <b>Hyperthyroidism</b>.<br>";
    else if (tsh > upper) result += "⚠️ High TSH – <b>Hypothyroidism</b>.<br>";
    else result += "✅ Thyroid function looks <b>Normal</b>.";
  }

  // ---- LIPID ----
  else if (type === "lipid") {
    const age = parseInt(document.getElementById("lipidAge").value);
    const cholesterol = parseFloat(document.getElementById("cholesterol").value);
    const hdl = parseFloat(document.getElementById("hdl").value);
    const ldl = parseFloat(document.getElementById("ldl").value);
    const triglycerides = parseFloat(document.getElementById("triglycerides").value);

    if (!age || !cholesterol || !hdl || !ldl || !triglycerides) {
      result = "⚠️ Please fill all fields.";
      document.getElementById("results").innerHTML = result;
      return;
    }

    let cholLimit = (age < 18) ? 170 : 200;

    if (cholesterol > cholLimit) result += "⚠️ High Cholesterol – <b>Hypercholesterolemia</b>.<br>";
    if (hdl < 40) result += "⚠️ Low HDL – <b>Heart Disease Risk</b>.<br>";
    if (ldl > 130) result += "⚠️ High LDL – <b>Bad Cholesterol</b>.<br>";
    if (triglycerides > 150) result += "⚠️ High Triglycerides – <b>Metabolic Syndrome</b>.<br>";

    if (cholesterol <= cholLimit && hdl >= 40 && ldl <= 130 && triglycerides <= 150)
      result += "✅ Lipid profile looks <b>Normal</b>.";
  }

  result += "</p>";
  document.getElementById("results").innerHTML = result;

  // 🔹 Save prediction to Firestore
  if (currentUser) {
    try {
      await addDoc(collection(db, "users", currentUser.uid, "reportHistory"), {
        reportType: type,
        result: result.replace(/<[^>]*>?/gm, ""), // Strip HTML
        timestamp: serverTimestamp(),
      });
      console.log("✅ Report saved successfully.");
    } catch (err) {
      console.error("❌ Error saving report:", err);
    }
  }
};

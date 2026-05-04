const trainers = [
  // ===== Female Trainers =====
  {
    name: "Bourour Abir",
    specialty: "Swimming Technique & Endurance",
    bio: "Professional swimming coach specialized in improving technique, breathing control, and endurance for all levels.",
    schedule: "Monday & Wednesday 8:00AM"
  },
  {
    name: "Boudraa Nareman",
    specialty: "Competitive Swimming Training",
    bio: "Professional swimming coach specialized in competitive training, speed, and performance in the water.",
    schedule: "Tuesday & Thursday 9:00AM"
  },
  {
    name: "Lashab Mayar",
    specialty: "Hatha Yoga & Flexibility",
    bio: "Professional yoga coach specialized in Hatha Yoga, balance, flexibility, and mental relaxation.",
    schedule: "Monday & Friday 7:00AM"
  },
  {
    name: "Belkhir Sara",
    specialty: "Vinyasa Yoga",
    bio: "Professional yoga coach specialized in Vinyasa Yoga, posture, mobility, and inner balance.",
    schedule: "Tuesday & Saturday 8:00AM"
  },
  {
    name: "Benmiza Malak",
    specialty: "Boxing Technique & Strength",
    bio: "Professional boxing coach specialized in boxing technique, power, speed, and defensive skills.",
    schedule: "Monday & Wednesday 10:00AM"
  },
  {
    name: "Belil Ikram",
    specialty: "Fitness Boxing",
    bio: "Professional boxing coach specialized in fitness boxing, strength, coordination, and endurance.",
    schedule: "Tuesday & Thursday 6:00PM"
  },
  {
    name: "Benharko Wahida",
    specialty: "Cardio Fitness & Endurance",
    bio: "Professional cardio coach specialized in fitness, stamina, burning calories, and heart health.",
    schedule: "Monday & Wednesday 6:00AM"
  },
  {
    name: "Benlabed Fatima",
    specialty: "HIIT & Cardio Training",
    bio: "Professional cardio coach specialized in HIIT, high-intensity workouts, and overall fitness.",
    schedule: "Tuesday & Friday 7:00AM"
  },
  {
    name: "Hamdi Safia",
    specialty: "Muscle Building & Strength Training",
    bio: "Professional bodybuilding coach specialized in muscle growth, strength development.",
    schedule: "Wednesday & Saturday 9:00AM"
  },
  {
    name: "Kenzy Aya",
    specialty: "Bodybuilding & Weight Training",
    bio: "Professional bodybuilding coach specialized in weight training and achieving well-defined physiques.",
    schedule: "Monday & Thursday 5:00PM"
  },
  // ===== Male Trainers =====
  {
    name: "Djebli Kacem",
    specialty: "Swimming Technique & Endurance",
    bio: "Professional swimming coach specialized in improving technique, breathing control, and endurance for all levels.",
    schedule: "Tuesday & Thursday 8:00AM"
  },
  {
    name: "Bensmail Aymen",
    specialty: "Competitive Swimming Training",
    bio: "Experienced swimming trainer helping members improve speed, strength, and performance in the water.",
    schedule: "Monday & Wednesday 9:00AM"
  },
  {
    name: "Bouarour Dayaa",
    specialty: "Hatha Yoga & Flexibility",
    bio: "Certified yoga instructor focused on balance, flexibility, and mental relaxation.",
    schedule: "Tuesday & Friday 8:00AM"
  },
  {
    name: "Staifi Taha",
    specialty: "Vinyasa Yoga",
    bio: "Yoga coach helping members improve posture, mobility, and inner balance through dynamic yoga sessions.",
    schedule: "Monday & Saturday 7:00AM"
  },
  {
    name: "Aribi Hocine",
    specialty: "Boxing Technique & Strength",
    bio: "Professional boxing trainer focused on improving power, speed, and defensive skills.",
    schedule: "Wednesday & Friday 5:00PM"
  },
  {
    name: "Maghoul Abderahmane",
    specialty: "Fitness Boxing",
    bio: "Helps members build strength, coordination, and endurance through boxing-based workouts.",
    schedule: "Tuesday & Thursday 6:00PM"
  },
  {
    name: "Bouchama Bilal",
    specialty: "Cardio Fitness & Endurance",
    bio: "Cardio specialist helping members improve stamina, burn calories, and boost heart health.",
    schedule: "Monday & Wednesday 7:00AM"
  },
  {
    name: "Djidel Anis",
    specialty: "HIIT & Cardio Training",
    bio: "Focused on high-intensity workouts that improve endurance and overall fitness.",
    schedule: "Tuesday & Saturday 6:00AM"
  },
  {
    name: "Rebouh Mouaad",
    specialty: "Muscle Building & Strength Training",
    bio: "Bodybuilding coach specialized in muscle growth, strength development, and training programs.",
    schedule: "Monday & Thursday 4:00PM"
  },
  {
    name: "Boudraa Abedelmouman",
    specialty: "Bodybuilding & Weight Training",
    bio: "Experienced trainer helping members achieve strong and well-defined physiques.",
    schedule: "Wednesday & Friday 5:00PM"
  }
];
let searchInput = document.getElementById("searchinput");
let allCards = document.querySelectorAll("article[id='bord']"); 

function getTrainer(card) {
  const name = card.querySelector("ul#trainer li:nth-child(1)"); 
  const specialty = card.querySelector("ul#trainer li:nth-child(2)");
  if (!name || !specialty) return { name: "", specialty: "" }; 
  const nam = name.textContent.trim().toLowerCase(); 
  const spe = specialty.textContent.trim().toLowerCase();
    return { name: nam, specialty: spe }; 
}
 
searchInput.addEventListener("input", function () { 
  const Rvalue = this.value.trim().toLowerCase();
  const female = document.querySelector("section.wom");
  const male = document.querySelector("section.men"); 
 
  let femaleco = 0; 
  let maleco = 0;
 
  allCards.forEach((card) => { 
    const { name, specialty } = getTrainer(card); 
    const chek = name.includes(Rvalue) || specialty.includes(Rvalue); 
    card.style.display = chek ? "" : "none"; 

    if (chek) { 
      if (female) femaleco++;
      if (male) maleco++;
    }
  });

  const femaleR = document.querySelector("section.wom #noResult");
  const maleR = document.querySelector("section.men #noResult"); 

   if (femaleR) {
      femaleR.style.display = femaleco === 0 ? "block" : "none"; 
  }

if (maleR) {
    maleR.style.display = maleco === 0 ? "block" : "none";
}
});

const modal = document.getElementById("modle");
const modalPhoto = document.getElementById("photo"); 
const modalName = document.getElementById("name"); 
const modalSpecialty = document.getElementById("specialty");
const modalBio = document.getElementById("bio"); 
const modalSchedule = document.getElementById("schedule"); 
const closeBtn = document.getElementById("close");
 
document.querySelectorAll("a#details").forEach((link, index) => { 
  link.addEventListener("click", function (e) { 
    e.preventDefault(); 
                       
    const trainer = trainers[index];
    const card = allCards[index];
    const img = card.querySelector("img");
    modalPhoto.src = img ? img.src : "";  
    modalPhoto.alt = trainer.name;
    modalName.textContent = trainer.name;
    modalSpecialty.textContent = "🏅 " + trainer.specialty ; 
    modalBio.textContent = trainer.bio; 
    modalSchedule.textContent = "🗓️ Schedule: " + trainer.schedule; 
 
    modal.style.display = "flex"; 
  });
});

closeBtn.addEventListener("click", closeModal);
 
modal.addEventListener("click", function (e) { 
  if (e.target === modal) closeModal();
});
 
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape")
    e.preventDefault(); 
    closeModal();
});
 
function closeModal() {
  modal.style.display = "none";
}
   

      
  

  

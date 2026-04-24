/* 7atinahoum fi araay*/
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
  /*============================================================================================*/
// ===== Search Functionality =====
const searchInput = document.getElementById("searchinput");
const allCards = document.querySelectorAll("article[id='bord']"); // هذا CSS Selector يعني: اختر كل عنصر <article> الذي عنده id="bord"

function getTrainer(card) { //دالة تأخذ بطاقة مدرب واحدة كمعامل، وترجع اسمه وتخصصه.
  const name = card.querySelector("ul#trainer li:nth-child(1)"); //na9dar n3awdha b "card.querySelector("[data-field='name']")"
  const specialty = card.querySelector("ul#trainer li:nth-child(2)");
  if (!name || !specialty) return { name: "", specialty: "" }; //لو ما لقى أحد العنصرين → يرجع قيم فارغة بدل ما يعطي خطأ
  const nam = name.textContent.replace("name:", "").trim().toLowerCase(); // example textContent ="name:Bourour Abir" => .replace("name:", "")="Bourour Abir"
  const spe = specialty.textContent.replace("Specialty:", "").trim().toLowerCase();
    return { name: nam, specialty: spe }; //يرجع object يحتوي الاسم والتخصص جاهزين للمقارنة مع ما يكتبه المستخدم.
}
 
searchInput.addEventListener("input", function () { // ينفّذ الكود كل حرف يكتبه المستخدم
  const query = this.value.trim().toLowerCase();//ما كتبه المستخدم في حقل البحث
  const female = document.querySelector("section.wom");//يمسك قسم المدربات 
  const male = document.querySelector("section.men"); //يمسك قسم المدربين 
 
  let femaleco = 0; //عدادان يبدآن من صفر في كل مرة يكتب المستخدم حرفاً، ويحسبان:
  let maleco = 0; //كم بطاقة ظاهرة في قسم النساء/ كم بطاقة ظاهرة في قسم الرجال
 
  allCards.forEach((card) => {
    const { name, specialty } = getTrainer(card); //تستدعي الدالة اللي شرحناها قبل وتجيب اسم وتخصص البطاقة الحالية
    const chek = name.includes(query) || specialty.includes(query); //يتحقق: هل كلمة البحث موجودة في الاسم أو التخصص؟
    card.style.display = chek ? "" : "none"; //لو chek = true → يظهر البطاقة (display: "")
                                             //لو chek = false → يخفي البطاقة (display: "none") 
    if (chek) { //فقط لو البطاقة ظاهرة (chek = true):
      if (female && female.contains(card)) femaleco++; //femaleSection.contains(card) → يسأل: هل هذه البطاقة داخل قسم النساء؟
      if (male && male.contains(card)) maleco++;
    }
  });

  const femaleR = document.querySelector("section.wom #noResult"); //يبحث مباشرة عن #noResult الموجود داخل section.wom
  const maleR = document.querySelector("section.men #noResult"); 

   if (femaleR) { //femaleR هي عنصر HTML مش رقم، فقيمتها تكون: 
                  //لو لقى العنصر في الصفحة
                  //femaleR = <p id="noResult">No trainers found</p>  → truthy ✅ OR
                  //femaleR = null  → falsy ❌ 
      femaleR.style.display = femaleco === 0 ? "block" : "none"; //لو femaleco = 0 → أظهر الرسالة، غير كذلك أخفها
  }

if (maleR) {
    maleR.style.display = maleco === 0 ? "block" : "none";
}
});

const modal = document.getElementById("modle"); //يمسك الـ Modal كاملاً (الخلفية الداكنة + الصندوق)
const modalPhoto = document.getElementById("photo"); //يمسك عنصر الصورة داخل الـ Modal
const modalName = document.getElementById("name"); //يمسك عنصر الاسم داخل الـ Modal
const modalSpecialty = document.getElementById("specialty"); //يمسك عنصر التخصص داخل الـ Modal
const modalBio = document.getElementById("bio"); //يمسك عنصر السيرة داخل الـ Modal
const modalSchedule = document.getElementById("schedule"); //يمسك عنصر الجدول الزمني داخل الـ Modal
const closeBtn = document.getElementById("close");//يمسك زر الإغلاق ×
 
// Attach click to each "More details" link
document.querySelectorAll("a#details").forEach((link, index) => { //querySelectorAll("a#details") → يجمع كل روابط "More details" في الصفحة
                                                                  //forEach((link, index) → يمر عليها واحدة واحدة
                                                                  //link → الرابط الحالي
                                                                  //index → رقم ترتيبه (0، 1، 2، 3...)
                                                                  //رابط بطاقة Bourour Abir   → index = 0
                                                                  //رابط بطاقة Boudraa Nareman → index = 1 .......
  link.addEventListener("click", function (e) { //لما المستخدم يضغط على هذا الرابط → نفّذ الكود داخله
    e.preventDefault(); //preventDefault() → يمنع الرابط من التنقل لصفحة أخرى  
                        //لأن الرابط عنده href="#" وبدونها الصفحة ترجع للأعلى
    const trainer = trainers[index]; //يجيب بيانات المدرب من المصفوفة باستخدام نفس رقم index الترتيب 
    if (!trainer) return;  //لو ما لقى المدرب → يوقف، تأمين ضد الأخطاء hadi 9ader na7iha
    //ملء الـ Modal بالبيانات
    const card = allCards[index];
    const img = card.querySelector("img");
    modalPhoto.src = img ? img.src : "";  //يضع صورة المدرب في عنصر الصورة
    modalPhoto.alt = trainer.name;//يضع اسمه كنص بديل للصورة
    modalName.textContent = trainer.name;// يكتب الاسم داخل عنصر الاسم
    modalSpecialty.textContent = "🏅 " + trainer.specialty ; //يكتب التخصص والخبرة معاً، مثال:
    modalBio.textContent = trainer.bio; //يكتب السيرة داخل عنصر البايو
    modalSchedule.textContent = "🗓️ Schedule: " + trainer.schedule; //يكتب الجدول الزمني، مثال:
 
    modal.style.display = "flex"; //يظهر الـ Modal عن طريق تغيير display من none إلى flex
    document.body.style.overflow = "hidden"; //يمنع تمرير الصفحة للأسفل وهو Modal مفتوح، حتى لا تتحرك الخلفية خلفه
  });
});

// Close on button click
closeBtn.addEventListener("click", closeModal);//لما المستخدم يضغط على زر × → ينفّذ دالة closeModal مباشرة
 
// Close on outside click
modal.addEventListener("click", function (e) { //يراقب أي ضغطة تحصل على عنصر modal (الخلفية الداكنة كاملة)
  if (e.target === modal) closeModal(); //e.target → العنصر اللي ضغط عليه المستخدم بالضبط
                                        //يسأل: هل الضغطة كانت على الخلفية الداكنة نفسها؟ لو نعم → يغلق الـ Modal
});
 
// Close on Escape key
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape")
    e.preventDefault(); // ✅ يمنع الـ scroll
    closeModal();
});
 
function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "";
}
   

      
  

  

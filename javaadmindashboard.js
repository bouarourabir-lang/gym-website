// ---------- Default seed data ----------
const defaultMembers  = [ //نُعرّف متغيراً ثابتاً يحتوي على مصفوفة (array) من الأعضاء الافتراضيين — هؤلاء يظهرون أول مرة تُفتح الصفحة.
  { id: 1, name: "Ahmed Said",      email: "ahmed@gym.dz",    phone: "0551234567", plan: "Bronze", joinDate: "2026-03-13", status: "Pending"  },
  { id: 2, name: "Khaloug Kamal",   email: "kamal@gym.dz",    phone: "0662345678", plan: "Silver", joinDate: "2026-03-12", status: "Active"   },
  { id: 3, name: "Azouz Mounsouf",  email: "azouz@gym.dz",    phone: "0773456789", plan: "Silver", joinDate: "2026-03-12", status: "Active"   },
  { id: 4, name: "Kahloush Marwa",  email: "marwa@gym.dz",    phone: "0554567890", plan: "Gold",   joinDate: "2026-03-11", status: "Expired"  },
  { id: 5, name: "Marlawi Souaad",  email: "souaad@gym.dz",   phone: "0665678901", plan: "Gold",   joinDate: "2026-03-09", status: "Active"   },
];
 
function getMembers() { // تعريف دالة مهمتها جلب قائمة الأعضاء من localStorage.
  let data = localStorage.getItem("gymMembers"); //تبحث في ذاكرة المتصفح عن مفتاح "gymMembers" وتحفظ النتيجة في data.
  if (data) {
    return JSON.parse(data); //إذا وُجدت بيانات → حوّلها من نص JSON إلى array وأرجعها.
  } else {
    saveMembers(defaultMembers); //إذا ما وُجدت بيانات (المرة الأولى) → احفظ البيانات الافتراضية أولاً ثم أرجعها.
    return defaultMembers;
  }
}
 
function saveMembers(list) { //تستقبل قائمة الأعضاء كمعامل اسمه list. هذه الدالة تُستدعى في 3 حالات: عند الإضافة، التعديل، والحذف.
  localStorage.setItem("gymMembers", JSON.stringify(list)); //JSON.stringify(list) → تحوّل الـ array إلى نص لأن localStorage يقبل نصوص فقط
                                                            //setItem(...) → تحفظه في ذاكرة المتصفح
}
// ─── 3. المتغيرات الرئيسية ───────────────────────────────
let members   = getMembers(); //عند تشغيل الصفحة، نستدعي getMembers() مباشرة ونحفظ النتيجة في members — هذا المتغير هو القائمة الحية التي يعمل عليها كامل الكود.
let editingId = null; //null → نحن في وضع إضافة عضو جديد
                      //رقم → نحن في وضع تعديل عضو موجود، والرقم هو ID ذلك العضو
let deleteId  = null;//يحفظ ID العضو المراد حذفه عند الضغط على زر Delete، ويبقى null إذا ما ضغطنا على شيء.
/**members     → القائمة الكاملة للأعضاء (تُقرأ وتُعدَّل طول الوقت)
editingId   → يحدد هل نضيف أم نعدّل
deleteId    → يحفظ من نريد حذفه */
function buildUI() { //تعريف الدالة الرئيسية التي تبني كامل واجهة إدارة الأعضاء.
  let main = document.querySelector("main"); //تبحث عن عنصر <main> في الصفحة. إذا ما وُجد → توقف فوراً، لأنه ما في مكان نضع فيه الواجهة.
  if (!main) return;
 
  let oldSection = main.querySelector("section:last-of-type"); //تبحث عن آخر <section> موجود في <main> (وهو الجدول الستاتيكي القديم من HTML الأصلي) وتحذفه، حتى لا يتكرر مع الجدول الجديد.
  if (oldSection) oldSection.remove();
 
  main.innerHTML += `
    <hr>
    <section id="member-section">
      <h2>👥 Member Management 👥</h2>
 
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin:16px 0 8px;">
        <input id="searchInput" type="text" placeholder="🔍 Search by name or email"
          style="padding:8px 12px; border:1.5px solid #444; border-radius:8px;
                 background:#3c096c; color:#eee; flex:1; min-width:160px;">
 
        <select id="planFilter"
          style="padding:8px 12px; border:1.5px solid #444; border-radius:8px;
                 background:#3c096c; color:#eee;">
          <option value="All">All Plans</option>
          <option value="Bronze">Bronze</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
        </select>
 
        <button onclick="openAddModal()"
          style="padding:8px 18px; background: #7580fc; color: #fff;
                 border:none; border-radius:8px; cursor:pointer; font-weight:600;">
          + Add Member
        </button>
      </div>
 
      <p id="memberCount" style="font-size:.85rem; opacity:.65;"></p>
 
      <div style="overflow-x:auto;">
        <table style="width:100%; border-collapse:collapse; font-size:.9rem;">
          <thead>
            <tr style="background:#1a1a2e; color:#a0a0c0;">
              <th style="padding:10px 14px; text-align:left;">#</th>
              <th style="padding:10px 14px; text-align:left;">Name</th>
              <th style="padding:10px 14px; text-align:left;">Email</th>
              <th style="padding:10px 14px; text-align:left;">Phone</th>
              <th style="padding:10px 14px; text-align:left;">Plan</th>
              <th style="padding:10px 14px; text-align:left;">Join Date</th>
              <th style="padding:10px 14px; text-align:left;">Status</th>
              <th style="padding:10px 14px; text-align:left;">Actions</th>
            </tr>
          </thead>
          <tbody id="memberBody"></tbody>
        </table>
      </div>
    </section>
 
    
    <div id="memberModal" style="display:none; position:fixed; inset:0;
         background:rgba(0,0,0,.7); z-index:9999;
         align-items:center; justify-content:center;">
      <div style="background:#16213e; border:1px solid #2d2d5a; border-radius:14px;
                  padding:28px; width:100%; max-width:500px;">
        <h3 id="modalTitle" style="margin:0 0 18px; color:#c0c8ff;"></h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
          <label style="display:flex; flex-direction:column; gap:5px; color:#a0a0c0; font-size:.85rem;">
            Name
            <input id="f-name" type="text" placeholder="Full name"
              style="padding:8px; background:#0d1117; border:1.5px solid #333; border-radius:7px; color:#eee;">
          </label>
          <label style="display:flex; flex-direction:column; gap:5px; color:#a0a0c0; font-size:.85rem;">
            Email
            <input id="f-email" type="email" placeholder="email@gym.dz"
              style="padding:8px; background:#0d1117; border:1.5px solid #333; border-radius:7px; color:#eee;">
          </label>
          <label style="display:flex; flex-direction:column; gap:5px; color:#a0a0c0; font-size:.85rem;">
            Phone
            <input id="f-phone" type="tel" placeholder="05XXXXXXXX"
              style="padding:8px; background:#0d1117; border:1.5px solid #333; border-radius:7px; color:#eee;">
          </label>
          <label style="display:flex; flex-direction:column; gap:5px; color:#a0a0c0; font-size:.85rem;">
            Join Date
            <input id="f-date" type="date"
              style="padding:8px; background:#0d1117; border:1.5px solid #333; border-radius:7px; color:#eee;">
          </label>
          <label style="display:flex; flex-direction:column; gap:5px; color:#a0a0c0; font-size:.85rem;">
            Plan
            <select id="f-plan" style="padding:8px; background:#0d1117; border:1.5px solid #333; border-radius:7px; color:#eee;">
              <option>Bronze</option>
              <option>Silver</option>
              <option>Gold</option>
            </select>
          </label>
          <label style="display:flex; flex-direction:column; gap:5px; color:#a0a0c0; font-size:.85rem;">
            Status
            <select id="f-status" style="padding:8px; background:#0d1117; border:1.5px solid #333; border-radius:7px; color:#eee;">
              <option>Active</option>
              <option>Pending</option>
              <option>Expired</option>
            </select>
          </label>
        </div>
        <p id="formError" style="display:none; color:#f87171; font-size:.83rem; margin-top:10px;"></p>
        <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:18px;">
          <button onclick="saveMember()"
            style="padding:8px 20px; background:#5865f2; color: #fff;
                   border:none; border-radius:8px; cursor:pointer; font-weight:600;">Save</button>
          <button onclick="closeModal()"
            style="padding:8px 20px; background:#3a3a50; color:#ddd;
                   border:none; border-radius:8px; cursor:pointer;">Cancel</button>
        </div>
      </div>
    </div>

    <div id="confirmModal" style="display:none; position:fixed; inset:0;
         background:rgba(69, 60, 60, 0.7); z-index:9999;
         align-items:center; justify-content:center;">
      <div style="background: #acc2ff; border:1px solid #5a2d2d; border-radius:14px;
                  padding:28px; max-width:360px; text-align:center;">
        <p style="font-size:1rem; margin-bottom:20px;">Are you sure you want to delete this member?</p>
        <div style="display:flex; gap:10px; justify-content:center;">
          <button onclick="doDelete()"
            style="padding:8px 20px; background:#dc3545; color:#fff;
                   border:none; border-radius:8px; cursor:pointer; font-weight:600;">Yes, Delete</button>
          <button onclick="closeConfirm()"
            style="padding:8px 20px; background:#3a3a50; color:#ddd;
                   border:none; border-radius:8px; cursor:pointer;">Cancel</button>
        </div>
      </div>
    </div>
  `;
 
  document.getElementById("searchInput").addEventListener("input", showTable); //كل ما يكتب المدير حرفاً في البحث → تُستدعى showTable() فوراً لتصفية النتائج.
  document.getElementById("planFilter").addEventListener("change", showTable); //كل ما يغيّر المدير الخطة في القائمة المنسدلة → تُستدعى showTable() لتصفية النتائج.

  showTable(); //تعرض الجدول أول مرة بكل الأعضاء فور بناء الواجهة، ثم تنتهي الدالة.
  /* ملخص ما تفعله buildUI
1. تحذف الجدول القديم
2. تُضيف شريط البحث + الفلتر + زر الإضافة
3. تُضيف الجدول الفارغ
4. تُضيف نافذة الإضافة/التعديل
5. تُضيف نافذة تأكيد الحذف
6. تربط البحث والفلتر بدالة showTable
7. تعرض الأعضاء أول مرة */
}

// ─── 5. عرض الجدول ───────────────────────────────────────
function showTable() { //تعريف الدالة التي تعرض الأعضاء في الجدول — تُستدعى في كل مرة يبحث أو يفلتر المدير.
  let search = document.getElementById("searchInput").value.toLowerCase(); //تجلب النص اللي كتبه المدير في حقل البحث وتحوّله لـ أحرف صغيرة حتى يكون البحث غير حساس لحالة الأحرف.
  let plan   = document.getElementById("planFilter").value;//تجلب قيمة الفلتر المختارة: "All" أو "Bronze" أو "Silver" أو "Gold".
  // فلترة الأعضاء
  let filtered = [];//مصفوفة فارغة — ستُملأ بالأعضاء اللي يطابقون البحث والفلتر.
  for (let i = 0; i < members.length; i++) { //نمر على كل الأعضاء واحداً واحداً.
    let m = members[i]; //نحفظ العضو الحالي في m اختصاراً حتى لا نكتب members[i] في كل سطر.
    let matchSearch = m.name.toLowerCase().includes(search) || m.email.toLowerCase().includes(search); //نتحقق هل النص المكتوب موجود في الاسم أو الإيميل.
    let matchPlan   = (plan === "All") || (m.plan === plan); //إذا المدير اختار "All" → كل الأعضاء يعدّون ✅
                                                             //إذا اختار "Gold" → فقط أعضاء Gold يعدّون ✅
    if (matchSearch && matchPlan) filtered.push(m); //إذا العضو يطابق البحث والفلتر معاً → أضفه لقائمة filtered.
  }
 
  // بناء صفوف الجدول
  let tbody = document.getElementById("memberBody"); //نجلب جسم الجدول (<tbody>) من الصفحة.
  tbody.innerHTML = ""; //نمسح كل الصفوف القديمة قبل ما نرسم الجديدة — حتى لا تتراكم.
 
  if (filtered.length === 0) { //إذا ما وُجد أي عضو يطابق البحث → اعرض رسالة "لا يوجد نتائج".
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:20px; opacity:.6;">No members found.</td></tr>';
  } else { //إذا في نتائج → نمر عليها واحدة واحدة ونبني صف لكل عضو.
    for (let j = 0; j < filtered.length; j++) {
      let m = filtered[j];
      //+= تعني أضف الصف الجديد بدل ما تستبدل — كل تكرار يضيف صف جديد.
      tbody.innerHTML += `
        <tr style="border-bottom:1px solid #2d2d40;">
          <td style="padding:10px 14px;">${j + 1}</td>
          <td style="padding:10px 14px;">${m.name}</td>
          <td style="padding:10px 14px;">${m.email}</td>
          <td style="padding:10px 14px;">${m.phone}</td>
          <td style="padding:10px 14px;">${planBadge(m.plan)}</td>
          <td style="padding:10px 14px;">${m.joinDate}</td>
          <td style="padding:10px 14px;">${statusBadge(m.status)}</td>
          <td style="padding:10px 14px; display:flex; gap:6px;">
            <button onclick="openEditModal(${m.id})"
              style="padding:5px 10px; background:#1d4e89; color:#90c2ff;
                     border:none; border-radius:6px; cursor:pointer;">Edit</button>
            <button onclick="openConfirm(${m.id})"
              style="padding:5px 10px; background:#4a1020; color:#ff8080;
                     border:none; border-radius:6px; cursor:pointer;">Delete</button>
          </td>
        </tr>`;
    }//<td>${j + 1}</td>         رقم الصف — j يبدأ من 0 فنضيف 1 حتى يبدأ العرض من 1.

     /**<td>${m.name}</td>
      <td>${m.email}</td>
      <td>${m.phone}</td>
      بيانات العضو الأساسية مباشرة من الـ object. */
      //تستدعي دالة planBadge() التي ترجع HTML مُنسَّق بألوان حسب الخطة (Bronze / Silver / Gold).
      //statusBadge نفس فكرة planBadge — ترجع badge ملوّن حسب الحالة (Active / Pending / Expired).
      //زر Edit — عند الضغط يستدعي openEditModal() ويمرر له ID هذا العضو تحديداً.
      //زر Delete — يستدعي openConfirm() بنفس الـ ID لفتح نافذة التأكيد.
      
  }
 
  document.getElementById("memberCount").textContent =
    "Showing " + filtered.length + " of " + members.length + " members";
}/**يحدّث النص أسفل شريط البحث.
      مثال:
      filtered.length = 2   (نتائج البحث)
      members.length  = 5   (الكل)
      → "Showing 2 of 5 members" */
      /**ملخص سير الدالة
1. جلب نص البحث والفلتر المختار
2. فلترة الأعضاء اللي يطابقون الاثنين
3. مسح الجدول القديم
4. إذا ما في نتائج → رسالة "No members found"
5. إذا في نتائج → بناء صف لكل عضو مع زر Edit و Delete
6. تحديث عداد "Showing X of Y members" */
function planBadge(plan) { //دالة تستقبل اسم الخطة: "Bronze" أو "Silver" أو "Gold".
  let style = ""; //متغير فارغ سيحمل CSS الخاص بلون الخطة — فارغ في البداية حتى نملأه في الشروط.
  if (plan === "Bronze") style = "color: #cd7f32; border:1px solid #cd7f32; background:#7c4a0033;";
  if (plan === "Silver") style = "color: #858181; border:1px solid #aaa;    background:#4a4a6033;";
  if (plan === "Gold")   style = "color: #9a8304; border:1px solid #ffd700; background:#6a520033;";
  return '<span style="padding:3px 10px; border-radius:20px; font-size:.78rem; font-weight:600; ' + style + '">' + plan + '</span>'; 
}
 
function statusBadge(status) { //نفس المنطق تماماً لكن للحالات بدل الخطط:
  let style = ""; //نفس الفكرة — متغير فارغ يُملأ حسب الحالة.
  if (status === "Active")  style = "color:#4ade80; border:1px solid #4ade80; background:#0f3a1f;";
  if (status === "Pending") style = "color:#fbbf24; border:1px solid #fbbf24; background:#3a2e00;";
  if (status === "Expired") style = "color:#f87171; border:1px solid #f87171; background:#3a0a0a;";
  return '<span style="padding:3px 10px; border-radius:20px; font-size:.78rem; font-weight:600; ' + style + '">' + status + '</span>';
}

function openAddModal() { //تُستدعى عند الضغط على زر "+ Add Member".
  editingId = null; //نضع null لأننا في وضع إضافة — لا يوجد عضو نعدّله.
  document.getElementById("modalTitle").textContent = "Add Member"; //نغيّر عنوان النافذة إلى "Add Member".
  document.getElementById("f-name").value   = ""; //نفرّغ حقول الاسم والإيميل والهاتف — لأن النموذج ممكن يكون استُخدم قبل كذا وفيه بيانات قديمة.
  document.getElementById("f-email").value  = "";
  document.getElementById("f-phone").value  = "";
  document.getElementById("f-date").value   = new Date().toISOString().slice(0, 10); //نملأ حقل التاريخ بتاريخ اليوم تلقائياً. نفككه:
  /**new Date()           →  الوقت الحالي كاملاً
     .toISOString()       →  يحوله لنص: "2026-04-25T14:30:00.000Z"
     .slice(0, 10)        →  يأخذ أول 10 أحرف فقط: "2026-04-25" */
  document.getElementById("f-plan").value   = "Bronze"; //نضع قيم افتراضية — الخطة Bronze والحالة Active، لأنها الأكثر شيوعاً عند إضافة عضو جديد.
  document.getElementById("f-status").value = "Active";
  document.getElementById("formError").style.display = "none"; //نخفي رسالة الخطأ إذا كانت ظاهرة من استخدام سابق.
  document.getElementById("memberModal").style.display = "flex"; //نُظهر النافذة المنبثقة — flex بدل none حتى تظهر وتكون محتوياتها في المنتصف.
}
 
function openEditModal(id) { //تستقبل ID العضو المراد تعديله — يأتي من زر Edit في الجدول.
  editingId = id; //نحفظ الـ ID في المتغير العام editingId حتى تعرف دالة saveMember() لاحقاً أننا في وضع تعديل.
 
  // ابحث عن العضو
  let member = null; //متغير سيحمل بيانات العضو — فارغ في البداية.
  for (let i = 0; i < members.length; i++) {  //نبحث في قائمة الأعضاء عن العضو اللي يطابق الـ ID:
    if (members[i].id === id) { member = members[i]; break; } //إذا وجدناه → نحفظه في member ونوقف البحث بـ break
  }
  if (!member) return; //إذا ما وُجد العضو (حالة نادرة) → نوقف الدالة فوراً. هذا أمان ضد أي خطأ غير متوقع. ***na7iha***
 
  document.getElementById("modalTitle").textContent = "Edit Member"; //نغيّر عنوان النافذة إلى "Edit Member" — عكس openAddModal.
  document.getElementById("f-name").value   = member.name; //نملأ كل حقل ببيانات العضو الحالية — حتى يرى المدير القيم الموجودة ويعدّل ما يريد فقط.
  document.getElementById("f-email").value  = member.email;
  document.getElementById("f-phone").value  = member.phone;
  document.getElementById("f-date").value   = member.joinDate;
  document.getElementById("f-plan").value   = member.plan;
  document.getElementById("f-status").value = member.status;
  document.getElementById("formError").style.display = "none"; //نفس آخر سطرين في openAddModal — نخفي الخطأ ونُظهر النافذة.
  document.getElementById("memberModal").style.display = "flex";
}
 
function closeModal() { //تُستدعى عند الضغط على زر "Cancel".
  document.getElementById("memberModal").style.display = "none"; //نخفي النافذة بإعادة display إلى none.
  editingId = null; //نعيد editingId إلى null — تنظيف للحالة حتى لا يبقى ID قديم محفوظ.
}

// ─── 8. حفظ العضو ────────────────────────────────────────
function saveMember() { //تُستدعى عند الضغط على زر "Save" في النافذة المنبثقة.
  let name   = document.getElementById("f-name").value.trim(); //نجلب قيمة كل حقل. .trim() تحذف المسافات الزائدة من البداية والنهاية.
  let email  = document.getElementById("f-email").value.trim();
  let phone  = document.getElementById("f-phone").value.trim();
  let date   = document.getElementById("f-date").value; //نجلب التاريخ والخطة والحالة — هذه لا تحتاج .trim() لأنها تأتي من قوائم منسدلة أو حقل تاريخ منظّم.
  let plan   = document.getElementById("f-plan").value;
  let status = document.getElementById("f-status").value;
 
  // تحقق من الحقول
  if (!name)                         return showFormError("Name is required."); //إذا name فارغ → اعرض رسالة خطأ وأوقف الدالة فوراً بسبب return. لن يُكمل الكود للأسفل.
  if (!email || !email.includes("@")) return showFormError("Valid email is required."); //!email → إذا الحقل فارغ || !email.includes("@") → إذا ما يحتوي على @
  if (!phone)                        return showFormError("Phone is required.");
  if (!date)                         return showFormError("Join date is required.");
 
  if (editingId !== null) { /**نتحقق من المتغير العام editingId:
                           إذا فيه رقم → نحن في وضع تعديل
                          إذا null → نحن في وضع إضافة       */
    // تعديل عضو موجود
    for (let i = 0; i < members.length; i++) {
      if (members[i].id === editingId) { //نبحث عن العضو اللي يطابق editingId.
        members[i].name     = name; //نستبدل كل قيمة قديمة بالقيمة الجديدة من النموذج — مباشرة على نفس العضو في المصفوفة.
        members[i].email    = email;
        members[i].phone    = phone;
        members[i].joinDate = date;
        members[i].plan     = plan;
        members[i].status   = status;
        break; //وجدنا العضو وعدّلناه → نوقف البحث، لا فائدة من الاستمرار.
      }
    }
  } else {
    // إضافة عضو جديد
    let newId = members.length > 0 ? members[members.length - 1].id + 1 : 1; //نحسب ID جديد وفريد. نفككه:
    members.push({ id: newId, name: name, email: email, phone: phone, plan: plan, joinDate: date, status: status });//نضيف object جديد في نهاية مصفوفة members بكل البيانات المُدخلة.
  }
 
  saveMembers(members); //نحفظ القائمة المحدّثة في localStorage — حتى لا تضيع البيانات عند تحديث الصفحة.
  closeModal();//نغلق النافذة المنبثقة.
  showTable();//نعيد رسم الجدول بالبيانات الجديدة — حتى يرى المدير التغيير فوراً.
}
 
function showFormError(msg) {
  let el = document.getElementById("formError"); //نجلب عنصر رسالة الخطأ من الصفحة.
  el.textContent = msg; //نضع فيه نص الخطأ مثل "Name is required.".
  el.style.display = "block"; //نُظهره — كان مخفياً بـ display:none من البداية.
}

// ─── 9. الحذف ────────────────────────────────────────────
function openConfirm(id) { //تُستدعى عند الضغط على زر "Delete" في الجدول، وتستقبل ID العضو المراد حذفه.
  deleteId = id; //نحفظ الـ ID في المتغير العام deleteId — حتى تعرف دالة doDelete() لاحقاً من تحذف.
  document.getElementById("confirmModal").style.display = "flex"; //نُظهر نافذة "Are you sure?" — المدير يختار Yes أو Cancel.
}
 
function closeConfirm() {
  document.getElementById("confirmModal").style.display = "none"; //نخفي النافذة.
  deleteId = null; //نمسح الـ ID المحفوظ — تنظيف حتى لا يبقى ID قديم يسبب حذف خاطئ لاحقاً.
}
 
function doDelete() { //تُستدعى فقط عند الضغط على "Yes, Delete".
  let newList = []; //مصفوفة جديدة فارغة — ستحتوي كل الأعضاء ما عدا العضو المحذوف.
  for (let i = 0; i < members.length; i++) { /**نمر على كل الأعضاء:
إذا ID العضو يختلف عن deleteId → أضفه لـ newList ✅
إذا ID العضو يساوي deleteId → تجاهله ❌ (هذا هو المحذوف) */
    if (members[i].id !== deleteId) newList.push(members[i]);
  }
  members = newList; //نستبدل القائمة القديمة بالجديدة التي لا تحتوي العضو المحذوف.
  saveMembers(members); //نحفظ القائمة الجديدة في localStorage — حتى يبقى الحذف بعد تحديث الصفحة.
  closeConfirm(); //نغلق نافذة التأكيد.
  showTable(); //نعيد رسم الجدول — المدير يرى العضو اختفى فوراً.
}
 
 
// ─── 10. إحصائيات Dashboard ──────────────────────────────
function updateStats() {//تُستدعى بعد كل إضافة / تعديل / حذف لتحديث الإحصائيات تلقائياً.

 
  // 1. إجمالي الأعضاء
  let total = members.length;//members.length يعطي عدد العناصر في المصفوفة مباشرة.
 
  // 2. الاشتراكات النشطة
  let active = 0; //عداد يبدأ من الصفر، سيزيد بـ 1 لكل عضو Active.
  for (let i = 0; i < members.length; i++) {
    if (members[i].status === "Active") active++; //نمر على كل الأعضاء — إذا حالة العضو "Active" نزيد العداد بـ 1.
  }
 
  // 3. ثلاثة عدادات — واحد لكل خطة، كلها تبدأ من الصفر.
  let bronzeCount = 0;
  let silverCount = 0;
  let goldCount   = 0;
  for (let i = 0; i < members.length; i++) { //نمر على كل الأعضاء مرة واحدة ونزيد العداد المناسب. لاحظ أن الثلاثة شروط بـ if وليس else if — لأن كل عضو له خطة واحدة فقط فلن يدخل أكثر من شرط.
    if (members[i].plan === "Bronze") bronzeCount++;
    if (members[i].plan === "Silver") silverCount++;
    if (members[i].plan === "Gold")   goldCount++;
  }
 
  // 4. الخطة الأكثر شعبية
  let popularPlan = "Bronze";
  let popularCount = bronzeCount; //نبدأ بافتراض أن Bronze هي الأكثر شعبية — سنقارن معها الباقيتين.
  if (silverCount > popularCount) { popularPlan = "Silver"; popularCount = silverCount; } //إذا Silver أكبر من الحالية → Silver هي الأكثر شعبية، نحدّث المتغيرين.
  if (goldCount   > popularCount) { popularPlan = "Gold";   popularCount = goldCount;   }
 
  // تحديث الأرقام في الصفحة
  let elTotal    = document.getElementById("stat-total");
  let elActive   = document.getElementById("stat-active");
  let elClasses  = document.getElementById("stat-classes");
  let elPopular  = document.getElementById("stat-popular");
 
  if (elTotal)   elTotal.textContent   = total;
  if (elActive)  elActive.textContent  = active;
  if (elClasses) elClasses.textContent = "7"; //  ثابت لأن عدد الحصص لا يتغير مع الأعضاء
  if (elPopular) elPopular.textContent = popularPlan + " (" + popularCount + ")";
 
  // تحديث الرسم البياني
  drawChart(bronzeCount, silverCount, goldCount, total); //نمرر الأرقام المحسوبة لدالة drawChart() حتى ترسم الأشرطة بالارتفاع الصحيح.
 
  /**1. احسب إجمالي الأعضاء           → members.length
2. عدّ الأعضاء Active             → loop + if
3. عدّ كل خطة                    → loop + 3 عدادات
4. قارن العدادات لإيجاد الأعلى   → 2 مقارنات
5. حدّث الأرقام في الصفحة        → textContent
6. أرسل الأرقام لدالة الرسم      → drawChart() */
}
function drawChart(bronze, silver, gold, total) { /**ستقبل 4 أرقام من updateStats():
                                                     bronze → عدد أعضاء Bronze
                                                     silver → عدد أعضاء Silver 
                                                     gold → عدد أعضاء Gold
                                                     total → إجمالي الأعضاء */
  let canvas = document.getElementById("planChart");
  if (!canvas) return; //تجلب عنصر <canvas> من الصفحة. إذا ما وُجد → توقف فوراً.
  let ctx = canvas.getContext("2d"); //ctx هو قلم الرسم — كل ما نرسمه يمر عبره. "2d" يعني رسم ثنائي الأبعاد.
 
  // أبعاد Canvas
  let W = canvas.width;   // 360 بكسل
  let H = canvas.height;  // 220 بكسل
 
  // امسح الرسم القديم
  ctx.clearRect(0, 0, W, H); //تمسح كل الرسم القديم قبل ما نرسم الجديد — بدونها ستتراكم الأشرطة فوق بعض.
  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, W, H);
  // إعدادات الأشرطة
  let bars = [ /**صفوفة من 3 objects — كل object يحتوي على بيانات شريط واحد:
                label → الاسم يظهر تحت الشريط
                count → العدد يحدد ارتفاع الشريط
                color → لون الشريط */
    { label: "Bronze", count: bronze, color: "#cd7f32" },
    { label: "Silver", count: silver, color: "#c0c0d0" },
    { label: "Gold",   count: gold,   color: "#ffd700" },
  ];
 
  let barWidth   = 60;  // عرض كل شريط
  let gap        = 40;  // المسافة بين الأشرطة
  let bottomY    = H - 40; // قاع الأشرطة
  let maxHeight  = H - 80; // أقصى ارتفاع للشريط
  let startX     = 60;  // بداية الرسم من اليسار
  let maxCount   = total > 0 ? total : 1; // نستخدم total كأقصى قيمة لحساب نسبة الارتفاع. لو total = 0 نضع 1 لتجنب القسمة على صفر.
 
  for (let i = 0; i < bars.length; i++) { //نمر على الـ 3 أشرطة واحداً واحداً.
    let bar = bars[i];
 
    let barHeight = (bar.count / maxCount) * maxHeight; //نحسب ارتفاع الشريط بالنسبة للكل.
    if (bar.count === 0) barHeight = 0; //إذا ما في أعضاء في هذه الخطة → الشريط يكون بارتفاع صفر (لا يظهر).
 
    let x = startX + i * (barWidth + gap); // نحسب موضع X لكل شريط:
    let y = bottomY - barHeight;           // موضع Y للشريط — Canvas يحسب من الأعلى للأسفل، فنطرح الارتفاع من القاع.
 
    // رسم الشريط
    ctx.fillStyle = bar.color; //موضع Y للشريط — Canvas يحسب من الأعلى للأسفل، فنطرح الارتفاع من القاع.
    ctx.beginPath(); //نبدأ مسار رسم جديد — ضروري قبل أي شكل.
    ctx.roundRect(x, y, barWidth, barHeight, 6); //نبدأ مسار رسم جديد — ضروري قبل أي شكل.
    ctx.fill(); //نملأ الشكل باللون المحدد في fillStyle.
 
    // رقم فوق الشريط
    ctx.fillStyle = "#eee"; //نحدد: لون النص (أبيض فاتح) + الخط (عريض 14px) + المحاذاة (منتصف).
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(bar.count, x + barWidth / 2, y - 8);
 
    // اسم الخطة تحت الشريط
    ctx.fillStyle = "#a0a0c0";//نكتب الاسم (Bronze / Silver / Gold) تحت الشريط بـ 20px أسفل القاع، بلون رمادي.
    ctx.font = "13px sans-serif"; 
    ctx.fillText(bar.label, x + barWidth / 2, bottomY + 20);
  }
 
  // خط القاع
  ctx.strokeStyle = "#2d2d40";
  ctx.lineWidth   = 1; //لون الخط (رمادي داكن) وسماكته (1px).
  ctx.beginPath();
  ctx.moveTo(30, bottomY); //ابدأ من x=30
  ctx.lineTo(W - 20, bottomY);//ارسم حتى x=340 (360-20)
  ctx.stroke();//نفّذ الرسم
}

function buildStats() { //دالة مهمتها بناء قسم الإحصائيات وإضافته للصفحة.
  let main = document.querySelector("main");
  if (!main) return; //تبحث عن <main> — إذا ما وُجد توقف فوراً.
 
  // أضف القسم بعد عنوان Dashboard مباشرة
  let statsSection = document.getElementById("stats-section");
  if (statsSection) return; // تتحقق هل القسم موجود مسبقاً. إذا نعم → توقف ولا تضفه مرة ثانية. هذا أمان ضد التكرار لو استُدعيت الدالة أكثر من مرة.
 
  let section = document.createElement("section"); //ننشئ عنصر <section> جديد في الذاكرة — لم يُضف للصفحة بعد.
  section.id = "stats-section";
  section.innerHTML = `
    <hr>
    <h2>📊 Live Dashboard Stats 📊</h2>
 
    <!-- بطاقات الإحصائيات -->
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px,1fr)); gap:16px; margin:16px 0;">
 
      <div style="background: #f0efe8; border:3px solid #2d2d50; border-radius:12px; padding:20px; text-align:center;">
        <div style="font-size:2rem;">👥</div>
        <div id="stat-total" style="font-size:2rem; font-weight:700; color:#c0c8ff; margin:8px 0;">0</div>
        <div style="color: #a0a0c0; font-size:.85rem;">Total Members</div>
      </div>
 
      <div style="background: #f0efe8; border:3px solid #2d2d50; border-radius:12px; padding:20px; text-align:center;">
        <div style="font-size:2rem;">💳</div>
        <div id="stat-active" style="font-size:2rem; font-weight:700; color:#4ade80; margin:8px 0;">0</div>
        <div style="color: #a0a0c0; font-size:.85rem;">Active Subscriptions</div>
      </div>
 
      <div style="background: #f0efe8; border:3px solid #2d2d50; border-radius:12px; padding:20px; text-align:center;">
        <div style="font-size:2rem;">🏋️</div>
        <div id="stat-classes" style="font-size:2rem; font-weight:700; color:#fbbf24; margin:8px 0;">7</div>
        <div style="color:#a0a0c0; font-size:.85rem;">Classes This Week</div>
      </div>
 
      <div style="background: #f0efe8; border:3px solid #2d2d50; border-radius:12px; padding:20px; text-align:center;">
        <div style="font-size:2rem;">🏆</div>
        <div id="stat-popular" style="font-size:1.2rem; font-weight:700; color:#ffd700; margin:8px 0;">-</div>
        <div style="color:#a0a0c0; font-size:.85rem;">Most Popular Plan</div>
      </div>
 
    </div>
 
    <!-- الرسم البياني -->
    <div style="background: #f0efe8; border:3px solid #2d2d50; border-radius:12px; padding:20px; margin-top:8px;">
      <h3 style="margin:0 0 16px; color: #c0c8ff; font-size:.95rem;">📊 Members by Plan</h3>
      <canvas id="planChart" width="360" height="220"
        style="display:block; margin:0 auto;"></canvas>
    </div>
  `;
 
  // أضف القسم في بداية main
  main.insertBefore(section, main.firstChild);
 
  // احسب الإحصائيات أول مرة
  setTimeout(updateStats, 50);
}
 
 
// ─── 13. تشغيل عند تحميل الصفحة ─────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  buildStats(); // أولاً: قسم الإحصائيات
  buildUI();    // ثانياً: جدول الأعضاء
});
/**لماذا buildStats قبل buildUI؟
buildStats أولاً  →  الإحصائيات تظهر في الأعلى
buildUI ثانياً    →  الجدول يظهر في الأسفل */ 

 
 


















document.addEventListener("DOMContentLoaded", function () { //كل الكود داخل DOMContentLoaded ينتظر حتى تنتهي الصفحة من التحميل، ثم يشتغل — هكذا نضمن إن كل العناصر موجودة قبل ما JS يحاول يلمسها.

  const form      = document.querySelector("form"); 
  const fnameEl   = document.getElementById("Fname");
  const lnameEl   = document.getElementById("Lname");
  const telEl     = document.getElementById("tl");
  const subjectEl = document.getElementById("Choose");
  const msgEl     = document.getElementById("text");
 
  const counter = document.getElementById("charCount");

  msgEl.addEventListener("input", function () { //قل للـ textarea: "كل مرة يكتب المستخدم حرفاً، نفّذ هذه الدالة." الحدث "input" يشتغل مع كل ضغطة كيبورد.
    const len = msgEl.value.length; //msgEl.value = النص الموجود داخل الـ textarea .length = عدد حروفه
    counter.textContent = len + " / 20 characters minimum"; // غيّر النص المعروض في الـ <p> — مثلاً إذا len = 5 يصبح:5 / 20 characters minimum
    counter.style.color = len >= 20 ? "green" : "#888"; // إذا len وصل 20 أو أكثر → لوّن النص أخضر إذا أقل من 20 → ابقَ رمادياً #888

});
   function showError(inputEl, message) { //مثال المستخدم كتب اسمه حرف واحد فقط "A" وضغط Send:(حدود حمراء) لانه يجب حرفين على الاقل
    //inputEl = الحقل الذي فيه خطأ (مثلاً حقل الاسم)
    //message = نص رسالة الخطأ (مثلاً "Name must be at least 2 characters")
    const old = inputEl.parentElement.querySelector(".error-msg"); //inputEl.parentElement = الـ div الأب الذي يحتوي الحقل
    if (old) old.remove();// إذا وُجد خطأ قديم → احذفه. حتى لا تتراكم رسائل الخطأ فوق بعض.
 
    inputEl.style.borderColor = "red";//لوّن حدود الحقل باللون الأحمر — حتى يعرف المستخدم أين المشكلة.
 
    const err = document.createElement("p"); //أنشئ عنصر <p> جديد في الذاكرة — سيحمل نص رسالة الخطأ.
    err.className = "error-msg"; //أعطِه class اسمه error-msg — مهم لأن سطر 2 يبحث بهذا الاسم لاحقاً لحذف الخطأ القديم.
    err.style.cssText = "color:red; display:block; margin-top:3px;";
    err.textContent = "⚠ " + message; //اكتب نص الخطأ داخل العنصر. مثلاً: ⚠ Name must be at least 2 characters
    inputEl.parentElement.appendChild(err); //أضف العنصر الجديد داخل الـ div الأب — يظهر تحت الحقل مباشرة.
  }

  function clearError(inputEl) { // دالة عكس showError — تمسح رسالة الخطأ من حقل معين.
    const old = inputEl.parentElement.querySelector(".error-msg");
    if (old) old.remove();
    inputEl.style.borderColor = ""; //أرجع لون حدود الحقل للوضع الطبيعي — "" تعني "امسح التنسيق اللي أضفناه بـ JS".
  }
 
  // ── 5. التحقق من الحقول ───────────────────────────────────
  function validate() { //دالة تتحقق من جميع الحقول — ترجع true إذا كل شيء صح، وfalse إذا في خطأ.
    let valid = true; //نبدأ بافتراض إن كل شيء صحيح — إذا وجدنا خطأ نغيرها لـ false.
 
    // الاسم الأول
    if (fnameEl.value.trim().length < 2) { //.trim() = احذف المسافات من البداية والنهاية
      showError(fnameEl, "First name must be at least 2 characters."); //أظهر رسالة الخطأ، وغيّر valid لـ false — يعني الفورم فيه مشكلة.
      valid = false;
    } else {
      clearError(fnameEl);
    }
 
    // الاسم الأخير
    if (lnameEl.value.trim().length < 2) {
      showError(lnameEl, "Last name must be at least 2 characters.");
      valid = false;
    } else {
      clearError(lnameEl);
    }
 
    // رقم الهاتف (يجب أن يكون أرقاماً فقط وطوله 10)
    const telVal = telEl.value.trim(); //احفظ رقم الهاتف في متغير بعد حذف المسافات.
    if (!/^\d{10}$/.test(telVal)) { //\d = رقم فقط (0-9)
                                    // {10} = بالضبط 10 أرقام
                                    // ^ و $ = من البداية للنهاية بدون أي حرف إضافي

      showError(telEl, "Phone number must be exactly 10 digits.");
      valid = false;
    } else {
      clearError(telEl);
    }
 
    // الموضوع (Select — دائماً مختار، لكن نتحقق من القيمة)
    if (!subjectEl.value) {
      showError(subjectEl, "Please select a subject.");
      valid = false;
    } else {
      clearError(subjectEl);
    }
 
    // الرسالة
    if (msgEl.value.trim().length < 20) {
      showError(msgEl, "Message must be at least 20 characters.");
      valid = false;
    } else {
      clearError(msgEl);
    }
 
    return valid; //true = كل الحقول صحيحة → يُرسل الفورم
                  //false = في خطأ في حقل واحد على الأقل → لا يُرسل
  }

   function showToast(message, type) { //دالة تأخذ معاملين: message = النص اللي يظهر في الـ Toast
                                       //type = نوعه — إما "success" (نجاح) أو "error" (خطأ)
    const exist = document.getElementById("toast");
    if (exist) exist.remove(); //قبل ما ننشئ Toast جديد، نتحقق هل يوجد واحد قديم → إذا وُجد نحذفه. حتى لا يتراكم اثنان فوق بعض. 
    const toast = document.createElement("div"); //أنشئ div جديد
    toast.id = "toast"; 
    toast.textContent = message; //اكتب فيه نص الرسالة
    toast.style.cssText = `
      position: fixed; 
      bottom: 30px; 
      right: 30px; 
      background: ${type === "success" ? "#28a745" : "#dc3545"}; 
      color: #fff;
      padding: 14px 22px; 
      font-size: 15px;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.4s ease; 
    `;
    document.body.appendChild(toast); //أضف الـ Toast للصفحة — لكنه لا يُرى بعد لأن opacity: 0. 
    setTimeout(() => { toast.style.opacity = "1"; }, 50); //setTimeout = انتظر مدة معينة ثم نفّذ كوداً
                                                          //50 = 50 ميلي ثانية (لحظة صغيرة)
                                                          //بعدها → غيّر opacity لـ 1 → يظهر Toast بتأثير ناعم بسبب الـ transition
    setTimeout(() => { //بعد 4000ms (4 ثوانٍ) → غيّر opacity لـ 0 → يبدأ يختفي تدريجياً
                      //بعد 400ms إضافية (وقت الـ transition) → احذفه نهائياً من الصفحة
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
 
  // ── 7. حفظ الرسالة في localStorage ───────────────────────
  function saveMessage(data) { //دالة تحفظ رسالة المستخدم في localStorage — وهو مكان تخزين في المتصفح يبقى حتى بعد إغلاق الصفحة.
    const messages = JSON.parse(localStorage.getItem("gymMessages") || "[]"); //localStorage.getItem("gymMessages") = اجلب القائمة المحفوظة مسبقاً
                                              //|| "[]" = إذا لا يوجد شيء محفوظ → ابدأ بقائمة فارغة []
                                              //JSON.parse(...) = حوّل النص المحفوظ لقائمة JS حقيقية
    messages.push(data); //أضف الرسالة الجديدة لنهاية القائمة.
    localStorage.setItem("gymMessages", JSON.stringify(messages)); //JSON.stringify(messages) = حوّل القائمة لنص (localStorage يحفظ نصوص فقط)
                                                                   //localStorage.setItem(...) = احفظها في المتصفح    
  }
 // ── 8. حدث الإرسال ───────────────────────────────────────
  form.addEventListener("submit", function (e) { //استمع لحدث الضغط على زر Send — e هو معلومات الحدث نفسه.
    e.preventDefault(); //افتراضياً عند الضغط على Submit، الصفحة تنعش وترسل البيانات لسيرفر — هذا السطر يمنع ذلك حتى نتحكم نحن بما يحدث. 
    if (!validate()) { //شغّل دالة validate() للتحقق من الحقول
      //إذا رجعت false (في خطأ) → أظهر Toast خطأ → return يوقف الكود هنا ولا يكمل
     //إذا رجعت true → تجاوز هذا الشرط وأكمل
      showToast("❌ Please fix the errors before sending.", "error");
      return;
    }
 
    const messageData = { //أنشئ object يجمع كل بيانات الفورم في مكان واحد:
      firstName : fnameEl.value.trim(),
      lastName  : lnameEl.value.trim(),
      phone     : telEl.value.trim(),
      subject   : subjectEl.value,
      message   : msgEl.value.trim(),
      date      : new Date().toLocaleString()
    };
     saveMessage(messageData); //احفظ الـ object كاملاً في localStorage — استدعاء للدالة اللي شرحناها سابقاً.
    showToast("✅ Message sent successfully! We'll get back to you soon.", "success"); //أظهر Toast أخضر برسالة نجاح.

    form.reset(); //form.reset() = فرّغ جميع الحقول دفعة واحدة
    //السطران الباقيان يرجعان عداد الحروف لوضعه الأولي — لأن reset() لا يعيد JS تلقائياً
    counter.textContent = "0 / 20 characters minimum";
    counter.style.color = "#888";
  });
 
  // ── 9. مسح الخطأ عند الكتابة (UX أفضل) ──────────────────
  [fnameEl, lnameEl, telEl, msgEl].forEach(function (el) {  //المعنى: كل مرة يبدأ المستخدم يكتب في أي حقل → امسح رسالة الخطأ تلقائياً
    el.addEventListener("input", function () { clearError(el); });
  });
  subjectEl.addEventListener("change", function () { clearError(subjectEl); }); //نفس الفكرة للـ Select — لكن نستخدم "change" بدل "input" لأن الـ select لا يُكتب فيه، بل يُختار منه.
 
});
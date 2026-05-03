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
    
    inputEl.style.borderColor = "red";//لوّن حدود الحقل باللون الأحمر — حتى يعرف المستخدم أين المشكلة.
    inputEl.placeholder = "⚠ " + message;
    }

  function clearError(inputEl) { // دالة عكس showError — تمسح رسالة الخطأ من حقل معين.
    inputEl.style.borderColor = ""; //أرجع لون حدود الحقل للوضع الطبيعي — "" تعني "امسح التنسيق اللي أضفناه بـ JS".
    inputEl.placeholder = " "
  }

 
  // ── 5. التحقق من الحقول ───────────────────────────────────
  function validate() { //دالة تتحقق من جميع الحقول — ترجع true إذا كل شيء صح، وfalse إذا في خطأ.
     //نبدأ بافتراض إن كل شيء صحيح — إذا وجدنا خطأ نغيرها لـ false.
     let bool = true;
    // الاسم الأول
    if (fnameEl.value.trim().length < 2) { //.trim() = احذف المسافات من البداية والنهاية
      showError(fnameEl, "First name must be at least 2 characters"); //أظهر رسالة الخطأ، وغيّر valid لـ false — يعني الفورم فيه مشكلة.
       bool = false;
    } else {
      clearError(fnameEl);
    }
 
    // الاسم الأخير
    if (lnameEl.value.trim().length < 2) {
      showError(lnameEl, "Last name must be at least 2 characters");
      bool=false;
    } else {
      clearError(lnameEl);
    }
 
    // رقم الهاتف (يجب أن يكون أرقاماً فقط وطوله 10)
    const telVal = telEl.value.trim(); //احفظ رقم الهاتف في متغير بعد حذف المسافات.
    if (!/^\d{10}$/.test(telVal)) { //\d = رقم فقط (0-9)
                                    // {10} = بالضبط 10 أرقام
                                    // ^ و $ = من البداية للنهاية بدون أي حرف إضافي

      showError(telEl, "Phone number must be exactly 10 digits");
      bool=false ;
    } else {
      clearError(telEl);
    }
 
    // الموضوع (Select — دائماً مختار، لكن نتحقق من القيمة)
    if (!subjectEl.value) {
      showError(subjectEl, "Please select a subject.");
      bool=false;
    } else {
      clearError(subjectEl);
    }
 
    // الرسالة
    if (msgEl.value.trim().length < 20) {
      showError(msgEl, "Message must be at least 20 characters.");
      bool=false;
    } else {
      clearError(msgEl);
    }
    return bool ;
  }

   function show(message, type) { //دالة تأخذ معاملين: message = النص اللي يظهر في الـ Toast
                                       //type = نوعه — إما "success" (نجاح) أو "error" (خطأ)
    const exist = document.getElementById("toast");
    const toast = document.createElement("div"); //أنشئ div جديد
    toast.id = "toast"; 
    toast.textContent = message; //اكتب فيه نص الرسالة
    toast.style.cssText = `
      bottom: 30px; 
      right: 30px; 
      background: ${type === "success" ? "#28a745" : "#dc3545"}; 
      color: #fff;
      padding: 14px 22px; 
      font-size: 15px;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      transition: opacity 0.4s ease; 
      position: fixed; 

    `;
    document.body.appendChild(toast); //أضف الـ Toast للصفحة — لكنه لا يُرى بعد لأن opacity: 0. 
     setTimeout(() => {
      toast.remove();
      }, 4000);

  }
 
  // ── 7. حفظ الرسالة في localStorage ───────────────────────
  function saveinfo(data) { //دالة تحفظ رسالة المستخدم في localStorage — وهو مكان تخزين في المتصفح يبقى حتى بعد إغلاق الصفحة.
    const messages = JSON.parse(localStorage.getItem("Messinfo") || "[]"); //localStorage.getItem("gymMessages") = اجلب القائمة المحفوظة مسبقاً
                                              //|| "[]" = إذا لا يوجد شيء محفوظ → ابدأ بقائمة فارغة []
                                              //JSON.parse(...) = حوّل النص المحفوظ لقائمة JS حقيقية
    messages.push(data); //أضف الرسالة الجديدة لنهاية القائمة.
    localStorage.setItem("Messinfo", JSON.stringify(messages)); //JSON.stringify(messages) = حوّل القائمة لنص (localStorage يحفظ نصوص فقط)
                                                                   //localStorage.setItem(...) = احفظها في المتصفح    
  }
 // ── 8. حدث الإرسال ───────────────────────────────────────
  form.addEventListener("submit", function (e) { //استمع لحدث الضغط على زر Send — e هو معلومات الحدث نفسه.
    e.preventDefault(); //افتراضياً عند الضغط على Submit، الصفحة تنعش وترسل البيانات لسيرفر — هذا السطر يمنع ذلك حتى نتحكم نحن بما يحدث. 
    if (!validate()) { //شغّل دالة validate() للتحقق من الحقول
      //إذا رجعت false (في خطأ) → أظهر Toast خطأ → return يوقف الكود هنا ولا يكمل
     //إذا رجعت true → تجاوز هذا الشرط وأكمل
      show("❌ Please fix the errors before sending.", "error");
      return;
    }
 
    const messageData = { //أنشئ object يجمع كل بيانات الفورم في مكان واحد:
      firstName : fnameEl.value.trim(),
      lastName  : lnameEl.value.trim(),
      phone     : telEl.value.trim(),
      subject   : subjectEl.value,
      message   : msgEl.value.trim(),
    };
     saveinfo(messageData); //احفظ الـ object كاملاً في localStorage — استدعاء للدالة اللي شرحناها سابقاً.
    show("✅ Message sent successfully! We'll get back to you soon.", "success"); //أظهر Toast أخضر برسالة نجاح.

   
  });
   
});
document.addEventListener("DOMContentLoaded", function () { 

  const form = document.querySelector("form"); 
  const fnameEl = document.getElementById("Fname");
  const lnameEl = document.getElementById("Lname");
  const telEl = document.getElementById("tl");
  const subjectEl = document.getElementById("Choose");
  const msgEl  = document.getElementById("text");
 
  const counter = document.getElementById("charCount");

  msgEl.addEventListener("input", function () { 
    const len = msgEl.value.length; 
    counter.textContent = len + " / 20 characters minimum"; 
    counter.style.color = len >= 20 ? "green" : "#888"; 

});
   function showError(inputEl, message) {
    
    inputEl.style.border = " 2px solid red";
    inputEl.placeholder = "⚠ " + message;
    }

  function messerror(inputEl) { 
    inputEl.style.borderColor = "";
    inputEl.placeholder = " "
  }

 
  function validate() { 
     let bool = true;
    if (fnameEl.value.trim().length < 2) { 
      showError(fnameEl, "First name must be at least 2 characters"); 
       bool = false;
    } else {
      messerror(fnameEl);
    }
 
    if (lnameEl.value.trim().length < 2) {
      showError(lnameEl, "Last name must be at least 2 characters");
      bool=false;
    } else {
      messerror(lnameEl);
    }
 
    const telVal = telEl.value.trim(); 
    if (!/^\d{10}$/.test(telVal)) {

      showError(telEl, "Phone number must be exactly 10 digits");
      bool=false ;
    } else {
      messerror(telEl);
    }
 
    if (!subjectEl.value) {
      showError(subjectEl, "Please select a subject.");
      bool=false;
    } else {
      messerror(subjectEl);
    }
 
    if (msgEl.value.trim().length < 20) {
      showError(msgEl, "Message must be at least 20 characters.");
      bool=false;
    } else {
      messerror(msgEl);
    }
    return bool ;
  }

   function show(message, type) { 
                                       
    const exist = document.getElementById("toast");
    const toast = document.createElement("div"); 
    toast.id = "toast"; 
    toast.textContent = message; 
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
    document.body.appendChild(toast); 
     setTimeout(() => {
      toast.remove();
      }, 4000);

  }
 
  function saveinfo(data) { 
    const messages = JSON.parse(localStorage.getItem("Messinfo") || "[]"); 
    messages.push(data);
    localStorage.setItem("Messinfo", JSON.stringify(messages));
  }                                                              
  form.addEventListener("submit", function (e) { 
    e.preventDefault(); 
    if (!validate()) { 
      show("❌ Please fix the errors before sending.", "error");
      return;
    }
 
    const messageData = { 
      firstName : fnameEl.value.trim(),
      lastName  : lnameEl.value.trim(),
      phone     : telEl.value.trim(),
      subject   : subjectEl.value,
      message   : msgEl.value.trim(),
    };
     saveinfo(messageData); 
    show("✅ Message sent successfully! We'll get back to you soon.", "success"); 

   
  });
   
});

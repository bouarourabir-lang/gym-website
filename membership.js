document.addEventListener("DOMContentLoaded", () => {
 
    const form         = document.querySelector("form");
    const nameInput    = document.querySelector('input[type="text"]');
    const emailInput   = document.querySelector('input[type="email"]');
    const phoneInput   = document.querySelector('input[type="tel"]');
    const dobInput     = document.querySelector('input[type="date"]');
    const planRadios   = document.querySelectorAll('fieldset:nth-of-type(2) input[type="radio"]');
    const terms        = document.querySelector('input[type="checkbox"]');
    const miniCart     = document.getElementById("miniCart");
    const successModal = document.getElementById("successModal");
 
    /* ---------- Validation ---------- */
    function setError(input)   { input.style.border = "2px solid red"; }
    function setSuccess(input) { input.style.border = "2px solid green"; }
 
    nameInput.addEventListener("blur", () => {
        /^[A-Za-z ]{3,}$/.test(nameInput.value.trim()) ? setSuccess(nameInput) : setError(nameInput);
    });
    emailInput.addEventListener("blur", () => {
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()) ? setSuccess(emailInput) : setError(emailInput);
    });
    phoneInput.addEventListener("blur", () => {
        /^[0-9]{8,15}$/.test(phoneInput.value.trim()) ? setSuccess(phoneInput) : setError(phoneInput);
    });
    dobInput.addEventListener("blur", () => {
        const age = new Date().getFullYear() - new Date(dobInput.value).getFullYear();
        (!dobInput.value || age < 16) ? setError(dobInput) : setSuccess(dobInput);
    });
 
    /* ---------- Mini-cart ---------- */
    function renderCart(planName) {
        if (!planName) {
            miniCart.innerHTML = "<span>No plan selected</span>";
            return;
        }
        miniCart.innerHTML = `
            <strong>${planName}</strong>
            <button id="proceedBtn" type="button">Proceed to Register</button>
        `;
    }
 
    /* global حتى تشتغل مع onclick في الـ HTML */
    window.updateCart = function(planName) {
        sessionStorage.setItem("selectedPlan", planName);
        renderCart(planName);
    };
 
    /* Radio buttons داخل الفورم */
    planRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            window.updateCart(radio.parentNode.innerText.trim());
        });
    });
 
    /* استرجاع الخطة عند إعادة تحميل الصفحة */
    const saved = sessionStorage.getItem("selectedPlan");
    renderCart(saved || null);
 
    /* زر Proceed - event delegation لأن الزر يُنشأ ديناميكياً */
    document.addEventListener("click", (e) => {
        if (e.target.id !== "proceedBtn") return;
        form.scrollIntoView({ behavior: "smooth" });
        const plan = sessionStorage.getItem("selectedPlan");
        if (!plan) return;
        planRadios.forEach(r => {
            r.checked = r.parentNode.innerText.trim().startsWith(plan.split(" ")[0]);
        });
    });
 
    /* ---------- Form Submit ---------- */
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;
 
        if (!/^[A-Za-z ]{3,}$/.test(nameInput.value.trim()))             valid = false;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) valid = false;
        if (!/^[0-9]{8,15}$/.test(phoneInput.value.trim()))               valid = false;
 
        const age = new Date().getFullYear() - new Date(dobInput.value).getFullYear();
        if (!dobInput.value || age < 16) valid = false;
 
        if (![...planRadios].some(r => r.checked)) valid = false;
        if (!terms.checked) valid = false;
 
        if (!valid) {
            alert("Please fix the errors before submitting.");
            return;
        }
 
        successModal.style.display = "flex";
        setTimeout(() => { successModal.style.display = "none"; }, 2000);
 
        form.reset();
        sessionStorage.removeItem("selectedPlan");
        renderCart(null);
    });
 
});
 

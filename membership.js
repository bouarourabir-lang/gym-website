document.addEventListener("DOMContentLoaded", () => {
 
    const form = document.querySelector("form");
    const nameInput = document.querySelector('input[type="text"]');
    const emailInput = document.querySelector('input[type="email"]');
    const phoneInput = document.querySelector('input[type="tel"]');
    const dobInput = document.querySelector('input[type="date"]');
 
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
    
    const miniCart= document.getElementById("miniCart");

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
 
    updateCart = function(planName) {
        sessionStorage.setItem("selectedPlan", planName);
        renderCart(planName);
    };
    
     let planRadios   = document.querySelectorAll('fieldset:nth-of-type(2) input[type="radio"]');
    planRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            updateCart(radio.parentNode.innerText.trim());
        });
    });
 
    let saved = sessionStorage.getItem("selectedPlan");
    renderCart(saved || null);
 
    document.addEventListener("click", (e) => {
        if (e.target.id !== "proceedBtn") return;
        form.scrollIntoView({ behavior: "smooth" });
        let plan = sessionStorage.getItem("selectedPlan");
        if (!plan) return;
        planRadios.forEach(r => {
            r.checked = r.parentNode.innerText.trim().startsWith(plan.split(" ")[0]);
        });
    });

     const terms = document.querySelector('input[type="checkbox"]');
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;
 
        if (!/^[A-Za-z ]{3,}$/.test(nameInput.value.trim())) valid = false;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) valid = false;
        if (!/^[0-9]{8,15}$/.test(phoneInput.value.trim()))valid = false;
 
        const age = new Date().getFullYear() - new Date(dobInput.value).getFullYear();
        if (!dobInput.value || age < 16) valid = false;
 
        if (![...planRadios].some(r => r.checked)) valid = false;
        if (!terms.checked) valid = false;
 
        if (!valid) {
            alert("Please fix the errors before submitting.");
            return;
        }

        const success = document.getElementById("success");

        success.style.display = "flex";
        setTimeout(() => { success.style.display = "none"; }, 2000);
 
        form.reset();
        sessionStorage.removeItem("selectedPlan");
        renderCart(null);
    });
 
});
 

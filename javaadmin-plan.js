const addBtn = document.querySelector(".planform button");
const inputs = document.querySelectorAll(".planform input, .planform textarea");
const table = document.querySelector("table");

addBtn.addEventListener("click", () => {
    const name = inputs[0].value;
    const price = inputs[1].value;
    const duration = inputs[2].value;
    const features = inputs[3].value;
    if (!name || !price || !duration || !features) {
        alert("Please fill all fields");
        return;
    }
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${name}</td>
        <td>${price} da</td>
        <td>${duration}</td>
        <td><ul>${features.split(",").map(f => `<li>${f.trim()}</li>`).join("")}</ul></td>
        <td>
            <button type="button">Edit</button>
            <button type="button">Delete</button>
        </td>   `;
    table.appendChild(row);
      addActions(row);
      inputs.forEach(input => input.value = "");
});
function addActions(row) {
    const editBtn = row.querySelector("button:nth-child(1)");
    const deleteBtn = row.querySelector("button:nth-child(2)");
    deleteBtn.addEventListener("click", () => {
    const ok = confirm("Are you sure you want to delete this plan?");   
    if (ok) {
        row.remove();
    }
});
    editBtn.addEventListener("click", () => {
        const cells = row.querySelectorAll("td");
        inputs[0].value = cells[0].textContent;
        inputs[1].value = parseInt(cells[1].textContent);
        inputs[2].value = cells[2].textContent;
        const features = [...cells[3].querySelectorAll("li")] .map(li => li.textContent) .join(", ");
        inputs[3].value = features;
        row.remove(); 
    });
}
document.querySelectorAll("table tr").forEach((row, index) => {
    if (index === 0) return; 
    addActions(row);
});
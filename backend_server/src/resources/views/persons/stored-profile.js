const containerForm = document.forms["container-form"];
const deleteForm = document.forms["delete-person-from"];
const checkboxAll = $("#checkbox-all");
const personItemCheckbox = $('input[name="personIds[]"]');
const btnCheckAllSubmit = $(".btn-check-all-submit");
const exampleModal = document.getElementById("delete-person-modal");
var personId;
exampleModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    personId = button.getAttribute("data-id");
});
const btmDeletePerson = document.getElementById("btn-delete-person");
btmDeletePerson.onclick = function () {
    deleteForm.action = "/persons/" + personId + "?_method=DELETE";
    deleteForm.submit();
};
checkboxAll.change(function () {
    const isCheckedAll = $(this).prop("checked");
    personItemCheckbox.prop("checked", isCheckedAll);
    renderCheckAllSubmitBtn();
});
personItemCheckbox.change(function () {
    const isCheckedAll =
        personItemCheckbox.length ===
        $('input[name="personIds[]"]:checked').length;
    checkboxAll.prop("checked", isCheckedAll);
    renderCheckAllSubmitBtn();
});
btnCheckAllSubmit.on("submit", function (e) {
    const isSubmittable = !$(this).hasClass("disabled");
    if (!isSubmittable) {
        e.preventDefault();
    }
});
function renderCheckAllSubmitBtn() {
    const checkCount = $('input[name="personIds[]"]:checked').length;
    if (checkCount) {
        btnCheckAllSubmit.removeClass("disabled");
    } else {
        btnCheckAllSubmit.addClass("disabled");
    }
}

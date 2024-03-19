const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

document.addEventListener("DOMContentLoaded", function () {
    var personId;
    var deleteForm = document.forms["delete-person-from"];
    var restoreForm = document.forms["restore-person-from"];
    var btnDeleteForm = document.getElementById("btn-delete-person");
    var restoreBtn = $(".btn-restore");

    // When dialog confirm clicked
    $("#delete-course-modal").on("show.bs.modal", function (event) {
        var button = $(event.relatedTarget);
        personId = button.data("id");
    });

    // When delete course btn clicked
    btnDeleteForm.onclick = function () {
        deleteForm.action = "/courses/" + personId + "/force?_method=DELETE";
        deleteForm.submit();
    };

    // Restore btn clicked
    restoreBtn.click(function (e) {
        e.preventDefault();

        var personId = $(this).data("id");
        restoreForm.action = "/courses/" + personId + "/restore?_method=PATCH";
        restoreForm.submit();
    });
});

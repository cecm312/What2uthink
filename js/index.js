$(function () {

    var form = document.getElementById('file-form');
    var fileSelect = document.getElementById('file-select');

    $(document).on("click", "#upload-button", function (e) {
        e.preventDefault();
        var files = fileSelect.files[0];
        var formData = new FormData();
        console.log(files);
        formData.append('file', files);

         $.ajax({
            url: 'upload.php',
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (returndata) {
              console.log(returndata);
            }
          });
    });

});
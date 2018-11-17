$(document).ready(function($) {
  $("#loadMore").one("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("click");

    $.ajax({
      type: "GET",
      url: "/api/blog?page=2",
      complete: function() {
        console.log("process complete");
      },
      success: function(data) {
        if (data.lenght !== 0) {
          $("#posts").append(data);
          console.log("done");
        } else if (data.lenght == 0) {
          console.log("error");
        }
      },
      errorinu: function() {
        console.log("process error");
      }
    });
  });
});

$(document).ready(function($) {
  var page = 1;
  $("#loadMore").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("click");

    $.ajax({
      type: "GET",
      url: `/api/blog?page=${page + 1}`,
      complete: function() {
        console.log("process complete");
      },
      success: function(data) {
        if (data.length !== 0) {
          $("#posts").append(data);
          page += 1;
          console.log("done");
        } else if (data.length == 0) {
          $("#loadMore").css("display", "none");
        }
      },
      errorinu: function() {
        console.log("process error");
      }
    });
  });
});

// document.getElementById("loadMore").addEventListener("click", getPosts);

// function getPosts() {
//   fetch("/api/blog?skip=0&limit=10", {
//     method: "GET"
//   })
//     .then(res => {
//       return res.post;
//     })
//     .then(data => {
//       console.log(data);
//       // document.getElementById("posts").appendChild(data);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }

document.querySelector("html").classList.add("js");

var fileInput = document.querySelector(".input-file"),
  button = document.querySelector(".input-file-trigger"),
  the_return = document.querySelector(".file-return");

async function commentFormHandler(event) {
    event.preventDefault();
  
    const comment_text = document
      .querySelector("#content")
      .value.trim();
  
    const post_id = window.location.toString().split("/")[
      window.location.toString().split("/").length - 1
    ];
    // We defined the method as POST and included two properties on the body.
    // We also wrapped the entire request in an if statement to
    // prevent users from submitting empty strings.
    if (comment_text) {
      const response = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          post_id,
          comment_text,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        document.location.reload();
      } else alert(response.statusText);
    }
  }
  
  document
    .querySelector(".comment-form")
    .addEventListener("submit", commentFormHandler);
  
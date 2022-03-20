async function saveFormHandler(event) {
    event.preventDefault();
  
    console.log("save button clicked");
  
    const title = document.querySelector("#post-title").value.trim();
    const content = document.querySelector("#content").value.trim();
    const id = window.location.toString().split("/")[
      window.location.toString().split("/").length - 1
    ];
    const response = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        content
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (response.ok) {
      alert("Your post has been successfully saved");
      document.location.replace("/dashboard/");
    } else {
      alert(response.statusText);
    }
  }
  
  document
    .querySelector(".save-post-btn")
    .addEventListener("click", saveFormHandler);
  
function handleSubmit(event) {
  event.preventDefault();
  const msg = document.getElementById('thankYouMessage');
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 3000); // hides after 3s
}

function showToast(event) {
    event.preventDefault(); // stop form reload
    const toast = document.getElementById("toast");
    const form = document.getElementById("contactForm");
    // show the toast
    toast.classList.add("show");

    // clear the form
    form.reset();

    // hide the toast after 3s
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000); // hide after 3 seconds
  }
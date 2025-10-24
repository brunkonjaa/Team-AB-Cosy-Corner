const footer = document.getElementById('smartFooter');

  document.addEventListener('mousemove', (event) => {
    const distanceFromBottom = window.innerHeight - event.clientY;

    // show footer if cursor is within 100px of bottom
    if (distanceFromBottom < 100) {
      footer.classList.add('show');
    } else {
      footer.classList.remove('show');
    }
  });
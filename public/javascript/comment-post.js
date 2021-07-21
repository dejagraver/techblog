async function submitCommentHandler(event) {
  event.preventDefault();
  const post_id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];

  const comment_text = document.querySelector('#comment-body').value.trim();
  if (comment_text) {
    const response = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        comment_text, 
        post_id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.reload();
    } else {
      alert(response.statusText); 
    }
  }
}

document.querySelector('#comment-form').addEventListener('click', submitCommentHandler);

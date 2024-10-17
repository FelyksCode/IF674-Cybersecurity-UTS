<script setup>
import { ref } from 'vue';

// Sanitize function to escape HTML tags
const escapeHTML = (unsafeText) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return unsafeText.replace(/[&<>"']/g, (m) => map[m]);
};

const comment = ref('');
const comments = ref('');

// Submit comment with sanitization to prevent rendering HTML tags
const submitComment = () => {
  const sanitizedComment = escapeHTML(comment.value);  // Sanitize the comment
  if(sanitizedComment == ""){
    return;
  }
  comments.value += `<p>${sanitizedComment}</p>`;      // Add sanitized comment
  comment.value = '';
};
</script>

<template>
  <div>
    <h3>Comments</h3>
    <input v-model="comment" placeholder="Leave a comment" />
    <button @click="submitComment">Submit</button>
    <div v-html="comments"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CommentSection from './components/CommentSection.vue';

const userId = ref('');
const users = ref(null);
const newEmail = ref('');

const getUser = async () => {
  const response = await fetch(`http://localhost:3000/api/user/${userId.value}`);
  users.value = await response.json();
};

const changeEmail = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(newEmail.value)) {
    alert('Please enter a valid email address');
    return;
  }

  try {
    // Fetch CSRF token
    const csrfResponse = await fetch('http://localhost:3000/api/csrf-token', {
      credentials: 'include'  // Ensure cookies are included
    });

    if (!csrfResponse.ok) {
      throw new Error('Failed to fetch CSRF token');
    }

    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;

    // Make the POST request with the CSRF token in the header
    const response = await fetch(`http://localhost:3000/api/user/${userId.value}/change-email`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken,  // Add the CSRF token to the request header
      },
      credentials: 'include',  // Ensure credentials are sent
      body: JSON.stringify({ email: newEmail.value }),
    });

    // Handle response
    if (response.ok) {
      const result = await response.json();
      alert('Email updated successfully: ' + result.message);
      getUser();
    } else {
      const errorResponse = await response.json();
      alert('Failed to update email: ' + errorResponse.message);
    }
  } catch (error) {
    alert('An error occurred while changing email. Please try again.');
  }
};
</script>

<template>
  <div id="app">
    <h1>User Dashboard</h1>
    <div>
      <input v-model="userId" placeholder="Enter User ID" />
      <button @click="getUser">Get User Info</button>
    </div>
    <div v-if="users">
      <template v-for="user in users">
        <h2>{{ user.name }}</h2>
        <p>Email: {{ user.email }}</p>
        <hr />
      </template>
    </div>
    <CommentSection />
    <form @submit.prevent="changeEmail">
      <h3>Change Email</h3>
      <input v-model="newEmail" placeholder="New Email" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

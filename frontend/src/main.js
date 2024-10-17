import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Check if the current protocol is not HTTPS
if (window.location.protocol !== 'https:') {
    // Redirect to the HTTPS version of the current URL
    window.location.href = `https://${window.location.host}${window.location.pathname}`;
}

createApp(App).mount('#app')

// ==========================================================================================
// CONFIGURATION
// ==========================================================================================
// 1. Deploy the Apps Script from the README as a Web App in your Google Sheet.
// 2. Copy the Web App URL provided after deployment.
// 3. Paste the URL here, between the single quotes.
// ==========================================================================================

export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwPhJaSl4KiU4U3lz1EsEXkEJxAmdI1cdaJq5sjBsEN6QpCvYGiXqfDW1mVxhwnqX_4iw/exec';
export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '8px';
  toast.style.color = 'white';
  toast.style.backgroundColor = type === 'success' ? '#10B981' /* Tailwind green-500 */ : '#EF4444' /* Tailwind red-500 */;
  toast.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
  toast.style.zIndex = '1000';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s ease, bottom 0.3s ease';

  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.bottom = '40px';
  }, 10);
  
  // Animate out and remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.bottom = '20px';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 4000);
};

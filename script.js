// script.js
document.getElementById('signatureForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const form = event.target;

  if (form.checkValidity()) {
    generateSignature(); // Call the generateSignature function if form is valid
  } else {
    // Display custom error messages for invalid fields
    const inputFields = form.getElementsByTagName('input');
    const textAreas = form.getElementsByTagName('textarea');
    const allFields = [...inputFields, ...textAreas];
    for (const field of allFields) {
      const errorSpan = field.parentNode.querySelector('.error-message');
      if (!field.checkValidity()) {
        errorSpan.textContent = field.validationMessage;
        field.parentNode.classList.add('invalid-input');
      } else {
        errorSpan.textContent = '';
        field.parentNode.classList.remove('invalid-input');
      }
    }
  }
});

document.getElementById('resetButton').addEventListener('click', function () {
  // Clear all input fields
  const form = document.getElementById('signatureForm');
  const inputFields = form.getElementsByTagName('input');
  const textAreas = form.getElementsByTagName('textarea');
  const allFields = [...inputFields, ...textAreas];
  for (const field of allFields) {
    field.value = '';
    field.parentNode.classList.remove('invalid-input');
    const errorSpan = field.parentNode.querySelector('.error-message');
    errorSpan.textContent = '';
  }

  // Clear the generated signature
  document.getElementById('signatureOutput').innerHTML = '';
});

// Function to generate the email signature
async function generateSignature() {
  const formData = new FormData(document.getElementById('signatureForm'));

  // Get form values
  const name = formData.get('name');
  const designation = formData.get('designation');
  const company = formData.get('company');
  const email = formData.get('email');
  const mobile = formData.get('mobile');
  const address = formData.get('address');
  const imageUpload = formData.get('imageUpload');
  const facebookLink = formData.get('facebookLink');
  const twitterLink = formData.get('twitterLink');
  const linkedinLink = formData.get('linkedinLink');

  // If an image is uploaded, handle the image upload and get the hosted image URL
  let imageURL = ''; // Initialize the imageURL variable

  if (imageUpload) {
    try {
      const imageData = new FormData();
      imageData.append('image', imageUpload);

      // Use ImgBB's free image hosting API to upload the image
      const response = await fetch('https://api.imgbb.com/1/upload?key=d5bab5848fda200a739799c302a5d289', {
        method: 'POST',
        body: imageData,
      });

      const data = await response.json();
      if (data.data && data.data.url) {
        imageURL = data.data.url; // Get the hosted image URL from the response
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }

  // Generate the email signature table with the image
  const generatedSignature = `
    <table style="font-family: Arial, sans-serif; border-collapse: collapse;">
      <tr>
        <td>
          ${imageURL ? `<img src="${imageURL}" alt="Profile Image" style="max-width: 100px;">` : ''}
        </td>
        <td>
          <b>${name}</b><br>
          ${designation}<br>
          ${company}<br>
          Email: <a href="mailto:${email}">${email}</a><br>
          Mobile: <a href="tel:${mobile}">${mobile}</a><br>
          ${address}
          <br>
          <!-- Social links -->
          ${facebookLink ? `<a href="${facebookLink}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path fill="#1296f5" d="M23.125 0h-22.25c-.69 0-1.25.56-1.25 1.25v22.5c0 .69.56 1.25 1.25 1.25h12.213v-9.294h-3.298v-3.625h3.298v-2.647c0-3.274 2.052-5.065 4.935-5.065 1.393 0 2.747.248 2.747.248v3.022h-1.547c-1.522 0-2.002.948-2.002 1.927v2.322h3.405l-.546 3.625h-2.859v9.294h5.628c.69 0 1.25-.56 1.25-1.25v-22.5c0-.69-.56-1.25-1.25-1.25z"/></svg></a>` : ''}
          ${twitterLink ? `<a href="${twitterLink}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path fill="#1296f5" d="M22.977 4.562c-.84.372-1.745.624-2.688.738 0 0 .006-.003.006-.003a4.386 4.386 0 0 0-7.12 4.214 12.466 12.466 0 0 1-9.015-4.562c-.376.64-.594 1.383-.594 2.18 0 1.504.765 2.832 1.928 3.614-.712-.023-1.383-.218-1.97-.54v.054c0 2.1 1.522 3.866 3.536 4.257-.372.102-.763.16-1.167.16-.284 0-.56-.033-.828-.098.562 1.75 2.183 3.024 4.096 3.06-1.5 1.176-3.377 1.874-5.414 1.874-.362 0-.717-.022-1.07-.062 1.928 1.24 4.21 1.96 6.666 1.96 7.994 0 12.358-6.63 12.358-12.358 0-.188-.004-.37-.01-.548a8.89 8.89 0 0 0 2.18-2.257l-.047-.02z"/></svg></a>` : ''}
          ${linkedinLink ? `<a href="${linkedinLink}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="width: 24px; height: 24px;"><path fill="#0077B5" d="M20 0H4C1.8 0 0 1.8 0 4v16c0 2.2 1.8 4 4 4h16c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4zM8 20H5V9h3v11zm-1.5-12C6.1 8 5 6.9 5 5.5S6.1 3 7.5 3 10 4.1 10 5.5 8.9 8 7.5 8zm12 12h-3V13c0-1.1-.9-2-2-2s-2 .9-2 2v9h-3V9h3v1.2c.6-1 2.1-1.6 3-1.6 2.5 0 4.5 2 4.5 4.5V20z"/></svg></a>` : ''}

      </tr>
    </table>
  `;

 // Display the generated signature in the output div
 const signatureOutput = document.getElementById('signatureOutput');
 signatureOutput.innerHTML = generatedSignature;

 // Display the generated email signature code
 const codeContainer = document.querySelector('.code-container');
 const generatedCode = document.getElementById('generatedCode');
 generatedCode.textContent = generatedSignature;
 codeContainer.style.display = 'block';

 // Scroll to the code container to make it visible after generation
 codeContainer.scrollIntoView({ behavior: 'smooth' });
}

// Event listener for the copy button
document.getElementById('copyButton').addEventListener('click', function () {
 const generatedCode = document.getElementById('generatedCode');
 copyToClipboard(generatedCode.textContent);
 alert('Code copied to clipboard!');
});

// Function to copy text to clipboard
function copyToClipboard(text) {
 const textarea = document.createElement('textarea');
 textarea.value = text;
 document.body.appendChild(textarea);
 textarea.select();
 document.execCommand('copy');
 document.body.removeChild(textarea);
}


// Event listeners to update the signature in real-time and remove error messages
const inputFields = document.getElementById('signatureForm').getElementsByTagName('input');
const textAreas = document.getElementById('signatureForm').getElementsByTagName('textarea');
const allFields = [...inputFields, ...textAreas];
for (const field of allFields) {
  field.addEventListener('input', function () {
    const errorSpan = this.parentNode.querySelector('.error-message');
    if (!this.checkValidity()) {
      errorSpan.textContent = this.validationMessage;
      this.parentNode.classList.add('invalid-input');
    } else {
      errorSpan.textContent = '';
      this.parentNode.classList.remove('invalid-input');
      generateSignature(); // Regenerate the signature on each input change
    }
  });
}

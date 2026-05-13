const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


const phoneRegex = /^(\+?\d{1,4}[\s-]?)?(\d{7,10})$/;


const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}([\/\w .-]*)*\/?$/;

export {
    emailRegex,phoneRegex,websiteRegex
}
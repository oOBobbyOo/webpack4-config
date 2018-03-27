if (process.env.NODE_ENV !== "production") {
	console.log("Looks like we are in development mode!");
}

if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/service-worker.js').then(registration => {
			console.log('SW registered: ', registration);
		}).catch(registrationError => {
			console.log('SW registration failed: ', registrationError);
		});
	});
}


import "./css/reset.css";
import "./css/about.css";

console.log('about');
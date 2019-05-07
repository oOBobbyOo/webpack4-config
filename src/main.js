import '@/assets/css/reset.css';
import '@/assets/css/index.scss';

// service-worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

console.log('hello webpack');

var p1 = new Promise(function(resolve, reject) {
  resolve('bobby');
  // reject('error');
});

p1.then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
});

document.addEventListener('click', () => {
  // { default: name }
  import ( /* webpackChunkName：'test', webpackPrefetch：true */ './test').then(Test => {
    console.log(Test);
    Test.isES6();
    console.log(Test.bobby);
  });
});
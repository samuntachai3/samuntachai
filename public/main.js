document.addEventListener('DOMContentLoaded', function() {
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
  // // The Firebase SDK is initialized and available here!
  //
  // firebase.auth().onAuthStateChanged(user => { });
  // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
  // firebase.messaging().requestPermission().then(() => { });
  // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
  //
  // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

  try {
    let app = firebase.app();
    let features = ['auth', 'database', 'messaging', 'storage'].filter
    (feature => typeof app[feature] === 'function');
    document.getElementById('status').innerHTML = "Firebase SDK loaded with ${features.join(', ')};"

    let db = firebase.database();

    db.ref('contacts').on('child_added', snapshot => {
        if (snapshot.exists()) {
          console.log("added",snapshot.val(),snapshot.key);
            let contactRecord = contactRecordFromSnapshot(snapshot);

            let contactsElem = document.querySelector('#contacts');

            contactsElem.innerHTML = contactRecord + contactsElem.innerHTML;
        }
    });
   
 
    document.querySelector('.addContact')
    .addEventListener('click',event => {
        event.preventDefault();
        if (document.querySelector('#name').value != '' && 
              (document.querySelector('#email').value != '' || 
              document.querySelector('#phone').value != '')
        ){
            db.ref('contacts').push({
                name: document.querySelector('#name').value,detail:{
                  email: document.querySelector('#email').value,
                  phone: document.querySelector('#phone').value
              }              
          });
          contactForm.reset();
        }else {
            document.querySelector('status').innerHTML = 'Some fields are missing';
        }
    });
    
   
  } catch(e) {
      console.error(e);
      document.getElementById('status').innerHTML = 'Error loading the Firebase SDK, check the console.';
  }

  });


function contactRecordFromSnapshot(snapshot) {

  let contact = snapshot.val();
  let key = snapshot.key;
  var record = '';
  
  record += '<li>' + contact.name + '</li>';
  record += '<ul>';
  record += '<li>Email: ' + contact.detail.email + '</li>';
  record += '<li>Phone: ' + contact.detail.phone + '</li>';
  record += '<button><a href onClick="Removecontact( \'' + key + '\' )">Remove</a></button>';
  record += '</ul></li>';


  return record;

}

function Removecontact(key) {

  firebase.database().ref('contacts/' + key).remove();
  console.log("remove",key)
  //reload page
  window.location.reload(false);

}
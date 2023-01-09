// UI elements.
const connectButton = document.getElementById('connect');
const disconnectButton = document.getElementById('disconnect');
const onBtn = document.getElementById('turnon');
const offBtn = document.getElementById('turnoff');
const humidity = document.getElementById('humidity');
const temperature = document.getElementById('temperature');

var serviveUuid = 0xFFE0
var characteristicUuid = 0xFFE1

const terminal = new BluetoothTerminal(serviveUuid,characteristicUuid,
'\n','\n');


//const terminal = new BluetoothTerminal();

// Override `receive` method to log incoming data to the terminal.
terminal.receive = function(data) {
  console.log(data);
  const decodeData = data.split(":");
  switch (decodeData[0] ) {
    case 't':
      let tempAndHumid = decodeData[1].split(",");
      let temp = parseFloat(tempAndHumid[0]);
      let humid = parseFloat(tempAndHumid[1]);
      temperature.textContent=temp.toFixed(1) + " ℃";
      humidity.textContent=humid.toFixed(1) + " %";
      break;
    case 'w':
      let DwarnData = {
        message: '偵測到物體靠近',
        timeout: 3000,
      };
      var snackbarContainer = document.querySelector('#demo-toast-example');
      snackbarContainer.MaterialSnackbar.showSnackbar(DwarnData);
      break;
    case 'o':
      let OwarnData = {
        message: '偵測到濕度過高，已開啟電器',
        timeout: 3000,
      };
      var snackbarContainer = document.querySelector('#demo-toast-example');
      snackbarContainer.MaterialSnackbar.showSnackbar(OwarnData);
      break;
  }
};

// Implement own send function to log outcoming data to the terminal.
const send = (data) => {
 
  terminal.send(data).
      then(() => console.log('send:'+data)).
      catch((error) => alert(error));
};

// Bind event listeners to the UI elements.
connectButton.addEventListener('click', () => {
  terminal.connect().
      then(() => {});
});

disconnectButton.addEventListener('click', () => {
  terminal.disconnect();
});

onBtn.addEventListener('click', (event) => {
  event.preventDefault();
  send("1");
});

offBtn.addEventListener('click', (event) => {
  event.preventDefault();
  send("2");
});
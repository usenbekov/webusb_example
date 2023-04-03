
!function() {
  const root = new SimpleComp(document.querySelector('#container'));
  if (!('usb' in navigator)) {
    root.append(root.block('WebUSB API is not supported!'));
    return;
  }

  const devices = new SimpleComp();

  async function renderDevices() {
    devices.clear();
    const items = await getDevices();
    items.forEach(device => {
      const child = new SimpleComp();
      
      child.append(child.block(device.productName))
      child.append(child.block(child.button('Test TSPL print', async (btn) => {
        btn.disabled = true;
        try {
          await tsplTestPrint(device);
        } catch (e) {
          console.error(e);
        }
        btn.disabled = false;
      })))
      child.append(child.block(child.button('Forget this device', async () => {
        await device.forget();
        renderDevices();
      })))

      devices.append(devices.block(child.container))
      devices.append(devices.divider())
    });
  }

  root.append(root.block(root.button('Request device', async () => {
    await requestDevice();
    renderDevices();
  })))
  root.append(root.divider())
  root.append(devices.container);
  renderDevices();
}()

async function getDevices() {
  return await navigator.usb.getDevices();
}

async function requestDevice() {
  try {
    await navigator.usb.requestDevice({ filters: [] });
  } catch (e) {
    console.error(e);
  }
}

async function tsplTestPrint(device) {
  const cmds = [
    'SIZE 48 mm,25 mm',
    'CLS',
    'TEXT 30,10,"4",0,1,1,"HackerNoon"',
    'TEXT 30,50,"2",0,1,1,"WebUSB API"',
    'BARCODE 30,80,"128",70,1,0,2,2,"altospos.com"',
    'PRINT 1',
    'END',
  ];
  
  await device.open();
  await device.selectConfiguration(1);
  await device.claimInterface(0);
  await device.transferOut(
    device.configuration.interfaces[0].alternate.endpoints.find(obj => obj.direction === 'out').endpointNumber,
    new Uint8Array(
      new TextEncoder().encode(cmds.join('\r\n'))
    ),
  );
  await device.close();
}
























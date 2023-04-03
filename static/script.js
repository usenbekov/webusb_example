!function() {
  const root = new SimpleComp(document.querySelector('#container'));
  const webusb = new Webusb();
  if (!webusb.isSupported()) {
    root.append(root.block('WebUSB API is not supported!'));
    return;
  }
  
  const devices = new SimpleComp();

  async function renderDevices() {
    devices.clear();
    const items = await webusb.getDevices();
    items.forEach(device => {
      const child = new SimpleComp();

      child.append(child.block(device.productName))
      child.append(child.block(child.button('Test TSPL print', async (btn) => {
        btn.disabled = true;
        try {
          await webusb.tsplTestPrint(device);
        } catch (e) {
          console.error(e);
        }
        btn.disabled = false;
      })))
      child.append(child.block(child.button('Forget this device', async () => {
        await webusb.forget(device);
        renderDevices();
      })))

      devices.append(devices.block(child.container))
      devices.append(devices.divider())
    });
  }

  root.append(root.block(root.button('Request device', async () => {
    await webusb.requestDevice();
    renderDevices();
  })))
  root.append(root.divider())
  root.append(devices.container);
  renderDevices();
}()

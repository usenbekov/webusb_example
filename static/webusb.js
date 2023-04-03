class Webusb {
  isSupported() {
    return 'usb' in navigator;
  }

  async getDevices() {
    return await navigator.usb.getDevices();
  }
  
  async requestDevice() {
    try {
      await navigator.usb.requestDevice({ filters: [] });
    } catch (e) {
      console.error(e);
    }
  }

  async forget(device) {
    await device.forget();
  }
  
  async tsplTestPrint(device) {
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
}

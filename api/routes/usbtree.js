var express = require("express");
var router = express.Router();
var usb = require('usb')


function list_to_tree(list) {
    var map = {}, node, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
        map[list[i].id] = i; // initialize the map
        list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parentId !== "0") {
            // if you have dangling branches check that map[node.parentId] exists
            list[map[node.parentId]].children.push(node);
        } else {
            roots.push(node);
        }
    }
    return roots;
}

router.get("/", async (req, res) => {
    let devices = usb.getDeviceList()
    var entries = []
    var usbDevices = []
    devices.forEach(device => {
        console.log("device " + device.deviceAddress);
        var parent = 0
        if (device.parent != null) {
            parent = device.parent.deviceAddress
            console.log("\tParent is " + device.parent.deviceAddress);
        }
        usbDevices.push({
            "id": device.deviceAddress,
            "children": null,
            "parentId": parent.toString(10),
            "vendorId": device.deviceDescriptor.idVendor,
            "productId": device.deviceDescriptor.idProduct,
            "name": "VID:" + device.deviceDescriptor.idVendor + " PID:"+device.deviceDescriptor.idProduct
        })
        /*
        device.open()
        entries.push(new Promise(resolve => {
                var parent = 0
                if (device.parent != null) {
                    parent = device.parent.deviceAddress
                    console.log("\tParent is " + device.parent.deviceAddress);
                }
            
            device.getStringDescriptor(4, (error, data) => {
                console.log("device " + device.deviceAddress);
                var parent = 0
                if (device.parent != null) {
                    parent = device.parent.deviceAddress
                    console.log("\tParent is " + device.parent.deviceAddress);
                }
                usbDevices.push({

                })

                resolve({
                    "id": device.deviceAddress,
                    "children": null,
                    "parentId": parent.toString(10),
                    "vendorId": device.deviceDescriptor.idVendor,
                    "productId": device.deviceDescriptor.idProduct,
                    "description": data,
                    "name": "VID:" + device.deviceDescriptor.idVendor + " PID:"+device.deviceDescriptor.idProduct+" "+data
                });
                console.log("\t" + data);
                device.close();
            })
            
        }))
        */
    })

    let tree = list_to_tree(usbDevices)
    let result = {"result" : tree}
    console.log(result);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result, null, 3));

/*
    Promise.all(entries).then((values) => {
        let tree = list_to_tree(values)
        let result = {"result" : tree}
        console.log(result);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result, null, 3));
    })
*/
    


});

module.exports = router;
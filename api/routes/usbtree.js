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
    devices.forEach(device => {
        device.open()
        entries.push(new Promise(resolve => {
            device.getStringDescriptor(4, (error, data) => {
                console.log("device " + device.deviceAddress);
                var parent = 0
                if (device.parent != null) {
                    parent = device.parent.deviceAddress
                    console.log("\tParent is " + device.parent.deviceAddress);
                }

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
    })

    let data = {
        name: 'Parenting',
        children: [{
            name: 'Child\n1'
        }, {
            name: 'Child Two'
        }]
    }

    Promise.all(entries).then((values) => {
        let tree = list_to_tree(values)
        let result = {"result" : tree}
        console.log(result);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result, null, 3));
    })

    


});

module.exports = router;
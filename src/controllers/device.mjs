import { Device } from '../db/schemas/device.mjs';

export async function createDevice(req, res) {
    try {
        const { user, name, physicalId } = req.body;

        const device = new Device({
            user,
            name,
            physicalId,
        });

        await device.save();

        res.status(201).json({ device });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create device' });
    }
}

export async function getDevices(req, res) {
    try {
        const devices = await Device.find();

        res.status(200).json({ devices });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve devices' });
    }
}

export async function getUserDevices(req, res) {
    try {
        const userId = req.params.userId;

        const devices = await Device.find({ user: userId });

        res.status(200).json({ devices });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve devices' });
    }
}

export async function updateDevice(req, res) {
    try {
        const deviceId = req.params.deviceId;
        const { name, physicalId } = req.body;

        const device = await Device.findByIdAndUpdate(deviceId, { name, physicalId }, { new: true });

        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        res.status(200).json({ device });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update device' });
    }
}

export async function deleteDevice(req, res) {
    try {
        const deviceId = req.params.deviceId;

        const device = await Device.findByIdAndDelete(deviceId);

        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        res.status(200).json({ message: 'Device deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete device' });
    }
}

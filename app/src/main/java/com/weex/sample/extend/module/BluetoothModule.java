package com.weex.sample.extend.module;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGatt;
import android.bluetooth.BluetoothGattCallback;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;
import android.bluetooth.BluetoothManager;
import android.bluetooth.BluetoothProfile;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.util.Log;

import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;
import com.taobao.weex.common.WXModule;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Created by Administrator on 2017/5/16.
 */

public class BluetoothModule extends WXModule {

    private BluetoothAdapter mBluetoothAdapter;
    private BluetoothDevice mBluetoothDevice;
    private BluetoothGatt mBluetoothGatt;
    private BluetoothManager mBluetoothManager;
    private List<BluetoothDevice> mBDList = new ArrayList<>();

    /**
     * js回调函数
     */
    public JSCallback mDiscoveryCallback;//搜索到蓝牙设备回调
    public JSCallback mServicesCallback;//发现服务回调
    public JSCallback mValueChangeCallback;//蓝牙传值回调
    public JSCallback mScanTimeOutCallback;//扫描超时回调
    public JSCallback mBluetoothStateChangeCallback;//蓝牙状态改变回调
    public JSCallback mOpenAdapterCallback;//打开蓝牙适配器回调


    private String mServiceUuid;
    private String mRecUuid;
    private static final String UUID_HEADER = "0000";
    private static final String UUID_END = "-0000-1000-8000-00805f9b34fb";

    //service uuid
    public static final String DATA_SERVICE_UUID = "0000FFF0-0000-1000-8000-00805f9b34fb";
    //reciver uuid
    public static final String REC_PKG_CHAR_UUID = "0000FFF1-0000-1000-8000-00805f9b34fb";
    //send uuid
    public static final String SEND_PKG_CHAR_UUID = "0000FFF2-0000-1000-8000-00805F9B34FB";
    //notify uuid
    public static final String CLIENT_CHARACTERISTIC_CONFIG = "00002902-0000-1000-8000-00805f9b34fb";

    private static String TAG = "BluetoothModule";

    public static int REQUEST_CODE = 11111;


    @JSMethod
    public void onBLEConnectionStateChange(JSCallback jsCallback) {
        mBluetoothStateChangeCallback = jsCallback;
    }

    /**
     * 蓝牙适配器状态改变
     */
    @JSMethod
    public void onBluetoothAdapterStateChange(JSCallback jsCallback) {
        Map<String, Object> maps = new HashMap<>();
        Map<String, Boolean> adapterMap = new HashMap<>();
        maps.put("result", "success");
        maps.put("errCode", "0");
        adapterMap.put("discovering", mBluetoothAdapter.isDiscovering());
        adapterMap.put("available", mBluetoothAdapter.isEnabled());
        maps.put("adapterState", adapterMap);
        jsCallback.invokeAndKeepAlive(maps);
    }


    /**
     * 断开蓝牙连接
     *
     * @param deviceID
     * @param jsCallback
     */
    @JSMethod
    public void closeBLEConnectionWithDeviceID(String deviceID, JSCallback jsCallback) {
        Log.i(TAG, "closeBLEConnectionWithDeviceID");
        if (mBluetoothGatt != null) {
            mBluetoothGatt.disconnect();
            mBluetoothGatt.close();
            mBluetoothGatt = null;

            Map<String, Object> maps = new HashMap<>();
            Map<String, String> deviceMap = new HashMap<>();
            maps.put("result", "success");
            maps.put("errCode", "0");
            deviceMap.put("deviceID", mBluetoothDevice.getAddress());
            deviceMap.put("name", mBluetoothDevice.getName());
            maps.put("device", deviceMap);
            jsCallback.invokeAndKeepAlive(maps);
        }
    }


    /**
     * 初始化蓝牙适配器
     */
    @JSMethod
    public void openBluetoothAdapter(JSCallback jsCallback) {
        mOpenAdapterCallback = jsCallback;
        mBluetoothManager = (BluetoothManager) mWXSDKInstance.getContext().getSystemService(Context.BLUETOOTH_SERVICE);
        if (mBluetoothManager != null) {
            mBluetoothAdapter = mBluetoothManager.getAdapter();
            if (mBluetoothAdapter != null) {
                if (!mBluetoothAdapter.isEnabled()) {
                    //mBluetoothAdapter.enable();  //打开蓝牙
                    Intent mIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                    Activity activity = (Activity)mWXSDKInstance.getContext();
                    activity.startActivityForResult(mIntent, REQUEST_CODE);
                }else{
                    Log.i(TAG, "openBluetoothAdapter");
                    Map<String, Object> map = new HashMap<>();
                    map.put("result", "success");
                    map.put("errCode", 0);
                    mOpenAdapterCallback.invokeAndKeepAlive(map);
                }
            }
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        Log.i(TAG, "onActivityResult : " + resultCode);
        Map<String, Object> map = new HashMap<>();
        switch (resultCode)
        {
            case Activity.RESULT_OK:
                map.put("result", "success");
                map.put("errCode", 0);
                break;
            case Activity.RESULT_CANCELED:
                map.put("result", "fail");
                map.put("errCode", 10001);
                break;
        }
        mOpenAdapterCallback.invokeAndKeepAlive(map);
    }

    /**
     * 开始搜寻附近的蓝牙外围设备
     */
    private final int STOP_LESCAN = 0x1;

    @JSMethod
    public void startBluetoothDevicesDiscoveryWithServices(List<String> services, JSCallback jsCallback) {
        mBDList.clear();
        this.mDiscoveryCallback = jsCallback;
        mBluetoothAdapter.startLeScan(mLeScanCallback);
        Log.i(TAG, "startBluetoothDevicesDiscoveryWithServices");
        //// TODO: 2017/5/17 扫描超时操作
        mHandler.sendEmptyMessageDelayed(STOP_LESCAN, 10 * 1000);  //这个搜索10秒，如果搜索不到则停止搜索
    }

    private Handler mHandler = new Handler() {
        public void handleMessage(android.os.Message msg) {
            switch (msg.what) {
                case STOP_LESCAN: {
                    mBluetoothAdapter.stopLeScan(mLeScanCallback);
                    if (mScanTimeOutCallback != null)
                        mScanTimeOutCallback.invokeAndKeepAlive("");
                    Log.i(TAG, "Scan time is up");
                }
                break;
            }
        }
    };

    /**
     * 搜索结果回调
     */
    private BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter.LeScanCallback() {
        @Override
        public void onLeScan(BluetoothDevice device, int arg1, byte[] arg2) {
            if (device.getName() == null) {
                return;
            }
            mBDList.add(device);
            Map<String, String> infos = new HashMap<>();
            infos.put("deviceID", device.getAddress());
            infos.put("name", device.getName());
            Log.i(TAG, "Discovery Device : " +  device.getName());
            mDiscoveryCallback.invoke(infos);
        }
    };

    /**
     * 停止搜寻附近的蓝牙外围设备
     */
    @JSMethod
    public void stopBluetoothDeviceDiscovery() {
        mBluetoothAdapter.stopLeScan(mLeScanCallback);
    }

    /**
     * 连接蓝牙
     *
     * @param deviceID
     * @param jsCallback
     */
    @JSMethod
    public void createBLEConnectionWithDeviceID(String deviceID, final JSCallback jsCallback) {
        mHandler.removeMessages(STOP_LESCAN);
        Log.i(TAG, "STOP_LESCAN");
        for (int i = 0; i < mBDList.size(); i++) {
            if (deviceID.equals(mBDList.get(i).getAddress())) {
                mBluetoothDevice = mBDList.get(i);
                Thread thread = new Thread(new Runnable() {
                    @Override
                    public void run() {
                        mBluetoothGatt = mBluetoothDevice.connectGatt(mWXSDKInstance.getContext(), false, mGattCallback);  //mGattCallback为回调接口
                        if (mBluetoothGatt != null) {
                            if (mBluetoothGatt.connect()) {
                                Log.d(TAG, "Connect success.");
                                Map<String, Object> maps = new HashMap<>();
                                Map<String, String> deviceMap = new HashMap<>();
                                maps.put("result", "success");
                                maps.put("errCode", "0");
                                deviceMap.put("deviceID", mBluetoothDevice.getAddress());
                                deviceMap.put("name", mBluetoothDevice.getName());
                                maps.put("device", deviceMap);
                                jsCallback.invokeAndKeepAlive(maps);
                            } else {
                                Log.d(TAG, "Connect fail.");
                                Map<String, Object> maps = new HashMap<>();
                                Map<String, String> deviceMap = new HashMap<>();
                                maps.put("result", "fail");
                                maps.put("errCode", "10001");
                                deviceMap.put("deviceID", mBluetoothDevice.getAddress());
                                deviceMap.put("name", mBluetoothDevice.getName());
                                maps.put("device", deviceMap);
                                jsCallback.invokeAndKeepAlive(maps);
                            }
                        }
                    }
                });
                thread.run();
            } else {
                Log.d(TAG, "BluetoothGatt null.");
                Map<String, Object> maps = new HashMap<>();
                Map<String, String> deviceMap = new HashMap<>();
                maps.put("result", "fail");
                maps.put("errCode", "10001");
                deviceMap.put("deviceID", mBluetoothDevice.getAddress());
                deviceMap.put("name", mBluetoothDevice.getName());
                maps.put("device", deviceMap);
                jsCallback.invokeAndKeepAlive(maps);
            }
            return;
        }
    }

    @JSMethod
    public void getBLEDeviceServicesWithDeviceID(String deviceID, JSCallback jsCallback) {
        this.mServicesCallback = jsCallback;
    }

    @JSMethod
    public void getBLEDeviceCharacteristicsWithDeviceID(String deviceID, String serviceID, JSCallback jsCallback) {
        mServiceUuid = UUID_HEADER + serviceID + UUID_END;
        BluetoothGattService service = mBluetoothGatt.getService(UUID.fromString(mServiceUuid));
        List<BluetoothGattCharacteristic> characteristics = service.getCharacteristics();
        List<Map<String, Object>> lists = new ArrayList<>();
        for (int i = 0; i < characteristics.size(); i++) {
            BluetoothGattCharacteristic gattCharacteristic = characteristics.get(i);
            Map<String, Object> map = new HashMap<>();
            map.put("UUID", gattCharacteristic.getUuid().toString().substring(4, 8).toUpperCase());
            map.put("properties", gattCharacteristic.getProperties());
            lists.add(map);
        }
        jsCallback.invoke(lists);
    }

    /**
     * weex向蓝牙设备写数据
     *
     * @param deviceID
     * @param serviceID
     * @param characteristicID 这两个参数是要转化成32位长度的特征码，weex传输过来的是4位长度的特征值
     * @param value            要转换成byte[]格式数据
     * @param jsCallback
     */
    @JSMethod
    public void writeBLECharacteristicValueWithDeviceID(String deviceID, String serviceID, String characteristicID, String value, JSCallback jsCallback) {
        write(hexStringToBytes(value));
        Map<String, Object> maps = new HashMap<>();
        maps.put("result", "success");
        maps.put("errCode", 0);
        jsCallback.invoke(maps);
    }

    @JSMethod
    public void notifyBLECharacteristicValueChangeWithDeviceID(String deviceID, String serviceID, String characteristicID, boolean flag, JSCallback jsCallback) {
        this.mValueChangeCallback = jsCallback;
        mRecUuid = UUID_HEADER + characteristicID + UUID_END;
        openBLEDataIn();
    }

    /**
     * 获取服务
     *
     * @param uuid
     * @return
     */
    public BluetoothGattService getService(UUID uuid) {
        if (mBluetoothAdapter == null || mBluetoothGatt == null) {
            Log.e(TAG, "BluetoothAdapter not initialized");
            return null;
        }
        return mBluetoothGatt.getService(uuid);
    }

    /**
     * 获取服务下Characteristic对象
     *
     * @param serviceUUID
     * @param characteristicUUID
     * @return
     */
    private BluetoothGattCharacteristic getCharcteristic(String serviceUUID, String characteristicUUID) {
        //得到服务对象
        BluetoothGattService service = getService(UUID.fromString(serviceUUID));

        if (service == null) {
            Log.e(TAG, "Can not find 'BluetoothGattService'");
            return null;
        }

        //得到此服务结点下Characteristic对象
        final BluetoothGattCharacteristic gattCharacteristic = service.getCharacteristic(UUID.fromString(characteristicUUID));
        if (gattCharacteristic != null) {
            return gattCharacteristic;
        } else {
            Log.e(TAG, "Can not find 'BluetoothGattCharacteristic'");
            return null;
        }
    }

    /**
     * 向蓝牙设备写入数据----begin
     *
     * @param data
     */
    public void write(byte[] data) {   //一般都是传byte
        //得到可写入的characteristic Utils.isAIRPLANE(mContext) &&
        if (!mBluetoothAdapter.isEnabled()) {
            Log.e(TAG, "writeCharacteristic 蓝牙无效");
            return;
        }
        BluetoothGattCharacteristic writeCharacteristic = getCharcteristic(mServiceUuid,
                SEND_PKG_CHAR_UUID);  //这个UUID都是根据协议号的UUID
        if (writeCharacteristic == null) {
            Log.e(TAG, "Write failed. GattCharacteristic is null.");
            return;
        }
        writeCharacteristic.setValue(data); //为characteristic赋值
        writeCharacteristicWrite(writeCharacteristic);
    }

    public void writeCharacteristicWrite(BluetoothGattCharacteristic characteristic) {
        if (mBluetoothAdapter == null || mBluetoothGatt == null) {
            Log.e(TAG, "BluetoothAdapter not initialized");
            return;
        }
        Log.i(TAG, "BluetoothAdapter 写入数据");
        boolean isBoolean = false;
        isBoolean = mBluetoothGatt.writeCharacteristic(characteristic);
        Log.i(TAG, "BluetoothAdapter_writeCharacteristic = " + isBoolean);  //如果isBoolean返回的是true则写入成功
    }
    /**
     * 向蓝牙设备写入数据----end
     */

    /**
     * 连接结果回调
     */
    private final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
        @Override
        public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
            if (newState == BluetoothProfile.STATE_CONNECTED) {
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                gatt.discoverServices();
                Log.i(TAG, "Connected to GATT server.");
            } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
                if (mBluetoothDevice != null) {
                    Log.i(TAG, "重新连接");
                    if (mBluetoothGatt != null) {
                        Log.w(TAG, "mBluetoothGatt closed 1");
                        mBluetoothGatt.disconnect();
                        mBluetoothGatt.close();
                        mBluetoothGatt = null;
                    }
                    // TODO: 2017/5/17 断线重连操作
                    if (mBluetoothStateChangeCallback != null) {
                        Map<String, Object> maps = new HashMap<>();
                        Map<String, String> deviceMap = new HashMap<>();
                        maps.put("result", "success");
                        maps.put("errCode", "0");
                        deviceMap.put("deviceID", mBluetoothDevice.getAddress());
                        deviceMap.put("name", mBluetoothDevice.getName());
                        maps.put("device", deviceMap);
                        mBluetoothStateChangeCallback.invokeAndKeepAlive(maps);
                    }

                } else {
                    Log.i(TAG, "Disconnected from GATT server.");
                    if (mBluetoothGatt != null) {
                        Log.i(TAG, "mBluetoothGatt closed 2");
                        mBluetoothGatt.disconnect();
                        mBluetoothGatt.close();
                        mBluetoothGatt = null;
                    }
                }
            }else if(newState == BluetoothProfile.STATE_CONNECTING){
                Log.i(TAG, "STATE_CONNECTING");
            }else if(newState == BluetoothProfile.STATE_DISCONNECTING) {
                Log.i(TAG, "STATE_DISCONNECTING");
            }
        }

        @Override
        public void onServicesDiscovered(BluetoothGatt gatt, int status) {
            if (status == BluetoothGatt.GATT_SUCCESS) {
                Log.i(TAG, "onServicesDiscovered");
                List<BluetoothGattService> services = gatt.getServices();
                List<Map<String, Object>> lists = new ArrayList<>();
                for (int i = 0; i < services.size(); i++) {
                    BluetoothGattService gattService = services.get(i);
                    Map<String, Object> map = new HashMap<>();
                    map.put("UUID", gattService.getUuid().toString().substring(4, 8).toUpperCase());
                    map.put("isPrimary", gattService.getType() == 0 ? true : false);
                    lists.add(map);
                }
                mServicesCallback.invoke(lists);
                //openBLEDataIn(); //打开BLE设备的 notify 通道,这样才能接受到设备返回的数据
            } else {
                Log.i(TAG, "onServicesDiscovered status------>" + status);
            }
        }

        @Override
        public void onCharacteristicRead(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            Log.d(TAG, "onCharacteristicRead------>" + bytesToHexString(characteristic.getValue()));
        }


        @Override
        public void onCharacteristicChanged(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic) {
            byte[] value = characteristic.getValue();
            Log.d(TAG, "onCharacteristicChanged------>" + bytesToHexString(characteristic.getValue()));
            Map<String, String> map = new HashMap<>();
            map.put("value", bytesToBinary(characteristic.getValue()));
            mValueChangeCallback.invokeAndKeepAlive(map);
        }


        //接受Characteristic被写的通知,收到蓝牙模块的数据后会触发onCharacteristicWrite
        @Override
        public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
            Log.d(TAG, "status = " + status);
            byte[] value = characteristic.getValue();
            Log.d(TAG, "onCharacteristicWrite------>" + bytesToHexString(characteristic.getValue()));
        }
    };

    /**
     * 打开BLE设备的 notify 通道
     */
    public void openBLEDataIn() {
        if (mBluetoothGatt != null) {
            BluetoothGattService service = getService(UUID.fromString(mServiceUuid));
            if (service != null) {
                BluetoothGattCharacteristic characteristic = service.getCharacteristic(UUID.fromString(mRecUuid));
                if (characteristic != null) {
                    BluetoothGattDescriptor descriptor = characteristic.getDescriptor(UUID.fromString(CLIENT_CHARACTERISTIC_CONFIG));
                    descriptor.setValue(BluetoothGattDescriptor.ENABLE_NOTIFICATION_VALUE);
                    mBluetoothGatt.writeDescriptor(descriptor);
                    mBluetoothGatt.setCharacteristicNotification(characteristic, true);
                    Log.i(TAG, "openBLEDataIn() 蓝牙设备的nofity通知发出， 蓝牙连接完成，准备接收命令");
                }
            }
        }
    }

    /**
     * 　　* Convert byte[] to hex
     * string.这里我们可以将byte转换成int，然后利用Integer.toHexString(int)来转换成16进制字符串。
     * 　　* @param src byte[] data
     * 　　* @return hex string
     */
    public String bytesToHexString(byte[] src) {
        StringBuilder stringBuilder = new StringBuilder("");
        if (src == null || src.length <= 0) {
            return null;
        }
        for (int i = 0; i < src.length; i++) {
            int v = src[i] & 0xFF;
            String hv = Integer.toHexString(v);
            if (hv.length() < 2) {
                stringBuilder.append(0);
            }
            stringBuilder.append(hv);
        }
        return stringBuilder.toString();
    }

    /**
     * 把字节数组转换成16进制字符串
     *
     * @param bArray
     * @return
     */
    public int[] bytesToHexStringTwo(byte[] bArray, int count) {
        int[] fs = new int[count];
        for (int i = 0; i < count; i++) {
            fs[i] = (0xFF & bArray[i]);
        }
        return fs;
    }


    /**
     * Convert byte[] to Binary
     *
     * @param src
     * @return
     */
    public String bytesToBinary(byte[] src) {
        StringBuilder stringBuilder = new StringBuilder("");
        if (src == null || src.length <= 0) {
            return null;
        }
        for (int i = 0; i < src.length; i++) {
            int v = src[i] & 0xFF;
            String tString = Integer.toBinaryString((v + 0x100)).substring(1);
            stringBuilder.append(tString);
        }
        return stringBuilder.toString();
    }


    /**
     * String转换成byte[]
     *
     * @param c 0-9，字母是A-F，length必须是偶数
     * @return byte[]
     */
    private byte charToByte(char c) {
        return (byte) "0123456789ABCDEF".indexOf(c);
    }

    public byte[] hexStringToBytes(String hexString) {
        if (hexString == null || hexString.equals("")) {
            return null;
        }
        hexString = hexString.toUpperCase();
        int length = hexString.length() / 2;
        char[] hexChars = hexString.toCharArray();
        byte[] d = new byte[length];
        for (int i = 0; i < length; i++) {
            int pos = i * 2;
            d[i] = (byte) (charToByte(hexChars[pos]) << 4 | charToByte(hexChars[pos + 1]));
        }
        return d;
    }


}

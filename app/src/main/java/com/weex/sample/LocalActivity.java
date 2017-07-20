package com.weex.sample;

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
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.example.administrator.library.CustomUtil;
import com.taobao.weex.IWXRenderListener;
import com.taobao.weex.WXSDKInstance;
import com.taobao.weex.common.WXRenderStrategy;
import com.taobao.weex.utils.WXFileUtils;
import com.weex.sample.extend.module.BluetoothModule;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import rx.Observable;
import rx.Subscriber;
import rx.functions.Action1;
import rx.functions.Func1;

public class LocalActivity extends AppCompatActivity implements IWXRenderListener {

  WXSDKInstance mWXSDKInstance;

  private BluetoothAdapter mBluetoothAdapter;
  private BluetoothDevice mBluetoothDevice;
  private BluetoothGatt mBluetoothGatt;
  private BluetoothManager mBluetoothManager;
  private boolean isScanning = false;
  private final int STOP_LESCAN = 0x1;
  private static String TAG = LocalActivity.class.getName();

  public static final String DATA_SERVICE_UUID = "0000FFE0-0000-1000-8000-00805F9B34FB";     //血压计提供的SERVICE
  public static final String REC_PKG_CHAR_UUID = "0000FFE1-0000-1000-8000-00805F9B34FB";     //接受数据要使用的characteristic的UUID
  public static final String SEND_PKG_CHAR_UUID = "0000FFE1-0000-1000-8000-00805F9B34FB";    //SEND_PKG_CHAR_UUID
  public static final String CLIENT_CHARACTERISTIC_CONFIG = "00002902-0000-1000-8000-00805f9b34fb";   //设置蓝牙通知的UUID

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);

    mWXSDKInstance = new WXSDKInstance(this);
    mWXSDKInstance.registerRenderListener(this);
    /**
     * WXSample 可以替换成自定义的字符串，针对埋点有效。
     * template 是.we transform 后的 js文件。
     * option 可以为空，或者通过option传入 js需要的参数。例如bundle js的地址等。
     * jsonInitData 可以为空。
     */
    Map<String,Object> options=new HashMap<>();
    options.put(WXSDKInstance.BUNDLE_URL,"file://index.js");
    //mWXSDKInstance.render("WXSample", WXFileUtils.loadAsset("index.js", this), null, null, WXRenderStrategy.APPEND_ASYNC);

    Observable.create(new Observable.OnSubscribe<String>() {

      @Override
      public void call(Subscriber<? super String> subscriber) {
        subscriber.onNext("Hello World");
      }
    }).map(new Func1<String, Integer>() {

      @Override
      public Integer call(String s) {
        return 0x102;
      }
    }).subscribe(new Action1<Integer>() {

      @Override
      public void call(Integer integer) {
        Log.e(TAG, "call: " + integer);
      }
    });


    //initBluetooth();
  }



  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (mWXSDKInstance != null && requestCode == BluetoothModule.REQUEST_CODE)
    {
      mWXSDKInstance.onActivityResult(requestCode, resultCode, data);
    }
  }

  private byte charToByte(char c) {
    return (byte) "0123456789ABCDEF".indexOf(c);
  }

  public  byte[] hexStringToBytes(String hexString) {
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

  /**
   * 初始化蓝牙适配器
   */
  private void initBluetooth() {
    mBluetoothManager = (BluetoothManager) this.getSystemService(Context.BLUETOOTH_SERVICE);
    if (mBluetoothManager != null) {
      mBluetoothAdapter = mBluetoothManager.getAdapter();
      if (mBluetoothAdapter != null) {
        if (!mBluetoothAdapter.isEnabled()) {
          mBluetoothAdapter.enable();  //打开蓝牙
        }
      }
      new Handler().postDelayed(new Runnable() {
        @Override
        public void run() {
          startLeScan();
        }
      },2000);
    }
  }

  /**
   * 关闭蓝牙适配器
   */
  public void closeBluetooth()
  {
    if(mBluetoothAdapter != null)
    {
      mBluetoothAdapter.disable();
      mBluetoothAdapter = null;
    }
  }

  /**
   * 搜索蓝牙
   */
  public void startLeScan() {
    if (mBluetoothAdapter == null) {
      return;
    }

    if (isScanning) {
      return;
    }
    isScanning = true;

    mBluetoothAdapter.startLeScan(mLeScanCallback);   //此mLeScanCallback为回调函数
    Log.i(TAG, "onLeScan() DeviceName------>"+"start scan");
    mHandler.sendEmptyMessageDelayed(STOP_LESCAN, 10*1000);  //这个搜索10秒，如果搜索不到则停止搜索
  }

  /**
   * 搜索结果回调
   */
  private BluetoothAdapter.LeScanCallback mLeScanCallback = new BluetoothAdapter.LeScanCallback() {
    @Override
    public void onLeScan(BluetoothDevice device, int arg1, byte[] arg2) {
      Log.i(TAG, "onLeScan() DeviceName------>"+device.getName());  //在这里可通过device这个对象来获取到搜索到的ble设备名称和一些相关信息
      if(device.getName() == null){
        return;
      }
      if (device.getName().contains("Go")) {    //判断是否搜索到你需要的ble设备
        Log.i(TAG, "onLeScan() DeviceAddress------>"+device.getAddress());
        mBluetoothDevice = device;   //获取到周边设备
        mBluetoothAdapter.stopLeScan(mLeScanCallback);   //1、当找到对应的设备后，立即停止扫描；2、不要循环搜索设备，为每次搜索设置适合的时间限制。避免设备不在可用范围的时候持续不停扫描，消耗电量。
        mHandler.removeMessages(STOP_LESCAN);
        connect();  //连接
      }
    }
  };

  /**
   * 连接蓝牙
   * @return
   */
  public boolean connect() {
    if (mBluetoothDevice == null) {
      Log.i(TAG, "BluetoothDevice is null.");
      return false;
    }

    mBluetoothGatt = mBluetoothDevice.connectGatt(this, false, mGattCallback);  //mGattCallback为回调接口

    if (mBluetoothGatt != null) {

      if (mBluetoothGatt.connect()) {
        Log.d(TAG, "Connect succeed.");
        return true;
      } else {
        Log.d(TAG, "Connect fail.");
        return false;
      }
    } else {
      Log.d(TAG, "BluetoothGatt null.");
      return false;
    }
  }

  /**
   * 连接结果回调
   */
  private final BluetoothGattCallback mGattCallback = new BluetoothGattCallback() {
    @Override
    public void onConnectionStateChange(BluetoothGatt gatt, int status, int newState) {
      if (newState == BluetoothProfile.STATE_CONNECTED) {
        gatt.discoverServices(); //执行到这里其实蓝牙已经连接成功了
        Log.i(TAG, "Connected to GATT server.");
      } else if (newState == BluetoothProfile.STATE_DISCONNECTED) {
        if(mBluetoothDevice != null){
          Log.i(TAG, "重新连接");
          connect();
        }else{
          Log.i(TAG, "Disconnected from GATT server.");
        }
      }
    }

    @Override
    public void onServicesDiscovered(BluetoothGatt gatt, int status) {
      if (status == BluetoothGatt.GATT_SUCCESS) {
        Log.i(TAG, "onServicesDiscovered");
        openBLEDataIn(); //打开BLE设备的 notify 通道
        BluetoothGattService service = mBluetoothGatt.getService(UUID.fromString(DATA_SERVICE_UUID));
        List<BluetoothGattCharacteristic> characteristics = service.getCharacteristics();
        BluetoothGattCharacteristic characteristic = service.getCharacteristic(UUID.fromString(REC_PKG_CHAR_UUID));
        List<BluetoothGattDescriptor> descriptors = characteristic.getDescriptors();
        for (int i=0;i<descriptors.size();i++)
        {
          Log.i(TAG, "descriptors" + descriptors.get(i).getUuid());
        }

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
    }


    //接受Characteristic被写的通知,收到蓝牙模块的数据后会触发onCharacteristicWrite
    @Override
    public void onCharacteristicWrite(BluetoothGatt gatt, BluetoothGattCharacteristic characteristic, int status) {
      Log.d(TAG,"status = " + status);
      byte[] value = characteristic.getValue();
      Log.d(TAG, "onCharacteristicWrite------>" + bytesToHexString(characteristic.getValue()));
    }
  };

  /**
   * 打开BLE设备的 notify 通道
   */
  public void openBLEDataIn()
  {
    if (mBluetoothGatt != null)
    {
      BluetoothGattService service = mBluetoothGatt.getService(UUID.fromString(DATA_SERVICE_UUID));

      if (service != null)
      {
        BluetoothGattCharacteristic characteristic = service.getCharacteristic(UUID.fromString(REC_PKG_CHAR_UUID));
        if (characteristic != null)
        {
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
   * 断开蓝牙连接
   */
  public synchronized boolean closeConnect()
  {
    if (mBluetoothGatt == null)
    {
      return false;
    }

    Log.i(TAG, "closeConnect() 蓝牙设备停止连接");

    mBluetoothGatt.disconnect(); //不一定触发 onConnectionStateChange
    mBluetoothGatt.close();
    mBluetoothGatt = null;

    return true;
  }

//  public void getBatteryLevel() {
//    BluetoothGattCharacteristic batteryLevelGattC = getCharcteristic(
//            "0000FF12-0000-1000-8000-00805f9b34fb", "0000FF02-0000-1000-8000-00805f9b34fb");
//    if (batteryLevelGattC != null) {
//      readCharacteristic(batteryLevelGattC);
//      setCharacteristicNotification(batteryLevelGattC, true); //设置当指定characteristic值变化时，发出通知。
//    }
//  }
//
//  //获取数据
//  public void readCharacteristic(BluetoothGattCharacteristic characteristic) {
//    if (mBluetoothAdapter == null || mBluetoothGatt == null) {
//      Log.e(TAG, "BluetoothAdapter not initialized");
//      return;
//    }
//    mBluetoothGatt.readCharacteristic(characteristic);
//  }
//
//  public boolean setCharacteristicNotification(BluetoothGattCharacteristic characteristic, boolean enabled) {
//    if (mBluetoothAdapter == null || mBluetoothGatt == null) {
//      Log.e(TAG, "BluetoothAdapter not initialized");
//      return false;
//    }
//    return mBluetoothGatt.setCharacteristicNotification(characteristic, enabled);
//  }

  private BluetoothGattCharacteristic getCharcteristic(String serviceUUID, String characteristicUUID)
  {
    //得到服务对象
    BluetoothGattService service = getService(UUID.fromString(serviceUUID));  //调用上面获取服务的方法

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

  public BluetoothGattService getService(UUID uuid) {
    if (mBluetoothAdapter == null || mBluetoothGatt == null) {
      Log.e(TAG, "BluetoothAdapter not initialized");
      return null;
    }
    return mBluetoothGatt.getService(uuid);
  }

  /**
   * 向蓝牙设备写入数据
   * @param data
   */
  public void write(byte[] data) {   //一般都是传byte
    //得到可写入的characteristic Utils.isAIRPLANE(mContext) &&
    if(!mBluetoothAdapter.isEnabled()){
      Log.e(TAG, "writeCharacteristic 开启飞行模式");
      return;
    }
    BluetoothGattCharacteristic writeCharacteristic = getCharcteristic(DATA_SERVICE_UUID,
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
    Log.e(TAG, "BluetoothAdapter 写入数据");
    boolean isBoolean = false;
    isBoolean = mBluetoothGatt.writeCharacteristic(characteristic);
    Log.e(TAG, "BluetoothAdapter_writeCharacteristic = " +isBoolean);  //如果isBoolean返回的是true则写入成功
  }

  private Handler mHandler = new Handler() {
    public void handleMessage(android.os.Message msg) {
      switch (msg.what) {
        case STOP_LESCAN:
        {
          mBluetoothAdapter.stopLeScan(mLeScanCallback);
          isScanning = false;
          //closeBluetooth();
          Log.i(TAG, "Scan time is up");
        }
        break;
      }
    };
  };

  /**
   * 　　* Convert byte[] to hex
   * string.这里我们可以将byte转换成int，然后利用Integer.toHexString(int)来转换成16进制字符串。
   * 　　* @param src byte[] data
   * 　　* @return hex string
   */
  public String bytesToHexString(byte[] src)
  {
    StringBuilder stringBuilder = new StringBuilder("");
    if (src == null || src.length <= 0) {
      return null;
    }
    for (int i = 0; i < src.length; i++)
    {
      int v = src[i] & 0xFF;
      String hv = Integer.toHexString(v);
      if (hv.length() < 2) {
        stringBuilder.append(0);
        System.out.println(stringBuilder);
      }
      stringBuilder.append(hv);
    }
    return stringBuilder.toString();
  }


  @Override
  public void onViewCreated(WXSDKInstance instance, View view) {
    setContentView(view);
  }

  @Override
  public void onRenderSuccess(WXSDKInstance instance, int width, int height) {

  }

  @Override
  public void onRefreshSuccess(WXSDKInstance instance, int width, int height) {

  }

  @Override
  public void onException(WXSDKInstance instance, String errCode, String msg) {

  }


  @Override
  protected void onResume() {
    super.onResume();
    if(mWXSDKInstance!=null){
      mWXSDKInstance.onActivityResume();
    }
  }

  @Override
  protected void onPause() {
    super.onPause();
    if(mWXSDKInstance!=null){
      mWXSDKInstance.onActivityPause();
    }
  }

  @Override
  protected void onStop() {
    super.onStop();
    if(mWXSDKInstance!=null){
      mWXSDKInstance.onActivityStop();
    }
    closeConnect();
  }

  @Override
  protected void onDestroy() {
    super.onDestroy();
    if(mWXSDKInstance!=null){
      mWXSDKInstance.onActivityDestroy();
    }
    closeConnect();
  }
}



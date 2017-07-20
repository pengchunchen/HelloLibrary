package com.weex.sample.extend.module;

import android.app.Application;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.util.Log;

import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.bridge.JSCallback;
import com.taobao.weex.common.WXModule;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by lixinke on 2017/3/3.
 */

public class PhoneInfoModule extends WXModule {

  private JSCallback mJSCallback;

  @JSMethod(uiThread = false)
  public void getPhoneInfo(JSCallback callback) {
    Map<String, String> infos = new HashMap<>();
    infos.put("board", Build.BOARD);
    infos.put("brand", Build.BRAND);
    infos.put("device", Build.DEVICE);
    infos.put("model", Build.MODEL);
    mJSCallback = callback;
    test(infos);
  }

  private void test(Map<String,String> maps)
  {
    mJSCallback.invoke(maps);
  }


  @JSMethod(uiThread = false)
  public void call(String phone) {
    System.out.println("电话号码" + phone);
    Intent intent = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:"+phone));
    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    mWXSDKInstance.getContext().startActivity(intent);
  }

  @JSMethod
  public void log(String str){
    Log.e("123", str);
  }
}

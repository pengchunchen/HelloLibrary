package com.weex.sample.extend.module;

import android.widget.Toast;

import com.taobao.weex.annotation.JSMethod;
import com.taobao.weex.common.WXModule;

/**
 * Created by Administrator on 2017/5/10.
 */

public class TestModule extends WXModule {
    @JSMethod
    public void printLog(String str){
        Toast.makeText(mWXSDKInstance.getContext(), str, Toast.LENGTH_SHORT).show();
    }
}

package com.weex.sample;

/**
 * Created by Administrator on 2017/7/17.
 */

public class TestClass {
    private static TestClass mTestClass = null;
    private TestClass(){}
    public static TestClass getInstance(){
     synchronized(TestClass.class){
        if(mTestClass == null)
        {
            mTestClass = new TestClass();
        }
        return mTestClass;
     }
    }


}

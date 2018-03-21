package com.mine.email.util;

import com.sun.xml.internal.messaging.saaj.packaging.mime.MessagingException;
import junit.framework.TestCase;

import javax.mail.*;
import java.io.IOException;
import java.util.Properties;

/**
 * ClassName: Test3
 * Description: //TODO
 * Created by feifei.liu on 2017/11/28 19:41
 **/
public class Test3 extends TestCase {
    public void test1() throws MessagingException, IOException, javax.mail.MessagingException {
        // 定义连接POP3服务器的属性信息
        String pop3Server = "pop.163.com";
        String protocol = "pop3";
        String username = "liuff2513@163.com";
        String password = "liuhaifei6174"; // QQ邮箱的SMTP的授权码，什么是授权码，它又是如何设置？
//String pop3Server = "pop.qq.com";
//        String protocol = "pop3";
//        String username = "602920108@qq.com";
//        String password = "getoduzinxrcbbie"; // QQ邮箱的SMTP的授权码，什么是授权码，它又是如何设置？

        Properties props = new Properties();
        props.setProperty("mail.transport.protocol", protocol); // 使用的协议（JavaMail规范要求）
        props.setProperty("mail.smtp.host", pop3Server); // 发件人的邮箱的 SMTP服务器地址

        // 获取连接
        Session session = Session.getDefaultInstance(props);
        session.setDebug(false);

        // 获取Store对象
        Store store = session.getStore(protocol);
        store.connect(pop3Server, username, password); // POP3服务器的登陆认证

        Folder defaultFolder = store.getDefaultFolder();
        Folder[] folders = defaultFolder.list();
        for (Folder folder:folders) {
            System.out.println(folder.hasNewMessages());
            System.out.println(folder.getName());
            System.out.println(folder.getFullName());
            System.out.println(folder.getURLName());
            System.out.println(folder.getMessageCount());
            System.out.println(folder.getDeletedMessageCount());
            System.out.println(folder.getNewMessageCount());
            System.out.println("---------------------");
        }

//        Folder folder1 = store.getFolder(String.valueOf(Folder.READ_WRITE));
//        System.out.println(folder1.getFullName()+": "+folder1.getURLName());
//        System.out.println(folder1.getMessageCount());


        // 通过POP3协议获得Store对象调用这个方法时，邮件夹名称只能指定为"INBOX"
        Folder folder = store.getFolder("INBOX");// 获得用户的邮件帐户
        folder.open(Folder.READ_WRITE); // 设置对邮件帐户的访问权限
        System.out.println(folder.hasNewMessages());
        Message[] messages = folder.getMessages();// 得到邮箱帐户中的所有邮件
        System.out.println(messages.length+"::");
//
//        for (Message message : messages) {
//            String subject = message.getSubject();// 获得邮件主题
//            Address from = (Address) message.getFrom()[0];// 获得发送者地址
//            System.out.println("邮件的主题为: " + subject + "\t发件人地址为: " + from);
//            System.out.println("邮件的内容为：");
//            message.writeTo(System.out);// 输出邮件内容到控制台
//        }

        folder.close(false);// 关闭邮件夹对象
        store.close(); // 关闭连接对象
    }
}

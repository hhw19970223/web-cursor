"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLoginStore } from "@/stores/login";
import {
  Button,
  Dropdown,
  DropdownItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
} from "flowbite-react";
import { v4 } from "uuid";
import { useGlobalComponentsStore } from "@/stores/global-components";

const traceparent = `00-${X7c()}-${Q7c()}-00`;
const Profile = () => {
  const { loginInfo, cursorUser, cookie, email } = useLoginStore();
  const interval = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useGlobalComponentsStore();
  const [openModal, setOneModal] = useState(false);
  const [cookieTxt, setCookieTxt] = useState("");

  const cleanLogin = () => {
    useLoginStore.setState({ loginInfo: null, cookie: "", cursorUser: null, email: "" });
  };

  const closeModal = () => {
    setOneModal(false);
    setCookieTxt("");
  };

  useEffect(() => {
    if (loginInfo && cookie && !cursorUser) {
      fetch("/api/cursor/me", {
        method: "POST",
        body: JSON.stringify({ WorkosCursorSessionToken: cookie }),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          useLoginStore.setState({ cursorUser: res });
        })
        .catch((err) => {
          cleanLogin();
          showToast("error", "cookie 有误请重新登录");
        });
    }
  }, [cursorUser, loginInfo, cookie]);

  useEffect(() => {
    if (loginInfo && !email) {
      fetch("/api/cursor/get-email", {
        method: "POST",
        body: JSON.stringify({ token: loginInfo.accessToken, traceparent }),
      })
        .then((res) => {
          return res.json()
        })
        .then((res) => {
          useLoginStore.setState({ email: res.email });
        })
        .catch((err) => {
          cleanLogin();
          showToast("error", "token 过期请重新登录");
        });
    }

    
    

  }, [cursorUser, loginInfo, cookie]);

  useEffect(() => {
    window.test = () => {
      const params = encodeURIComponent(JSON.stringify({ token: loginInfo?.accessToken, traceparent, xRequestId: v4() }));
      const eventSource = new EventSource(`/api/cursor/chat?data=${params}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data?.message?.streamUnifiedChatResponse) {
          console.log(data.message.streamUnifiedChatResponse);
          console.warn(data.message.streamUnifiedChatResponse.text);
        }
      };
  
      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        eventSource.close();
      };
    }
  }, [loginInfo]);

  const onLogin = async () => {
    const uuid = v4();
    cleanLogin();
    

    const verifier = "fBkpWJ6GxvcLGBELpLV0meh0KHOFtj-46PSqeW3oyLw";
    const challenge = "ykVpcg1QuMe5fx7cjBwG6N7s_YRWMR5oa5Y_qeeMpIA";
    // 打开登录地址
    window.open(
      `https://cursor.com/cn/loginDeepControl?challenge=${challenge}&uuid=${uuid}&mode=login`
    );

    if (interval.current) {
      clearInterval(interval.current);
    }

    interval.current = setInterval(() => {
      fetch("/api/cursor/login", {
        method: "POST",
        body: JSON.stringify({
          traceparent,
          verifier,
          uuid,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          useLoginStore.setState({ loginInfo: res });
          // setOneModal(true);
          if (interval.current) {
            clearInterval(interval.current);
          }
        });
    }, 1000);
  };

  return (
    <>
      {cursorUser || email ? (
        <span className="text-sm text-gray-500 ml-2">{cursorUser?.email || email}</span>
      ) : null}
      <div className="relative group/menu">
        {loginInfo ? (
          <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
            <Dropdown
              label=""
              className="rounded-sm w-44"
              dismissOnClick={false}
              renderTrigger={() => (
                <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
                  <Image
                    src="/images/profile/user-1.jpg"
                    alt="logo"
                    height="35"
                    width="35"
                    className="rounded-full"
                  />
                </span>
              )}
            >
              <DropdownItem onClick={cleanLogin}>Logout</DropdownItem>
            </Dropdown>
          </span>
        ) : (
          <Button
            color={"primary"}
            className="w-full bg-primary text-white rounded-xl cursor-pointer hover:shadow-sm hover:opacity-80"
            onClick={onLogin}
          >
            Login
          </Button>
        )}

        <Modal show={openModal} onClose={closeModal} popup>
          <ModalHeader />
          <ModalBody>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                请输入cursor域名下的WorkosCursorSessionToken
              </h3>
              <div>
                <TextInput
                  value={cookieTxt}
                  onChange={(event) => setCookieTxt(event.target.value)}
                  required
                  className="[&_input]:!rounded-md"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-end">
            <Button
              className="!rounded-md hover:opacity-80 bg-gray-200 text-gray-900"
              onClick={closeModal}
            >
              取消
            </Button>
            <Button
              color="primary"
              className="!rounded-md hover:opacity-80"
              onClick={() => {
                useLoginStore.setState({ cookie: cookieTxt });
                closeModal();
              }}
            >
              确认
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};

export default Profile;


function X7c() {
  const i = new Uint8Array(16);
  return (
    crypto.getRandomValues(i),
    Array.from(i, (e) => e.toString(16).padStart(2, "0")).join("")
  );
}
function Q7c() {
  const i = new Uint8Array(8);
  return (
    crypto.getRandomValues(i),
    Array.from(i, (e) => e.toString(16).padStart(2, "0")).join("")
  );
}
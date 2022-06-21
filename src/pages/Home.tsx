import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menubar } from "primereact/menubar";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { axiosInstance } from "../utils/axios";
import { Toast } from "primereact/toast";

interface HomeProps {
  accessToken: string;
  setAccessToken: (token: string) => void;
}

const Home = ({ accessToken, setAccessToken }: HomeProps) => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>();
  const [forkUrl, setForkUrl] = useState("");
  const [isForking, setForking] = useState(false);
  const toast = useRef<any>();

  const items = [
    {
      label: "Log out",
      icon: "pi pi-fw pi-power-off",
      command: () => {
        localStorage.clear();
        setAccessToken("");
        navigate("/sign-in");
      },
    },
  ];

  useEffect(() => {
    if (!accessToken) {
      navigate("/sign-in");
    }

    getUserInfo();
  }, [accessToken]);

  const getUserInfo = async () => {
    const res = await axiosInstance.get("/api/user");

    setUserInfo(res?.data ?? {});
  };

  const handleForkClick = async () => {
    if (!forkUrl) return;
    setForking(true);
    try {
      const forkUrlObj = forkUrl.split("/");
      const repoName = forkUrlObj.pop();
      const userName = forkUrlObj.pop();

      const res = await axiosInstance.post(`/api/repos/${userName}/${repoName}/forks`);

      toast.current.show({ severity: "success", summary: "Forked a repo", detail: "Success" });
    } catch (error: any) {
      toast.current.show({ severity: "error", summary: "Failed to fork", detail: error?.message ?? "Unknown error" });
    }
    setForking(false);
  };

  const footer = (
    <span>
      <Button onClick={handleForkClick}>Fork</Button>
    </span>
  );

  return (
    <div className="flex flex-column">
      <Toast ref={toast} />

      <Menubar model={items} />

      <div className="flex flex-row">
        <div className="col-4">
          <Card title="User Info">
            {userInfo && (
              <div className="flex flex-column">
                <div className="flex justify-content-center align-items center">
                  <Avatar image={userInfo.avartar_url} />
                </div>
                <div className="flex flex-column justify-content-start p-3">
                  <span className="py-2" style={{ textAlign: "start" }}>
                    User Name: {userInfo.name}
                  </span>
                  <span className="py-2" style={{ textAlign: "start" }}>
                    User Id: {userInfo.login}
                  </span>
                </div>
              </div>
            )}
          </Card>
        </div>
        <div className="col">
          <Card title="Fork" footer={footer}>
            <div>
              <InputText id="in" value={forkUrl} onChange={(e) => setForkUrl(e.target.value)} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;

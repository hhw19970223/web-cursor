export interface initialState {
  loginInfo: LoginInfo | null;
  cursorUser: CursorUser | null;
  cookie: string;
  email: string;
};



export interface LoginInfo {
  accessToken: string;
  refreshToken: string;
  challenge: string;
  authId: string;
  uuid: string;
};

export interface CursorUser {
  authId: string;
  userId: number;
  email: string;
  workosId: string;
  teamId: number;
  createdAt: string;
  isEnterpriseUser: boolean;
}
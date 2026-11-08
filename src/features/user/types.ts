export type Profile = {
  userId: number;
  email: string | null;
  name: string;
  nickname: string;
  phoneNumber: string;
  imageUrl: string | null;
  /** 이메일·비밀번호로 로그인할 수 있는 계정인지 (카카오로만 가입했으면 false) */
  emailLinked: boolean;
};

export type ProfileUpdate = {
  nickname: string;
  phoneNumber: string;
};

export type EmailLinkRequest = {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
};

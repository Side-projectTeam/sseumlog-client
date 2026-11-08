// 카카오 로그인 시작. 백엔드(Spring OAuth2)가 세션 쿠키로 state를 확인하므로
// 프록시(/api rewrite)를 거치지 않고 백엔드 주소로 바로 보낸다.
export function GET() {
  if (!process.env.API_URL) {
    return new Response("API_URL 환경 변수가 없습니다.", { status: 500 });
  }
  return Response.redirect(`${process.env.API_URL}/oauth2/authorization/kakao`, 302);
}

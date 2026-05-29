import { useNavigate } from 'react-router-dom';

import logoIcon from '../../assets/icons/logo.png';
import loginBgImage from '../../assets/images/loginbg.png';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    navigate('/dashboard');
  };

  return (
    <main className="min-h-screen bg-[#F4F7FB] text-[#111827]">
      <section className="flex min-h-screen items-center justify-center 2xl:px-6 2xl:py-8">
        <div className="grid min-h-screen w-full overflow-hidden bg-white lg:grid-cols-[1.1fr_0.9fr] 2xl:min-h-[44rem] 2xl:max-w-[1280px] 2xl:rounded-[16px] 2xl:shadow-[0_20px_64px_rgba(15,23,42,0.12)]">
          <section
            className="relative hidden min-h-screen overflow-hidden bg-[#080B28] bg-cover bg-center px-16 py-20 text-white lg:block 2xl:min-h-[44rem]"
            style={{ backgroundImage: `url(${loginBgImage})` }}
          >
            
            <div className="relative z-10 flex h-full flex-col justify-center">
              <div className="flex items-center gap-5">
                <img src={logoIcon} alt="" className="h-20 w-20 rounded-2xl object-contain" />
                <div>
                  <div className="text-[3.2rem] font-black leading-none tracking-[-0.04em]">
                    GARIM
                  </div>
                  <div className="mt-2 text-[2.8rem] font-light leading-none tracking-[-0.045em] text-[#9E68FF]">
                    Admin Service
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h1 className="text-xl font-black leading-8 tracking-[-0.02em]">
                  AI 서비스의 정책 적용 상태와 위험 탐지를
                  <br />
                  한눈에 관리하는 운영 보안 플랫폼
                </h1>
                <p className="mt-6 max-w-[32rem] text-sm font-semibold leading-6 text-white/76">
                  안정적이고 효율적인 AI 서비스 운영을 지원합니다.
                  <br />
                  정책 관리, 탐지 모니터링, 리포트 분석을 한 곳에서 경험하세요.
                </p>
              </div>
            </div>
          </section>

          <section className="flex min-h-screen items-center justify-center px-8 py-10 md:px-12 2xl:min-h-[44rem]">
            <form onSubmit={handleSubmit} className="w-full max-w-[440px]">
              <div>
                <h2 className="text-[2.2rem] font-black leading-tight tracking-[-0.04em] text-slate-950">
                  로그인
                </h2>
                <p className="mt-4 text-base font-semibold text-[#6B7280]">
                  관리자 계정으로 로그인해 주세요.
                </p>
              </div>

              <div className="mt-10 space-y-6">
                <label className="block">
                  <span className="text-sm font-bold text-[#5B6478]">이메일</span>
                  <input
                    type="email"
                    placeholder="admin@garim.com"
                    className="mt-3 h-13 w-full rounded-xl border border-[#D8DEE9] bg-white px-5 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#B8C0CE] focus:border-[#8B7CFF] focus:ring-4 focus:ring-[#EEEAFE]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-[#5B6478]">비밀번호</span>
                  <input
                    type="password"
                    placeholder="••••••••••••••"
                    className="mt-3 h-13 w-full rounded-xl border border-[#D8DEE9] bg-white px-5 text-sm font-semibold text-[#111827] outline-none transition placeholder:text-[#B8C0CE] focus:border-[#8B7CFF] focus:ring-4 focus:ring-[#EEEAFE]"
                  />
                </label>
              </div>

              <button
                type="submit"
                className="mt-10 flex h-13 w-full items-center justify-center rounded-xl border border-[#5B39D6] bg-[#5B39D6] text-base font-black text-white shadow-[0_14px_28px_rgba(91,57,214,0.22)] transition hover:bg-[#4C2FC0] active:bg-[#3E27A2]"
              >
                로그인
              </button>

              <div className="mt-12 border-t border-[#E5EAF3] pt-7 text-center text-sm font-bold text-[#8A93A5]">
                © 2026 GARIM Co., Ltd.
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}

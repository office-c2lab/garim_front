import { Info } from 'lucide-react';

import notFoundImage from '../../assets/images/404.png';

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-x-hidden overflow-y-auto bg-[#F8FAFF] px-5 py-6 text-[#111827] sm:py-8">
      <div
        aria-hidden="true"
        className="absolute left-[12%] top-[14%] h-24 w-24 opacity-45"
        style={{
          backgroundImage: 'radial-gradient(#CBB9FF 1.2px, transparent 1.2px)',
          backgroundSize: '10px 10px',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute right-[13%] bottom-[26%] h-28 w-28 opacity-35"
        style={{
          backgroundImage: 'radial-gradient(#CBB9FF 1.2px, transparent 1.2px)',
          backgroundSize: '10px 10px',
        }}
      />

      <section className="relative z-10 flex w-full max-w-[41.5rem] flex-col items-center rounded-[24px] border border-white bg-white px-8 py-10 text-center shadow-[0_24px_70px_rgba(91,57,214,0.13)] sm:px-14 sm:py-12 [@media(max-height:720px)]:max-w-[38rem] [@media(max-height:720px)]:py-8">
        <img
          src={notFoundImage}
          alt=""
          aria-hidden="true"
          className="h-32 w-32 object-contain sm:h-40 sm:w-40 [@media(max-height:720px)]:h-28 [@media(max-height:720px)]:w-28"
        />

        <h1 className="mt-5 bg-gradient-to-b from-[#5B39D6] to-[#A98AF6] bg-clip-text text-[5.25rem] font-black leading-none text-transparent sm:text-[7.3rem] [@media(max-height:720px)]:mt-4 [@media(max-height:720px)]:text-[5.8rem]">
          404
        </h1>
        <p className="mt-4 text-[1.3rem] font-black leading-8 text-[#111827] sm:text-[1.55rem] [@media(max-height:720px)]:mt-3">
          페이지를 찾을 수 없습니다.
        </p>
        <p className="mt-5 text-sm font-semibold leading-7 text-[#667085] sm:text-base [@media(max-height:720px)]:mt-3">
          요청하신 페이지가 존재하지 않거나,
          <br />
          접근 가능한 주소가 변경되었을 수 있습니다.
        </p>
        <p className="mt-2 text-sm font-semibold leading-7 text-[#667085] sm:text-base">
          입력한 주소를 다시 확인해 주세요.
        </p>

        <div className="mt-8 h-px w-full bg-[#E5EAF3] [@media(max-height:720px)]:mt-5" />

        <p className="mt-6 inline-flex items-center justify-center gap-2 text-xs font-semibold leading-5 text-[#8A94A6] sm:text-sm [@media(max-height:720px)]:mt-4">
          <Info className="h-4 w-4 shrink-0 text-[#6D4CFF]" aria-hidden="true" strokeWidth={2} />
          문제가 계속되면 관리자에게 문의해 주세요.
        </p>
      </section>
    </main>
  );
}

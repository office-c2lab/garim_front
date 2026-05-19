import {
  APP_PAGE_HORIZONTAL_PADDING_CLASS,
  APP_PAGE_INNER_WIDTH_CLASS,
  APP_PAGE_OUTER_WIDTH_CLASS,
} from '../constants/contentLayout.js';

export default function PageLayout({ children }) {
  return (
    <div
      className={`mx-auto w-full ${APP_PAGE_HORIZONTAL_PADDING_CLASS} pb-[clamp(2rem,4vw,3rem)] ${APP_PAGE_OUTER_WIDTH_CLASS}`.trim()}
    >
      <div
        className={`mx-auto flex min-h-full w-full flex-col gap-6 pt-5 sm:pt-8 ${APP_PAGE_INNER_WIDTH_CLASS}`.trim()}
      >
        {children}
      </div>
    </div>
  );
}
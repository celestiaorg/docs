// Get base path for font references
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function FontStyles() {
  const fontCss = `
    @font-face {
      font-family: 'UntitledSans';
      font-weight: 400;
      font-style: normal;
      src: url('${basePath}/fonts/untitled-sans/untitled-sans-regular.woff2') format('woff2');
      font-display: swap;
    }

    @font-face {
      font-family: 'UntitledSans';
      font-weight: 500;
      font-style: normal;
      src: url('${basePath}/fonts/untitled-sans/untitled-sans-medium.woff2') format('woff2');
      font-display: swap;
    }

    @font-face {
      font-family: 'Youth';
      font-weight: 400;
      font-style: normal;
      src: url('${basePath}/fonts/youth/Youth-Regular.woff2') format('woff2');
      font-display: swap;
    }

    /* Apply fonts */
    body {
      font-family: 'UntitledSans', sans-serif;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Youth', sans-serif;
      font-weight: 400;
    }

    /* Fix logo alignment */
    .nx-flex {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
  `;

  return <style dangerouslySetInnerHTML={{ __html: fontCss }} />;
}

